"use client";

import { create } from "zustand";
import { LLMProvider } from "@/types";
import { getSettings, saveSettings } from "@/lib/api";

type SettingsState = {
  primaryProvider: LLMProvider;
  fallbackEnabled: boolean;
  systemPrompt: string;
  customApiUrl: string;
  customApiKey: string;
  customModel: string;
  loaded: boolean;
  permissions: Record<string, boolean>;
  setPrimaryProvider: (provider: LLMProvider) => void;
  setFallbackEnabled: (enabled: boolean) => void;
  setSystemPrompt: (prompt: string) => void;
  setCustomApiUrl: (url: string) => void;
  setCustomApiKey: (key: string) => void;
  setCustomModel: (model: string) => void;
  loadSettings: () => Promise<void>;
  persistSettings: () => Promise<void>;
  setPermission: (id: string, enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  primaryProvider: "groq",
  fallbackEnabled: true,
  systemPrompt: "",
  customApiUrl: "",
  customApiKey: "",
  customModel: "",
  loaded: false,
  permissions: {
  camera_monitoring: true,
  motion_detection: true,
  face_recognition: true,
  alerts: true,
  night_mode: false,
},

  setPrimaryProvider: (provider) => set({ primaryProvider: provider }),
  setFallbackEnabled: (enabled) => set({ fallbackEnabled: enabled }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setCustomApiUrl: (url) => set({ customApiUrl: url }),
  setCustomApiKey: (key) => set({ customApiKey: key }),
  setCustomModel: (model) => set({ customModel: model }),
  setPermission: (id, enabled) =>
  set((state) => ({
    permissions: {
      ...state.permissions,
      [id]: enabled,
    },
  })),

  loadSettings: async () => {
    try {
      const data = await getSettings();
      set({
        primaryProvider: data.primary_provider,
        fallbackEnabled: data.fallback_enabled,
        systemPrompt: data.system_prompt,
        customApiUrl: data.custom_api_url,
        customApiKey: data.custom_api_key,
        customModel: data.custom_model,
        permissions: data.permissions ?? {
          camera_monitoring: true,
          motion_detection: true,
          face_recognition: true,
          alerts: true,
          night_mode: false,
        },
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  persistSettings: async () => {
    const {
      primaryProvider,
      fallbackEnabled,
      systemPrompt,
      customApiUrl,
      customApiKey,
      customModel,
      permissions,
    } = get();

    await saveSettings({
      primary_provider: primaryProvider,
      fallback_enabled: fallbackEnabled,
      system_prompt: systemPrompt,
      groq_api_key: "",
      custom_api_url: customApiUrl || "",
      custom_api_key: customApiKey || "",
      custom_model: customModel || "",
      permissions,
    });
  },
}));