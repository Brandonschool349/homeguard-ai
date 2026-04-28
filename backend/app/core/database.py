from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["homeguard"]

conversations = db["conversations"]
messages = db["messages"]
settings_col = db["settings"]
users = db["users"]