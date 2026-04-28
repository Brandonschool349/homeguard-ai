from pydantic import BaseModel
from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr, Field

class Mensaje(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: Optional[str] = "llama-local"
    messages: List[Mensaje]
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7
    provider: Literal["local", "groq", "custom"] = "local"
    custom_prompt: Optional[str] = ""
    conversation_id: Optional[str] = None

class MessageDoc(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    provider: Optional[str] = None
    fallback: bool = False

class ConversationDoc(BaseModel):
    id: str
    title: str
    provider: str
    messages: List[MessageDoc]
    created_at: str
    updated_at: str
    
class SettingsDoc(BaseModel):
    primary_provider: Literal["local", "groq", "custom"] = "groq"
    fallback_enabled: bool = True
    system_prompt: str = ""
    
    groq_api_key: str = ""
    
    custom_api_url: str = ""
    custom_api_key: str = ""
    custom_model: str = ""

    permissions: dict[str, bool] = {
    "camera_monitoring": True,
    "motion_detection": True,
    "face_recognition": True,
    "alerts": True,
    "night_mode": False,
}
    
class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)