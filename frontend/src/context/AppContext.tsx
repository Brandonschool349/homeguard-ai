"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LLMProvider, User, Alert } from "@/types";
import * as authLib from "@/lib/auth";

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
  const pathname = usePathname();

  // Restaurar sesión al montar
  useEffect(() => {
    const restoreSession = () => {
      setIsLoading(true);
      try {
        const token = authLib.getToken();
        if (token) {
           // Sólo sabemos que existe token
         // El usuario real se restaurará después
        } else {
          // Sin token, limpiar usuario
          setUser(null);
          
          // Redirigir a login si está en ruta protegida
          const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
          if (!isAuthPage && pathname !== "/") {
            router.push("/login");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [router, pathname]);

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