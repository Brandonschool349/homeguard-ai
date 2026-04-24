"use client";

import { useState } from "react";
import { LLMProvider } from "@/types";

type Props = {
  provider: LLMProvider;
};

const localLimits = [
  { label: "100 MB", value: 100 },
  { label: "500 MB", value: 500 },
  { label: "1 GB", value: 1000 },
  { label: "Unlimited", value: -1 },
];

export default function StorageSettings({ provider }: Props) {
  const [localLimit, setLocalLimit] = useState(500);
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Storage & History
      </h3>

      {provider === "local" ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Set the maximum storage for local chat history
          </p>
          <div className="flex gap-2 flex-wrap">
            {localLimits.map((limit) => (
              <button
                key={limit.value}
                onClick={() => setLocalLimit(limit.value)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  localLimit === limit.value
                    ? "border-green-500/50 bg-green-500/10 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {limit.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
          <span className="text-lg">☁️</span>
          <div>
            <p className="text-sm text-white">Cloud storage</p>
            <p className="text-xs text-gray-500">Last 50 conversations saved automatically</p>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Clear chat history</p>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
          <button
            onClick={handleClear}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              cleared
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            }`}
          >
            {cleared ? "✓ Cleared" : "Clear History"}
          </button>
        </div>
      </div>
    </section>
  );
}