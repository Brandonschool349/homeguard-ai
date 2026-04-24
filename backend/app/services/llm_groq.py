import time
import httpx
from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """
You are HomeGuard AI, an intelligent home security assistant.
Follow these rules strictly:
- Answer ONLY what the user asks, nothing more
- Be concise and accurate in your responses
- Be conversational and natural, like ChatGPT
- Use markdown formatting when helpful
- Respond in the same language the user uses
- If asked about security events, analyze them carefully
- You have access to cameras and motion sensors in the home
"""

def generate_groq_response(req):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
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