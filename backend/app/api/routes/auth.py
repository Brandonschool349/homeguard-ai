from fastapi import APIRouter
from app.models.schemas import RegisterRequest, LoginRequest
from app.core.security import hash_password, verify_password
from app.core.database import users

router = APIRouter()

@router.post("/auth/register")
async def register(req: RegisterRequest):
    existing = await users.find_one({"email": req.email})

    if existing:
        return {"error": "User already exists"}

    user = {
        "email": req.email,
        "password": hash_password(req.password),
    }

    await users.insert_one(user)

    return {"message": "User created successfully"}

@router.post("/auth/login")
async def login(req: LoginRequest):
    user = await users.find_one({"email": req.email})

    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(req.password, user["password"]):
        return {"error": "Invalid credentials"}

    return {"message": "Login successful"}