import time
import torch
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

app = FastAPI()

# CORS - permite que Next.js se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Cargando modelo...")

model_id = "meta-llama/Llama-3.2-3B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(r"C:\Users\brand\llama-finetuned-v2")
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    dtype=torch.float16,
    device_map="cuda"
)
model = PeftModel.from_pretrained(model, r"C:\Users\brand\llama-finetuned-v2")
model.eval()

print("Modelo listo!")

# =========================
# Esquemas
# =========================

class Mensaje(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: Optional[str] = "llama-local"
    messages: List[Mensaje]
    max_tokens: Optional[int] = 100
    temperature: Optional[float] = 0.7

# =========================
# Endpoints
# =========================

@app.get("/health")
def health():
    return {"status": "ok", "model": "llama-local"}

@app.post("/chat/completions")
def chat(req: ChatRequest):
    try:
        user_message = req.messages[-1].content
        prompt = f"User: {user_message}\nAssistant:"
        inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=req.max_tokens,
                temperature=req.temperature,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )

        generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]
        response_text = tokenizer.decode(
            generated_tokens,
            skip_special_tokens=True
        ).strip()

        return {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": req.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_text
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": int(inputs["input_ids"].shape[1]),
                "completion_tokens": int(len(generated_tokens)),
                "total_tokens": int(inputs["input_ids"].shape[1] + len(generated_tokens))
            }
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)