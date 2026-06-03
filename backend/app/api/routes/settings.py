from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import SettingsDoc
from app.core.database import settings_col
from app.core.dependencies import get_current_user

router = APIRouter(tags=["settings"])

SETTINGS_ID = "global"

@router.get("/settings", response_model=SettingsDoc)
async def get_settings(current_user = Depends(get_current_user)):
    doc = await settings_col.find_one({"id": SETTINGS_ID})
    if not doc:
        return SettingsDoc()
    doc.pop("_id", None)
    doc.pop("id", None)
    return SettingsDoc(**doc)

@router.put("/settings", response_model=SettingsDoc)
async def save_settings(
    settings: SettingsDoc,
    current_user = Depends(get_current_user)
):
    data = settings.model_dump()
    await settings_col.update_one(
        {"id": SETTINGS_ID},
        {"$set": data},
        upsert=True
    )
    return settings