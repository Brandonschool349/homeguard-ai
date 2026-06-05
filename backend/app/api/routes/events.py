from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from app.core.dependencies import get_current_user

from app.models.security import (
    SecurityEventCreate,
    TimelineFilter,
    SecurityQueryRequest,
)

from app.services.event_engine import (
    create_event,
    get_events,
    get_event_by_id,
    get_timeline,
    get_event_stats,
    acknowledge_event,
    simulate_events,
)

from app.services.alert_classifier import (
    classify_event,
)

from app.services.incident_summary import (
    generate_summary,
)

router = APIRouter(
    prefix="/events",
    tags=["events"],
)

@router.post("/")
async def create_security_event(
    payload: SecurityEventCreate,
    current_user=Depends(get_current_user),
):

    severity, reasoning = await classify_event(payload)

    summary = (
        f"{payload.title}. "
        f"Severity classified as {severity.value}."
    )

    return await create_event(
        event_data=payload,
        user_email=current_user["email"],
        severity=severity,
        ai_summary=summary,
        ai_reasoning=reasoning,
    )

@router.get("/")
async def list_events(
    severity: str | None = None,
    zone_id: str | None = None,
    limit: int = Query(50),
    offset: int = Query(0),
    current_user=Depends(get_current_user),
):

    filters = TimelineFilter(
        severity=severity,
        zone_id=zone_id,
        limit=limit,
        offset=offset,
    )

    return await get_events(
        current_user["email"],
        filters,
    )

@router.get("/stats")
async def stats(
    current_user=Depends(get_current_user),
):
    return await get_event_stats(
        current_user["email"]
    )

@router.get("/timeline")
async def timeline(
    current_user=Depends(get_current_user),
):

    filters = TimelineFilter()

    return await get_timeline(
        current_user["email"],
        filters,
    )

@router.get("/{event_id}")
async def event_detail(
    event_id: str,
    current_user=Depends(get_current_user),
):

    return await get_event_by_id(
        event_id,
        current_user["email"],
    )

@router.post("/acknowledge/{event_id}")
async def acknowledge(
    event_id: str,
    current_user=Depends(get_current_user),
):

    ok = await acknowledge_event(
        event_id,
        current_user["email"],
    )

    return {"success": ok}

@router.post("/simulate")
async def simulate(
    count: int = 8,
    current_user=Depends(get_current_user),
):

    return await simulate_events(
        current_user["email"],
        count,
    )

@router.post("/query")
async def query_events(
    payload: SecurityQueryRequest,
    current_user=Depends(get_current_user),
):

    events = await get_events(
        current_user["email"],
        TimelineFilter(limit=50),
    )

    return {
        "query": payload.question,
        "events": events,
        "answer": f"Found {len(events)} matching events.",
    }