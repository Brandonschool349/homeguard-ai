"use client";

import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

const viewLabels: Record<string, string> = {
  chat: "Chat with your Security Agent",
  camera: "Camera & Face Detection",
  alerts: "Recent Alerts",
  documents: "Security Documents",
};

export default function StatusBar() {
  const { provider } = useApp();
  const pathname = usePathname() ?? "";

  const isLocalLLM = provider === "local";

  let currentView = "chat";
  if (pathname.includes("camera")) {
    currentView = "camera";
  } else if (pathname.includes("alerts")) {
    currentView = "alerts";
  } else if (pathname.includes("documents")) {
    currentView = "documents";
  } else if (pathname.includes("settings")) {
    currentView = "settings";
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">
        {viewLabels[currentView] ?? "HomeGuard AI"}
      </h2>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isLocalLLM ? "bg-green-400" : "bg-yellow-400"}`} />
        <span className="text-sm text-gray-400">
          {isLocalLLM ? "Local LLM Active" : "Groq API Active"}
        </span>
      </div>
    </header>
  );
}