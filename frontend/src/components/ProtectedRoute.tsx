"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as authLib from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = authLib.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // O un loading spinner
  }

  return <>{children}</>;
}
