from fastapi import APIRouter, HTTPException, status
from app.models.schemas import RegisterRequest, LoginRequest, AuthResponse, User
from app.core.database import users
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=dict)
async def register(req: RegisterRequest):
    existing = await users.find_one({"email": req.email})

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Registration failed"
        )

    user_doc = {
        "email": req.email,
        "hashed_password": hash_password(req.password),
        "role": "viewer"
    }

    result = await users.insert_one(user_doc)

    return {
        "message": "User registered successfully",
        "id": str(result.inserted_id)
    }

from app.models.schemas import User

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    user_doc = await users.find_one({"email": req.email})

    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(
        req.password,
        user_doc.get("hashed_password", "")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": user_doc["email"],
        "role": user_doc.get("role", "viewer")
    })

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=User(
            id=str(user_doc["_id"]),
            email=user_doc["email"],
            role=user_doc.get("role", "viewer")
        )
    )