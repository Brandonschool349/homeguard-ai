"use client";

import IncidentCard from "./IncidentCard";
import { SecurityEvent } from "@/types/security";

type Props = {
    events: SecurityEvent[];
    onSelect: (event: SecurityEvent) => void;
    onAcknowledge: (id: string) => void;
};

export default function IncidentGrid({
    events,
    onSelect,
    onAcknowledge,
}: Props) {
    return (
        <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-5
    ">
            {events.map((event) => (
                <IncidentCard
                    key={event.id}
                    event={event}
                    onSelect={onSelect}
                    onAcknowledge={onAcknowledge}
                />
            ))}
        </div>
    );
}