"use client";

import { EventStats } from "@/types/security";

type Props = {
    stats: EventStats | null;
};

function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
            <div className="text-xs uppercase tracking-wider text-white/50">
                {label}
            </div>

            <div className={`text-3xl font-bold mt-2 ${color}`}>
                {value}
            </div>
        </div>
    );
}

export default function AlertStatsCards({
    stats,
}: Props) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Critical Alerts"
                value={stats.critical_count}
                color="text-red-400"
            />

            <StatCard
                label="High Alerts"
                value={stats.high_count}
                color="text-orange-400"
            />

            <StatCard
                label="Medium Alerts"
                value={stats.medium_count}
                color="text-yellow-400"
            />

            <StatCard
                label="Low Alerts"
                value={stats.low_count}
                color="text-blue-400"
            />
        </div>
    );
}