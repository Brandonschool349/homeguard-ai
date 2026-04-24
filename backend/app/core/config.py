import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    LOCAL_MODEL_ID: str = os.getenv("LOCAL_MODEL_ID", "meta-llama/Llama-3.2-3B-Instruct")
    LOCAL_MODEL_PATH: str = os.getenv("LOCAL_MODEL_PATH", "")
    CORS_ORIGINS: list = ["http://localhost:3000"]

settings = Settings()