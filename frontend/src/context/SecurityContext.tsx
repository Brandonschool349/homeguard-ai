"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    SecurityEvent,
    EventStats,
    TimelineResponse,
} from "@/types/security";

import {
    getEvents,
    getStats,
    getTimeline,
    acknowledgeEvent,
} from "@/lib/security";

type SecurityContextType = {
    events: SecurityEvent[];
    stats: EventStats | null;
    timeline: TimelineResponse | null;

    selectedEvent: SecurityEvent | null;

    loading: boolean;

    refresh: () => Promise<void>;

    setSelectedEvent: (
        event: SecurityEvent | null
    ) => void;

    acknowledge: (
        id: string
    ) => Promise<void>;
};

const SecurityContext =
    createContext<SecurityContextType | null>(
        null
    );

export function SecurityProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [events, setEvents] = useState<
        SecurityEvent[]
    >([]);

    const [stats, setStats] =
        useState<EventStats | null>(null);

    const [timeline, setTimeline] =
        useState<TimelineResponse | null>(
            null
        );

    const [selectedEvent, setSelectedEvent] =
        useState<SecurityEvent | null>(null);

    const [loading, setLoading] =
        useState(true);

    const refresh = async () => {
        try {
            const [
                eventsData,
                statsData,
                timelineData,
            ] = await Promise.all([
                getEvents(),
                getStats(),
                getTimeline(),
            ]);

            setEvents(eventsData);
            setStats(statsData);
            setTimeline(timelineData);
        } catch (error) {
            console.error(error);
        }
    };

    const acknowledge = async (
        id: string
    ) => {
        await acknowledgeEvent(id);

        setEvents((prev) =>
            prev.map((event) =>
                event.id === id
                    ? {
                        ...event,
                        acknowledged: true,
                    }
                    : event
            )
        );

        await refresh();
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            await refresh();

            setLoading(false);
        };

        load();
    }, []);

    return (
        <SecurityContext.Provider
            value={{
                events,
                stats,
                timeline,
                selectedEvent,
                loading,
                refresh,
                acknowledge,
                setSelectedEvent,
            }}
        >
            {children}
        </SecurityContext.Provider>
    );
}

export function useSecurity() {
    const context =
        useContext(SecurityContext);

    if (!context) {
        throw new Error(
            "useSecurity must be used inside SecurityProvider"
        );
    }

    return context;
}