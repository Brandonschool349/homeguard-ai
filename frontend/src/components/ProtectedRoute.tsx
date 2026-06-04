"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}