from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/health")
async def health():
    """Public health check endpoint (no auth required)"""
    return {
        "status": "ok",
        "model": "llama-local"
    }