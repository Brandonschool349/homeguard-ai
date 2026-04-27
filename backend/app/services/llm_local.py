import time
import torch
import asyncio
from transformers import AutoTokenizer, AutoModelForCausalLM

print("Cargando modelo local...")

model_id = "meta-llama/Llama-3.2-3B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    dtype=torch.float16,
    device_map="cuda"
)
model.eval()

eot_id = tokenizer.convert_tokens_to_ids("<|eot_id|>")
eot_ids = [tokenizer.eos_token_id, eot_id]

print("Modelo local listo!")

BASE_PROMPT = """You are HomeGuard AI, an intelligent home security assistant.
You monitor cameras, detect faces, and help manage security rules.
Answer ONLY what the user asks. Be concise and professional.
Respond in the same language the user uses."""

def build_system_prompt(custom_prompt: str = "") -> str:
    if custom_prompt.strip():
        return f"{BASE_PROMPT}\n\nAdditional instructions: {custom_prompt}"
    return BASE_PROMPT

def _run_inference(req):
    messages = [{"role": "system", "content": build_system_prompt(req.custom_prompt)}]
    for msg in req.messages:
        messages.append({"role": msg.role, "content": msg.content})

    input_text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    inputs = tokenizer(input_text, return_tensors="pt").to("cuda")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=req.max_tokens,
            temperature=req.temperature,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=eot_ids,
            repetition_penalty=1.2,
        )

    generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    response_text = tokenizer.decode(generated_tokens, skip_special_tokens=False).strip()

    for stop in ["<|eot_id|>", "<|end_of_text|>", "User:", "user:"]:
        if stop in response_text:
            response_text = response_text.split(stop)[0].strip()

    response_text = response_text.replace("<|end_of_text|>", "").strip()

    return {
        "id": f"chatcmpl-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": req.model,
        "choices": [{
            "index": 0,
            "message": {"role": "assistant", "content": response_text},
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": int(inputs["input_ids"].shape[1]),
            "completion_tokens": int(len(generated_tokens)),
            "total_tokens": int(inputs["input_ids"].shape[1] + len(generated_tokens))
        }
    }

async def generate_local_response(req):
    return await asyncio.to_thread(_run_inference, req)