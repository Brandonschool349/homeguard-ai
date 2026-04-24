from pydantic import BaseModel
from typing import List, Optional, Literal

class Mensaje(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: Optional[str] = "llama-local"
    messages: List[Mensaje]
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7
    provider: Literal["local", "groq"] = "local"