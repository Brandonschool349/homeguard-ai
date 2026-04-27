from fastapi import APIRouter
from app.models.schemas import SettingsDoc
from app.core.database import settings_col

router = APIRouter()

SETTINGS_ID = "global"

@router.get("/settings", response_model=SettingsDoc)
async def get_settings():
    doc = await settings_col.find_one({"id": SETTINGS_ID})
    if not doc:
        return SettingsDoc()
    doc.pop("_id", None)
    doc.pop("id", None)
    return SettingsDoc(**doc)

@router.put("/settings", response_model=SettingsDoc)
async def save_settings(settings: SettingsDoc):
    data = settings.model_dump()
    await settings_col.update_one(
        {"id": SETTINGS_ID},
        {"$set": data},
        upsert=True
    )
    return settings