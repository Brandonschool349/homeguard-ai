import time
import httpx
from app.core.database import settings_col

BASE_PROMPT = """You are HomeGuard AI, an intelligent home security assistant.
You monitor cameras, detect faces, and help manage security rules.
Answer ONLY what the user asks. Be concise and professional.
Respond in the same language the user uses."""

def build_system_prompt(custom_prompt: str = "") -> str:
    if custom_prompt.strip():
        return f"{BASE_PROMPT}\n\nAdditional instructions: {custom_prompt}"
    return BASE_PROMPT

async def generate_custom_response(req):
    settings = await settings_col.find_one({"id": "global"})

    if not settings:
        raise Exception("Custom provider settings not found")

    api_url = settings.get("custom_api_url", "").strip()
    api_key = settings.get("custom_api_key", "").strip()
    model = settings.get("custom_model", "").strip()

    if not api_url or not model:
        raise Exception("Custom API URL or model not configured")

    messages = [{"role": "system", "content": build_system_prompt(req.custom_prompt)}]

    for msg in req.messages:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    headers = {
        "Content-Type": "application/json",
    }

    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": req.max_tokens,
        "temperature": req.temperature,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            api_url,
            headers=headers,
            json=payload
        )

    response.raise_for_status()
    data = response.json()

    return {
        "id": f"chatcmpl-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": (
                    data.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                )
            },
            "finish_reason": "stop"
        }],
    }