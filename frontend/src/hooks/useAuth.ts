"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import * as authLib from "@/lib/auth";
import type { User } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al montar componente
  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      try {
        const token = authLib.getToken();
        if (token) {
          // Token existe, pero no tenemos info del usuario desde el backend
          // Por ahora, marcamos como autenticado
          // En producción, validarías el token en el backend
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        authLib.logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setUser]);

  const register = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        await authLib.register(email, password);
        // Después de registrarse, redirigir a login
        router.push("/login");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const response = await authLib.login(email, password);
        setUser(response.user);
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setUser]
  );

  const logout = useCallback(() => {
    setError(null);
    authLib.logout();
    setUser(null);
    router.push("/login");
  }, [router, setUser]);

  const isAuthenticated = useCallback(() => {
    return authLib.isAuthenticated();
  }, []);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
  };
}
