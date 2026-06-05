"use client";

import { EventStats } from "@/types/security";

export default function SecurityScore({
    stats,
}: {
    stats: EventStats | null;
}) {
    if (!stats) return null;

    const score =
        100 -
        stats.critical_count * 20 -
        stats.high_count * 10 -
        stats.medium_count * 5;

    const finalScore =
        Math.max(score, 0);

    return (
        <div className="
      rounded-2xl
      bg-gradient-to-r
      from-cyan-950
      to-slate-950
      border border-cyan-500/20
      p-6
    ">
            <div className="text-white/60 text-sm">
                Security Score
            </div>

            <div className="text-5xl font-bold mt-2">
                {finalScore}
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full mt-4">

                <div
                    style={{
                        width: `${finalScore}%`,
                    }}
                    className="
            h-full
            rounded-full
            bg-cyan-400
          "
                />

            </div>
        </div>
    );
}