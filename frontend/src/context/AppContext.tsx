"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LLMProvider, User, Alert } from "@/types";
import * as authLib from "@/lib/auth";
import { setUnauthorizedCallback } from "@/lib/api";

type AppContextType = {
  // LLM
  provider: LLMProvider;
  setProvider: (p: LLMProvider) => void;
  isLocalOnline: boolean;
  setIsLocalOnline: (v: boolean) => void;

  // Auth
  user: User | null;
  setUser: (u: User | null) => void;
  isLoading: boolean;

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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Escuchar eventos de desautorización desde el API Helper
  useEffect(() => {
    setUnauthorizedCallback(() => {
      authLib.logout();
      setUser(null);
      
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const isAuthPage = path.includes("/login") || path.includes("/register");
        if (!isAuthPage) {
          router.push("/login");
        }
      }
    });

    return () => {
      setUnauthorizedCallback(null);
    };
  }, [router]);

  // Restaurar sesión una única vez al montar la aplicación
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);

      try {
        const token = authLib.getToken();

        if (token) {
          const user = await authLib.getCurrentUser();

          if (user) {
            setUser(user);
          } else {
            authLib.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        authLib.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

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
      isLoading,
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