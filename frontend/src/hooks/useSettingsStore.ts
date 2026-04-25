"use client";

import { create } from "zustand";
import { LLMProvider } from "@/types";

type SettingsState = {
  primaryProvider: LLMProvider;
  fallbackEnabled: boolean;
  setPrimaryProvider: (provider: LLMProvider) => void;
  setFallbackEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  primaryProvider: "groq",
  fallbackEnabled: true,

  setPrimaryProvider: (provider) =>
    set({ primaryProvider: provider }),

  setFallbackEnabled: (enabled) =>
    set({ fallbackEnabled: enabled }),
}));