"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { LLMProvider, User, Alert } from "@/types";

type AppContextType = {
  // LLM
  provider: LLMProvider;
  setProvider: (p: LLMProvider) => void;
  isLocalOnline: boolean;
  setIsLocalOnline: (v: boolean) => void;

  // Auth
  user: User | null;
  setUser: (u: User | null) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<LLMProvider>("local");
  const [isLocalOnline, setIsLocalOnline] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  }, []);

  return (
    <AppContext.Provider value={{
      provider, setProvider,
      isLocalOnline, setIsLocalOnline,
      user, setUser,
      alerts, addAlert, resolveAlert,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}