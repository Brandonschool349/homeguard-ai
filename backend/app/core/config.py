import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "replace_this_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # Database
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "homeguard")
    
    # LLM Providers
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    LOCAL_MODEL_ID: str = os.getenv("LOCAL_MODEL_ID", "meta-llama/Llama-3.2-3B-Instruct")
    LOCAL_MODEL_PATH: str = os.getenv("LOCAL_MODEL_PATH", "")
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

settings = Settings()