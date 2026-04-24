"use client";

import { useState } from "react";
import { LLMProvider } from "@/types";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/ui/StatusBar";
import ProviderSelector from "@/components/ui/ProviderSelector";
import ChatView from "@/components/chat/ChatView";

export default function Home() {
  const [currentView, setCurrentView] = useState("chat");
  const [provider, setProvider] = useState<LLMProvider>("groq");

  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StatusBar isLocalLLM={provider === "local"} currentView={currentView} />
        <ProviderSelector provider={provider} onProviderChange={handleProviderChange} />

        {currentView === "chat" && <ChatView provider={provider} />}

        {currentView !== "chat" && (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <p className="text-4xl mb-3">🚧</p>
              <p className="text-lg font-medium">Coming soon</p>
              <p className="text-sm mt-1">This section is under development</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}