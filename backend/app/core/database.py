from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.MONGO_DB_NAME]

conversations = db["conversations"]
messages = db["messages"]
settings_col = db["settings"]
users = db["users"]
security_events = db["security_events"]
zones = db["zones"]