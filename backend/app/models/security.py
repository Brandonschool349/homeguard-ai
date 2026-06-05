"""Security domain models for HomeGuard AI Event Engine."""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime
import uuid


class EventSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class EventSource(str, Enum):
    camera = "camera"
    sensor = "sensor"
    manual = "manual"
    system = "system"


class EventType(str, Enum):
    motion_detected = "motion_detected"
    person_detected = "person_detected"
    face_recognized = "face_recognized"
    unknown_face = "unknown_face"
    door_opened = "door_opened"
    door_closed = "door_closed"
    window_opened = "window_opened"
    glass_break = "glass_break"
    package_delivered = "package_delivered"
    vehicle_detected = "vehicle_detected"
    animal_detected = "animal_detected"
    noise_detected = "noise_detected"
    sensor_triggered = "sensor_triggered"
    system_alert = "system_alert"
    manual_report = "manual_report"


# ── Input Models ──────────────────────────────────────────────

class SecurityEventCreate(BaseModel):
    """Input model for creating a new security event."""
    event_type: EventType
    source: EventSource = EventSource.system
    zone_id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    metadata: Optional[dict] = {}


class TimelineFilter(BaseModel):
    """Filters for timeline and event list queries."""
    severity: Optional[EventSeverity] = None
    zone_id: Optional[str] = None
    event_type: Optional[EventType] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    search: Optional[str] = None
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)


class SecurityQueryRequest(BaseModel):
    """Natural language security query input."""
    question: str


# ── Document Models ───────────────────────────────────────────

class SecurityEventDoc(BaseModel):
    """Full security event document stored in MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: EventType
    source: EventSource = EventSource.system
    severity: EventSeverity = EventSeverity.low
    zone_id: Optional[str] = None
    title: str
    description: str = ""
    ai_summary: Optional[str] = None
    ai_reasoning: Optional[str] = None
    confidence: Optional[float] = None
    acknowledged: bool = False
    acknowledged_at: Optional[str] = None
    user_email: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    metadata: dict = Field(default_factory=dict)


class ZoneDoc(BaseModel):
    """A physical zone/area in the property."""
    id: str
    name: str
    description: str = ""
    icon: str = "📍"
    device_ids: List[str] = Field(default_factory=list)


# ── Response Models ───────────────────────────────────────────

class EventStatsResponse(BaseModel):
    """Dashboard statistics."""
    total_today: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    last_event_time: Optional[str] = None
    acknowledged_count: int = 0
    unacknowledged_count: int = 0


class TimelineGroup(BaseModel):
    """A group of events for a single day in the timeline."""
    date: str
    events: List[SecurityEventDoc]
    summary: Optional[str] = None


class TimelineResponse(BaseModel):
    """Response for the timeline endpoint."""
    groups: List[TimelineGroup]
    total_events: int


class SecurityQueryResponse(BaseModel):
    """Response for natural language security queries."""
    answer: str
    events: List[SecurityEventDoc]
    query: str


# ── Default Zones ─────────────────────────────────────────────

DEFAULT_ZONES: List[ZoneDoc] = [
    ZoneDoc(id="front_door", name="Front Door", description="Main entrance area", icon="🚪"),
    ZoneDoc(id="backyard", name="Backyard", description="Rear outdoor area", icon="🌿"),
    ZoneDoc(id="garage", name="Garage", description="Vehicle and storage area", icon="🏠"),
    ZoneDoc(id="driveway", name="Driveway", description="Front vehicle approach", icon="🛣️"),
    ZoneDoc(id="interior", name="Interior", description="Indoor living spaces", icon="🏡"),
    ZoneDoc(id="side_yard", name="Side Yard", description="Lateral perimeter", icon="🌲"),
]
