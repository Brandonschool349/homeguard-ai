"""Event Engine — Core event processing and storage for HomeGuard AI."""

from datetime import datetime, timedelta
from typing import Optional, List
from itertools import groupby
import uuid
import random

from app.core.database import security_events
from app.models.security import (
    SecurityEventCreate,
    SecurityEventDoc,
    EventSeverity,
    EventSource,
    EventType,
    EventStatsResponse,
    TimelineGroup,
    TimelineResponse,
    TimelineFilter,
    DEFAULT_ZONES,
)


async def create_event(
    event_data: SecurityEventCreate,
    user_email: str,
    severity: EventSeverity = EventSeverity.low,
    ai_summary: Optional[str] = None,
    ai_reasoning: Optional[str] = None,
) -> SecurityEventDoc:
    """Create and store a new security event."""
    doc = SecurityEventDoc(
        id=str(uuid.uuid4()),
        event_type=event_data.event_type,
        source=event_data.source,
        severity=severity,
        zone_id=event_data.zone_id,
        title=event_data.title,
        description=event_data.description or "",
        ai_summary=ai_summary,
        ai_reasoning=ai_reasoning,
        confidence=event_data.confidence,
        user_email=user_email,
        timestamp=datetime.utcnow().isoformat(),
        metadata=event_data.metadata or {},
    )

    await security_events.insert_one(doc.model_dump())
    return doc


async def get_events(
    user_email: str,
    filters: TimelineFilter,
) -> List[SecurityEventDoc]:
    """Retrieve events with filters."""
    query: dict = {"user_email": user_email}

    if filters.severity:
        query["severity"] = filters.severity.value

    if filters.zone_id:
        query["zone_id"] = filters.zone_id

    if filters.event_type:
        query["event_type"] = filters.event_type.value

    if filters.date_from:
        query.setdefault("timestamp", {})["$gte"] = filters.date_from

    if filters.date_to:
        query.setdefault("timestamp", {})["$lte"] = filters.date_to

    if filters.search:
        query["$or"] = [
            {"title": {"$regex": filters.search, "$options": "i"}},
            {"description": {"$regex": filters.search, "$options": "i"}},
            {"ai_summary": {"$regex": filters.search, "$options": "i"}},
        ]

    cursor = security_events.find(query).sort("timestamp", -1)
    cursor = cursor.skip(filters.offset).limit(filters.limit)

    docs = await cursor.to_list(length=filters.limit)
    results = []
    for doc in docs:
        doc.pop("_id", None)
        results.append(SecurityEventDoc(**doc))
    return results


async def get_event_by_id(
    event_id: str, user_email: str
) -> Optional[SecurityEventDoc]:
    """Retrieve a single event by ID."""
    doc = await security_events.find_one({"id": event_id, "user_email": user_email})
    if not doc:
        return None
    doc.pop("_id", None)
    return SecurityEventDoc(**doc)


async def acknowledge_event(event_id: str, user_email: str) -> bool:
    """Mark an event as acknowledged."""
    result = await security_events.update_one(
        {"id": event_id, "user_email": user_email},
        {"$set": {
            "acknowledged": True,
            "acknowledged_at": datetime.utcnow().isoformat(),
        }},
    )
    return result.modified_count > 0


async def get_timeline(
    user_email: str, filters: TimelineFilter
) -> TimelineResponse:
    """Get events grouped by day for the timeline view."""
    events = await get_events(user_email, filters)

    groups: List[TimelineGroup] = []
    for date_key, group_events in groupby(
        events, key=lambda e: e.timestamp[:10]
    ):
        events_list = list(group_events)
        groups.append(TimelineGroup(
            date=date_key,
            events=events_list,
        ))

    return TimelineResponse(
        groups=groups,
        total_events=sum(len(g.events) for g in groups),
    )


async def get_event_stats(user_email: str) -> EventStatsResponse:
    """Get dashboard statistics for today's events."""
    today_start = datetime.utcnow().replace(
        hour=0, minute=0, second=0, microsecond=0
    ).isoformat()

    query = {"user_email": user_email, "timestamp": {"$gte": today_start}}

    total = await security_events.count_documents(query)
    critical = await security_events.count_documents({**query, "severity": "critical"})
    high = await security_events.count_documents({**query, "severity": "high"})
    medium = await security_events.count_documents({**query, "severity": "medium"})
    low = await security_events.count_documents({**query, "severity": "low"})
    ack = await security_events.count_documents({**query, "acknowledged": True})

    last_event = await security_events.find_one(
        {"user_email": user_email},
        sort=[("timestamp", -1)],
    )
    last_time = last_event["timestamp"] if last_event else None

    return EventStatsResponse(
        total_today=total,
        critical_count=critical,
        high_count=high,
        medium_count=medium,
        low_count=low,
        last_event_time=last_time,
        acknowledged_count=ack,
        unacknowledged_count=total - ack,
    )


# ── Event Simulator ──────────────────────────────────────────

SIMULATION_SCENARIOS = [
    {
        "event_type": EventType.person_detected,
        "source": EventSource.camera,
        "zone_id": "front_door",
        "title": "Person detected at front door",
        "description": "An unidentified individual was detected lingering near the main entrance for approximately 3 minutes.",
        "severity": EventSeverity.high,
        "confidence": 0.92,
    },
    {
        "event_type": EventType.motion_detected,
        "source": EventSource.sensor,
        "zone_id": "backyard",
        "title": "Motion detected in backyard",
        "description": "Motion sensor triggered in the rear garden area. Duration: 15 seconds.",
        "severity": EventSeverity.low,
        "confidence": 0.78,
    },
    {
        "event_type": EventType.unknown_face,
        "source": EventSource.camera,
        "zone_id": "front_door",
        "title": "Unknown face detected",
        "description": "Face detected that does not match any registered household members. Person remained at door for 4 minutes.",
        "severity": EventSeverity.critical,
        "confidence": 0.94,
    },
    {
        "event_type": EventType.package_delivered,
        "source": EventSource.camera,
        "zone_id": "front_door",
        "title": "Package delivery detected",
        "description": "A delivery driver placed a package at the doorstep and left within 30 seconds.",
        "severity": EventSeverity.low,
        "confidence": 0.97,
    },
    {
        "event_type": EventType.vehicle_detected,
        "source": EventSource.camera,
        "zone_id": "driveway",
        "title": "Unknown vehicle in driveway",
        "description": "An unregistered vehicle parked in the driveway for 12 minutes.",
        "severity": EventSeverity.medium,
        "confidence": 0.85,
    },
    {
        "event_type": EventType.door_opened,
        "source": EventSource.sensor,
        "zone_id": "garage",
        "title": "Garage door opened",
        "description": "The garage door sensor detected an opening event outside normal hours.",
        "severity": EventSeverity.medium,
        "confidence": 1.0,
    },
    {
        "event_type": EventType.noise_detected,
        "source": EventSource.sensor,
        "zone_id": "side_yard",
        "title": "Loud noise detected",
        "description": "Audio sensor detected a sharp noise consistent with glass breaking or metal impact.",
        "severity": EventSeverity.high,
        "confidence": 0.71,
    },
    {
        "event_type": EventType.animal_detected,
        "source": EventSource.camera,
        "zone_id": "backyard",
        "title": "Animal detected in backyard",
        "description": "Camera identified a medium-sized animal moving through the garden area.",
        "severity": EventSeverity.low,
        "confidence": 0.88,
    },
    {
        "event_type": EventType.person_detected,
        "source": EventSource.camera,
        "zone_id": "driveway",
        "title": "Person walking near driveway",
        "description": "A pedestrian was observed walking along the driveway perimeter. No entry attempted.",
        "severity": EventSeverity.low,
        "confidence": 0.82,
    },
    {
        "event_type": EventType.glass_break,
        "source": EventSource.sensor,
        "zone_id": "interior",
        "title": "Glass break sensor activated",
        "description": "The glass break sensor on the west-facing window triggered. Vibration pattern consistent with forced entry.",
        "severity": EventSeverity.critical,
        "confidence": 0.96,
    },
]


async def simulate_events(user_email: str, count: int = 8) -> List[SecurityEventDoc]:
    """Generate realistic demo security events spread across the last 24 hours."""
    from app.services.alert_classifier import classify_event_rule_based

    selected = random.sample(
        SIMULATION_SCENARIOS, min(count, len(SIMULATION_SCENARIOS))
    )

    created_events: List[SecurityEventDoc] = []
    now = datetime.utcnow()

    for i, scenario in enumerate(selected):
        # Spread events over the last 24 hours
        time_offset = timedelta(
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59),
        )
        event_time = now - time_offset

        doc = SecurityEventDoc(
            id=str(uuid.uuid4()),
            event_type=scenario["event_type"],
            source=scenario["source"],
            severity=scenario["severity"],
            zone_id=scenario["zone_id"],
            title=scenario["title"],
            description=scenario["description"],
            confidence=scenario["confidence"],
            user_email=user_email,
            timestamp=event_time.isoformat(),
            ai_summary=f"AI Analysis: {scenario['description']} Severity classified as {scenario['severity'].value} based on time of day, zone sensitivity, and event characteristics.",
            ai_reasoning=f"Classification factors: event_type={scenario['event_type'].value}, zone={scenario['zone_id']}, confidence={scenario['confidence']}, time={event_time.strftime('%H:%M')}",
            metadata={},
        )

        await security_events.insert_one(doc.model_dump())
        created_events.append(doc)

    return created_events
