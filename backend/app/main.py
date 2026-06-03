from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes.chat import router as chat_router
from app.api.routes.health import router as health_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.settings import router as settings_router
from app.api.routes.auth import router as auth_router
from app.core.config import settings
from app.core.db_init import setup_database_indexes
from app.core.database import client, db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting HomeGuard AI Backend...")
    try:
        # Test MongoDB connection
        await client.admin.command("ping")
        print("✓ MongoDB connected")
        
        # Setup indexes
        await setup_database_indexes(db)
        print("✓ Database indexes configured")
    except Exception as e:
        print(f"✗ Failed to initialize database: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down HomeGuard AI Backend...")
    client.close()

app = FastAPI(
    title="HomeGuard AI Backend",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(health_router)
app.include_router(conversations_router)
app.include_router(settings_router)
app.include_router(auth_router)