from app.models.security import (
    EventSeverity,
    SecurityEventCreate,
    EventType,
)


async def classify_event(
    event: SecurityEventCreate,
) -> tuple[EventSeverity, str]:
    """
    Future LLM-powered classifier.

    For Phase 1 we use rule-based classification.
    """

    return classify_event_rule_based(event)


def classify_event_rule_based(
    event: SecurityEventCreate,
) -> tuple[EventSeverity, str]:

    critical_events = {
        EventType.glass_break,
        EventType.unknown_face,
    }

    high_events = {
        EventType.person_detected,
        EventType.noise_detected,
    }

    medium_events = {
        EventType.vehicle_detected,
        EventType.door_opened,
    }

    if event.event_type in critical_events:
        return (
            EventSeverity.critical,
            "Critical security event detected.",
        )

    if event.event_type in high_events:
        return (
            EventSeverity.high,
            "Potentially suspicious activity detected.",
        )

    if event.event_type in medium_events:
        return (
            EventSeverity.medium,
            "Unusual activity detected.",
        )

    return (
        EventSeverity.low,
        "Routine activity.",
    )