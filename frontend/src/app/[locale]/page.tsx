"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/ui/StatusBar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export default function Home() {
  const [currentView, setCurrentView] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    const userMessage: Message = { role: "user", content, timestamp };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Por ahora respuesta simulada - luego conectamos a FastAPI
    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content: "I am processing your request. FastAPI connection coming soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StatusBar isLocalLLM={true} currentView={currentView} />
        
        {currentView === "chat" && (
          <>
            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
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