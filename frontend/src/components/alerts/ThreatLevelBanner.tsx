"use client";

import { EventStats } from "@/types/security";

type Props = {
    stats: EventStats | null;
};

export default function ThreatLevelBanner({
    stats,
}: Props) {
    if (!stats) return null;

    let level = "LOW";

    if (stats.high_count >= 3) {
        level = "MEDIUM";
    }

    if (stats.high_count >= 5) {
        level = "HIGH";
    }

    if (stats.critical_count >= 3) {
        level = "CRITICAL";
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
            <div className="text-sm text-white/60">
                Current Security Posture
            </div>

            <div className="text-3xl font-bold mt-1">
                Threat Level: {level}
            </div>
        </div>
    );
}