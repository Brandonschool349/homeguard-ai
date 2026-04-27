from fastapi import APIRouter, Query
from app.core.database import conversations
from datetime import datetime
import uuid

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.get("/")
async def get_conversations():
    docs = await conversations.find().sort("updated_at", -1).to_list(50)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.post("/")
async def create_conversation(provider: str = Query(default="groq")):
    now = datetime.utcnow().isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "title": "New conversation",
        "provider": provider,
        "messages": [],
        "created_at": now,
        "updated_at": now,
    }
    await conversations.insert_one(doc)
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str):
    doc = await conversations.find_one({"id": conversation_id})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str):
    await conversations.delete_one({"id": conversation_id})
    return {"deleted": conversation_id}

@router.delete("/")
async def delete_all_conversations():
    await conversations.delete_many({})
    return {"deleted": "all"}