"use client";

import { useState } from "react";
import { LLMProvider } from "@/types";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import AgentPermissions from "./AgentPermissions";
import LanguageSelector from "./LanguageSelector";
import StorageSettings from "./StorageSettings";

export default function SettingsView() {
  const { primaryProvider, setPrimaryProvider, fallbackEnabled, setFallbackEnabled } = useSettingsStore();
  const [systemPrompt, setSystemPrompt] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
          <p className="text-sm text-gray-500">Configure your HomeGuard AI agent</p>
        </div>

        {/* AI Provider */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">AI Provider</h3>

          <div className="space-y-3">
            {(["groq", "local"] as LLMProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => setPrimaryProvider(p)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  primaryProvider === p
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  primaryProvider === p ? "border-green-400" : "border-gray-600"
                }`}>
                  {primaryProvider === p && <div className="w-2 h-2 rounded-full bg-green-400" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {p === "groq" ? "⚡ Groq API" : "🖥️ Local LLM"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p === "groq"
                      ? "Fast cloud inference — llama-3.3-70b"
                      : "Private local inference — llama-3.2-3b"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-white">Enable fallback</p>
              <p className="text-xs text-gray-500">Switch to backup provider if primary fails</p>
            </div>
            <button
              onClick={() => setFallbackEnabled(!fallbackEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                fallbackEnabled ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                fallbackEnabled ? "left-7" : "left-1"
              }`} />
            </button>
          </div>
        </section>

        {/* Agent Personality */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Agent Personality</h3>
          <p className="text-xs text-gray-500">Add custom instructions to personalize how your agent responds</p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400 resize-none transition-colors"
            placeholder="e.g. Always respond in Spanish. Be friendly and use simple language..."
          />
        </section>

        <AgentPermissions />
        <LanguageSelector />
        <StorageSettings provider={primaryProvider} />

        {/* API Keys */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">API Keys</h3>
          <p className="text-xs text-gray-500">Add your own API keys for third party providers</p>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Groq API Key</label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>
        </section>

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            saved ? "bg-green-500 text-black" : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>

      </div>
    </div>
  );
}