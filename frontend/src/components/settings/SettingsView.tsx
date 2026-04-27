"use client";

import { useEffect, useState } from "react";
import { LLMProvider } from "@/types";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import AgentPermissions from "./AgentPermissions";
import LanguageSelector from "./LanguageSelector";
import StorageSettings from "./StorageSettings";

export default function SettingsView() {
  const {
    primaryProvider, setPrimaryProvider,
    fallbackEnabled, setFallbackEnabled,
    systemPrompt, setSystemPrompt,
    customApiUrl, setCustomApiUrl,
    customApiKey, setCustomApiKey,
    customModel, setCustomModel,
    loadSettings, persistSettings,
  } = useSettingsStore();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await persistSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings. Is the backend running?");
    } finally {
      setSaving(false);
    }
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
            {(["groq", "local", "custom"] as LLMProvider[]).map((p) => (
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
                    {p === "groq"
                      ? "⚡ Groq API"
                      : p === "local"
                      ? "🖥️ Local LLM"
                      : "🔧 Custom API"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p === "groq"
                      ? "Fast cloud inference — llama-3.3-70b"
                      : p === "local"
                      ? "Private local inference — llama-3.2-3b"
                      : "Use any OpenAI-compatible API"}
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

        {primaryProvider === "custom" && (
        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Custom Provider
          </h3>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">API URL</label>
            <input
              value={customApiUrl}
              onChange={(e) => setCustomApiUrl(e.target.value)}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">API Key</label>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Model</label>
            <input
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="gpt-4o-mini"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>
        </section>
      )}

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? "bg-green-500 text-black"
              : saving
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}