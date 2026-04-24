"use client";

import { LLMProvider } from "@/types";

type Props = {
  provider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
};

export default function ProviderSelector({ provider, onProviderChange }: Props) {
  return (
    <div className="flex items-center gap-3 px-6 py-2 bg-gray-900 border-b border-gray-800">
      <span className="text-xs text-gray-500 font-medium">AI Provider:</span>

      <div className="flex items-center gap-1 bg-gray-800 rounded-full p-1">
        <button
          onClick={() => onProviderChange("groq")}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            provider === "groq"
              ? "bg-green-500 text-black font-semibold shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          ⚡ Groq
        </button>
        <button
          onClick={() => onProviderChange("local")}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            provider === "local"
              ? "bg-blue-500 text-white font-semibold shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🖥️ Local LLM
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${
          provider === "groq" ? "bg-green-400" : "bg-blue-400"
        } animate-pulse`} />
        <span className="text-xs text-gray-500">
          {provider === "groq" ? "Groq API — llama-3.3-70b" : "Local — llama-3.2-3b"}
        </span>
      </div>
    </div>
  );
}