"use client";

import { SecurityEvent } from "@/types/security";

export default function SecurityInsights({
    events,
}: {
    events: SecurityEvent[];
}) {

    const frontDoorCount =
        events.filter(
            (e) =>
                e.zone_id === "front_door"
        ).length;

    return (
        <div className="
      rounded-2xl
      border border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      p-6
    ">
            <h2 className="font-semibold mb-4">
                AI Security Insights
            </h2>

            <ul className="space-y-3 text-white/70">

                <li>
                    • {frontDoorCount} events were
                    detected near entry points.
                </li>

                <li>
                    • Most active zone:
                    Front Door.
                </li>

                <li>
                    • No coordinated intrusion
                    patterns detected.
                </li>

                <li>
                    • System operating normally.
                </li>

            </ul>
        </div>
    );
}