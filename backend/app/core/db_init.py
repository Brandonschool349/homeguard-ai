"""Database setup and index management"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings


async def setup_database_indexes(db: AsyncIOMotorDatabase):
    """Create indexes for database collections"""
    
    # Users collection - unique index on email
    await db["users"].create_index("email", unique=True)
    
    # Conversations collection - compound index for user_email and created_at
    await db["conversations"].create_index([("user_email", 1), ("created_at", -1)])
    
    # Conversations collection - index on id for faster lookups
    await db["conversations"].create_index("id", unique=False)

    # Security events - compound index for user queries
    await db["security_events"].create_index([("user_email", 1), ("timestamp", -1)])
    await db["security_events"].create_index([("user_email", 1), ("severity", 1)])
    await db["security_events"].create_index([("user_email", 1), ("zone_id", 1)])
    await db["security_events"].create_index([("user_email", 1), ("event_type", 1)])
    await db["security_events"].create_index("id", unique=True)

    # Zones
    await db["zones"].create_index("id", unique=True)
    
    print("✓ Database indexes created successfully")


async def initialize_database():
    """Initialize database connection and setup"""
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.MONGO_DB_NAME]
    
    try:
        # Test connection
        await client.admin.command("ping")
        print("✓ MongoDB connection successful")
        
        # Setup indexes
        await setup_database_indexes(db)
        
        return db
    except Exception as e:
        print(f"✗ Failed to initialize database: {e}")
        raise
