from fastapi import APIRouter
from app.models.schemas import ChatRequest
from app.services.llm_router import route_request

router = APIRouter()

@router.post("/chat/completions")
def chat(req: ChatRequest):
    try:
        return route_request(req)
    except Exception as e:
        return {"error": str(e)}