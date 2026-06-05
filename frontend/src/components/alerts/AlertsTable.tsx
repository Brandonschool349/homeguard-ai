"use client";

import { SecurityEvent } from "@/types/security";
import SeverityBadge from "./SeverityBadge";

type Props = {
    events: SecurityEvent[];

    onSelect: (
        event: SecurityEvent
    ) => void;

    onAcknowledge: (
        id: string
    ) => void;
};

export default function AlertsTable({
    events,
    onSelect,
    onAcknowledge,
}: Props) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
                <h2 className="font-semibold">
                    Security Events
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="text-left px-4 py-3">
                                Severity
                            </th>

                            <th className="text-left px-4 py-3">
                                Event
                            </th>

                            <th className="text-left px-4 py-3">
                                Zone
                            </th>

                            <th className="text-left px-4 py-3">
                                Time
                            </th>

                            <th className="text-left px-4 py-3">
                                Status
                            </th>

                            <th className="text-left px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="border-t border-white/5"
                            >
                                <td className="px-4 py-3">
                                    <SeverityBadge
                                        severity={event.severity}
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    {event.title}
                                </td>

                                <td className="px-4 py-3">
                                    {event.zone_id}
                                </td>

                                <td className="px-4 py-3 text-sm text-white/60">
                                    {new Date(
                                        event.timestamp
                                    ).toLocaleString()}
                                </td>

                                <td className="px-4 py-3">
                                    {event.acknowledged
                                        ? "Acknowledged"
                                        : "Open"}
                                </td>

                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() =>
                                            onSelect(event)
                                        }
                                        className="text-cyan-400 hover:text-cyan-300"
                                    >
                                        View
                                    </button>

                                    {!event.acknowledged && (
                                        <button
                                            onClick={() =>
                                                onAcknowledge(
                                                    event.id
                                                )
                                            }
                                            className="text-green-400 hover:text-green-300"
                                        >
                                            Ack
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}