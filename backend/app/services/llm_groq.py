import time
import httpx
from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

BASE_PROMPT = """You are HomeGuard AI, an intelligent home security assistant.
You monitor cameras, detect faces, and help manage security rules.
Answer ONLY what the user asks. Be concise and professional.
Respond in the same language the user uses."""

def build_system_prompt(custom_prompt: str = "") -> str:
    if custom_prompt.strip():
        return f"{BASE_PROMPT}\n\nAdditional instructions: {custom_prompt}"
    return BASE_PROMPT

def generate_groq_response(req):
    messages = [{"role": "system", "content": build_system_prompt(req.custom_prompt)}]
    for msg in req.messages:
        messages.append({"role": msg.role, "content": msg.content})

    response = httpx.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": messages,
            "max_tokens": req.max_tokens,
            "temperature": req.temperature,
        },
        timeout=30.0
    )

    response.raise_for_status()
    data = response.json()

    return {
        "id": f"chatcmpl-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": GROQ_MODEL,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": data["choices"][0]["message"]["content"]
            },
            "finish_reason": "stop"
        }],
    }