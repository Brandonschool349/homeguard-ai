from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.chat import router as chat_router
from app.api.routes.health import router as health_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.settings import router as settings_router

app = FastAPI(title="HomeGuard AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(health_router)
app.include_router(conversations_router)
app.include_router(settings_router)