from typing import List

from app.models.security import (
    SecurityEventDoc,
    SecurityQueryResponse,
)


async def generate_summary(
    event: SecurityEventDoc,
) -> str:

    return (
        f"{event.title}. "
        f"Detected in zone '{event.zone_id}'. "
        f"Severity: {event.severity.value}."
    )


async def generate_timeline_narrative(
    events: List[SecurityEventDoc],
) -> str:

    if not events:
        return "No security activity detected."

    critical = len(
        [e for e in events if e.severity.value == "critical"]
    )

    high = len(
        [e for e in events if e.severity.value == "high"]
    )

    return (
        f"{len(events)} events detected. "
        f"{critical} critical alerts and "
        f"{high} high-priority alerts."
    )


async def answer_security_query(
    question: str,
    events: List[SecurityEventDoc],
) -> SecurityQueryResponse:

    answer = await generate_timeline_narrative(events)

    return SecurityQueryResponse(
        query=question,
        answer=answer,
        events=events,
    )