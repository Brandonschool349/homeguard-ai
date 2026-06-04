"use client";

import Sidebar from "@/components/layout/Sidebar";
import StatusBar from "@/components/layout/StatusBar";
import { useApp } from "@/context/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useApp();

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-[#070b14] text-white">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <StatusBar />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}