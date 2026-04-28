from fastapi import APIRouter
from app.models.schemas import ChatRequest
from app.services.llm_router import route_request
from app.core.database import conversations
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/chat/completions")
async def chat(req: ChatRequest):
    try:
        result = await route_request(req)
        response_content = result["choices"][0]["message"]["content"]

        if req.conversation_id:
            now = datetime.utcnow().isoformat()
            user_msg = {
                "id": str(uuid.uuid4()),
                "role": "user",
                "content": req.messages[-1].content,
                "timestamp": now,
            }
            assistant_msg = {
                "id": str(uuid.uuid4()),
                "role": "assistant",
                "content": response_content,
                "timestamp": now,
                "provider": result.get("provider_used"),
                "fallback": result.get("fallback", False),
            }
            title = req.messages[-1].content[:40] + "..." if len(req.messages[-1].content) > 40 else req.messages[-1].content
            await conversations.update_one(
                {"id": req.conversation_id},
                {
                    "$push": {"messages": {"$each": [user_msg, assistant_msg]}},
                    "$set": {"updated_at": now, "title": title}
                }
            )

        return result
    except Exception as e:
        return {"error": str(e)}