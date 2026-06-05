"use client";

import { SecurityEvent } from "@/types/security";
import SeverityBadge from "./SeverityBadge";

type Props = {
    event: SecurityEvent | null;

    onClose: () => void;
};

export default function EventDetailDrawer({
    event,
    onClose,
}: Props) {
    if (!event) return null;

    return (
        <div className="fixed top-0 right-0 h-full w-[500px] bg-[#0b1220] border-l border-white/10 z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        Event Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4">
                    <SeverityBadge
                        severity={event.severity}
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="text-white/50 text-sm">
                            Title
                        </div>

                        <div>{event.title}</div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm">
                            Zone
                        </div>

                        <div>{event.zone_id}</div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm">
                            Timestamp
                        </div>

                        <div>
                            {new Date(
                                event.timestamp
                            ).toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm">
                            AI Summary
                        </div>

                        <div>
                            {event.ai_summary}
                        </div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm">
                            AI Reasoning
                        </div>

                        <div>
                            {event.ai_reasoning}
                        </div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm">
                            Description
                        </div>

                        <div>
                            {event.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}