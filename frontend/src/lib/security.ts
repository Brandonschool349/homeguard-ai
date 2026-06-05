import { getToken } from "./auth";

const BACKEND =
    process.env.NEXT_PUBLIC_LOCAL_API_URL ??
    "http://localhost:8000";

function getHeaders(token: string | null) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export async function getEvents() {
    const token = getToken();

    const res = await fetch(
        `${BACKEND}/events`,
        {
            headers: getHeaders(token),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch events");
    }

    return res.json();
}

export async function getStats() {
    const token = getToken();

    const res = await fetch(
        `${BACKEND}/events/stats`,
        {
            headers: getHeaders(token),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch stats");
    }

    return res.json();
}

export async function getTimeline() {
    const token = getToken();

    const res = await fetch(
        `${BACKEND}/events/timeline`,
        {
            headers: getHeaders(token),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch timeline");
    }

    return res.json();
}

export async function getEvent(
    id: string
) {
    const token = getToken();

    const res = await fetch(
        `${BACKEND}/events/${id}`,
        {
            headers: getHeaders(token),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch event");
    }

    return res.json();
}

export async function acknowledgeEvent(
    id: string
) {
    const token = getToken();

    const res = await fetch(
        `${BACKEND}/events/acknowledge/${id}`,
        {
            method: "POST",
            headers: getHeaders(token),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to acknowledge event");
    }

    return res.json();
}