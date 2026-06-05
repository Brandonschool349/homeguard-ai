"use client";

import { TimelineResponse } from "@/types/security";

type Props = {
    timeline: TimelineResponse | null;
};

export default function EventTimeline({
    timeline,
}: Props) {
    if (!timeline) return null;

    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5 h-full">
            <h2 className="font-semibold mb-4">
                Event Timeline
            </h2>

            <div className="space-y-6">
                {timeline.groups.map((group) => (
                    <div key={group.date}>
                        <div className="text-sm text-white/50 mb-2">
                            {group.date}
                        </div>

                        <div className="space-y-2">
                            {group.events.map((event) => (
                                <div
                                    key={event.id}
                                    className="border-l border-white/20 pl-3"
                                >
                                    <div className="text-sm font-medium">
                                        {event.title}
                                    </div>

                                    <div className="text-xs text-white/50">
                                        {new Date(
                                            event.timestamp
                                        ).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}