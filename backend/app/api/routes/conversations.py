from fastapi import APIRouter, Query, HTTPException, status, Depends
from app.core.database import conversations
from app.core.dependencies import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.get("/")
async def get_conversations(current_user = Depends(get_current_user)):
    docs = await conversations.find({
        "user_email": current_user["email"]
    }).to_list(length=100)

    for doc in docs:
        doc["_id"] = str(doc["_id"])

    return docs

@router.post("/")
async def create_conversation(
    provider: str = Query(default="groq"),
    current_user = Depends(get_current_user)
):
    now = datetime.utcnow().isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "title": "New conversation",
        "provider": provider,
        "messages": [],
        "created_at": now,
        "updated_at": now,
        "user_email": current_user["email"],  # Link to user
    }
    await conversations.insert_one(doc)
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    doc = await conversations.find_one({"id": conversation_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    # Optionally: verify user owns this conversation
    # if doc.get("user_email") != current_user["email"]:
    #     raise HTTPException(status_code=403, detail="Forbidden")
    doc["_id"] = str(doc["_id"])
    return doc

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    result = await conversations.delete_one({"id": conversation_id,"user_email": current_user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    return {"deleted": conversation_id}

@router.delete("/")
async def delete_all_conversations(current_user = Depends(get_current_user)):
    await conversations.delete_many({"user_email": current_user["email"]})
    return {"deleted": "all"}