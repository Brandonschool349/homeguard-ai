"use client";

import { useSettingsStore } from "@/hooks/useSettingsStore";

export default function ProviderSelector() {
  const { primaryProvider, setPrimaryProvider } = useSettingsStore();

  return (
    <div className="flex items-center gap-3 px-6 py-2 bg-gray-900 border-b border-gray-800">
      <span className="text-xs text-gray-500 font-medium">AI Provider:</span>

      <div className="flex items-center gap-1 bg-gray-800 rounded-full p-1">
        <button
          onClick={() => setPrimaryProvider("groq")}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            primaryProvider === "groq"
              ? "bg-green-500 text-black font-semibold shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          ⚡ Groq
        </button>

        <button
          onClick={() => setPrimaryProvider("local")}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            primaryProvider === "local"
              ? "bg-blue-500 text-white font-semibold shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🖥️ Local LLM
        </button>

        <button
          onClick={() => setPrimaryProvider("custom")}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            primaryProvider === "custom"
              ? "bg-purple-500 text-white font-semibold shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🔧 Custom
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${
          primaryProvider === "groq"
            ? "bg-green-400"
            : primaryProvider === "local"
            ? "bg-blue-400"
            : "bg-purple-400"
        } animate-pulse`} />

        <span className="text-xs text-gray-500">
          {primaryProvider === "groq"
            ? "Groq API — llama-3.3-70b"
            : primaryProvider === "local"
            ? "Local — llama-3.2-3b"
            : "Custom API"}
        </span>
      </div>
    </div>
  );
}