"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/ui/StatusBar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const [currentView, setCurrentView] = useState("chat");
  const { messages, isLoading, error, send, clear } = useChat("local");

  return (
    <main className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StatusBar isLocalLLM={true} currentView={currentView} />

        {currentView === "chat" && (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 mx-6 mt-4 rounded-lg">
                ⚠️ {error}
              </div>
            )}
            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSend={send} isLoading={isLoading} />
          </>
        )}

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