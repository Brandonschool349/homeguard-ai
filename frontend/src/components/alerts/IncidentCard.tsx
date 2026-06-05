"use client";

import { motion } from "framer-motion";
import { SecurityEvent } from "@/types/security";

type Props = {
    event: SecurityEvent;
    onSelect: (event: SecurityEvent) => void;
    onAcknowledge: (id: string) => void;
};

export default function IncidentCard({
    event,
    onSelect,
    onAcknowledge,
}: Props) {

    const severityStyles = {
        critical:
            "border-red-500/30 bg-red-500/5",
        high:
            "border-orange-500/30 bg-orange-500/5",
        medium:
            "border-yellow-500/30 bg-yellow-500/5",
        low:
            "border-sky-500/30 bg-sky-500/5",
    };

    return (
        <motion.div
            whileHover={{
                scale: 1.02,
            }}
            className={`
        rounded-2xl
        overflow-hidden
        border
        backdrop-blur-xl
        ${severityStyles[event.severity]}
      `}
        >
            <div className="aspect-video bg-slate-900 flex items-center justify-center text-white/20">
                Camera Snapshot
            </div>

            <div className="p-4">

                <div className="flex justify-between">

                    <div>

                        <div className="font-semibold">
                            {event.title}
                        </div>

                        <div className="text-white/50 text-sm">
                            {event.zone_id}
                        </div>

                    </div>

                    <div className="text-xs uppercase">
                        {event.severity}
                    </div>

                </div>

                <div className="mt-4 text-sm text-white/70">
                    {event.description}
                </div>

                {event.confidence && (
                    <div className="mt-3 text-xs text-cyan-400">
                        AI Confidence: {Math.round(event.confidence * 100)}%
                    </div>
                )}

                <div className="flex gap-2 mt-4">

                    <button
                        onClick={() => onSelect(event)}
                        className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm"
                    >
                        Investigate
                    </button>

                    {!event.acknowledged && (
                        <button
                            onClick={() =>
                                onAcknowledge(event.id)
                            }
                            className="px-3 py-2 rounded-lg bg-white/5 text-white text-sm"
                        >
                            Acknowledge
                        </button>
                    )}

                </div>

            </div>
        </motion.div>
    );
}