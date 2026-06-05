export type Severity =
    | "low"
    | "medium"
    | "high"
    | "critical";

export interface SecurityEvent {
    id: string;

    event_type: string;
    source: string;

    severity: Severity;

    zone_id?: string;

    title: string;
    description: string;

    ai_summary?: string;
    ai_reasoning?: string;

    confidence?: number;

    acknowledged: boolean;
    acknowledged_at?: string;

    user_email?: string;

    timestamp: string;

    metadata: Record<string, unknown>;
}

export interface EventStats {
    total_today: number;

    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;

    acknowledged_count: number;
    unacknowledged_count: number;

    last_event_time: string | null;
}

export interface TimelineGroup {
    date: string;
    events: SecurityEvent[];
    summary?: string;
}

export interface TimelineResponse {
    groups: TimelineGroup[];
    total_events: number;
}