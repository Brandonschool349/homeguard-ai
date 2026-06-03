"use client";

import { useState } from "react";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useConversations } from "@/hooks/useConversations";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/ui/StatusBar";
import ProviderSelector from "@/components/ui/ProviderSelector";
import ChatView from "@/components/chat/ChatView";
import SettingsView from "@/components/settings/SettingsView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Home() {
  const [currentView, setCurrentView] = useState("chat");
  const { primaryProvider, setPrimaryProvider } = useSettingsStore();
  const { conversations, activeId, setActiveId, create, remove } = useConversations(primaryProvider);
  const { isLoading } = useApp();

  const handleNewConversation = async () => {
    await create();
    setCurrentView("chat");
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="h-screen bg-gray-950 text-white flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onConversationSelect={setActiveId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={remove}
          activeConversationId={activeId}
          conversations={conversations}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <StatusBar isLocalLLM={primaryProvider === "local"} currentView={currentView} />

          {currentView === "chat" && (
            <ProviderSelector />
          )}

          {currentView === "chat" && (
            <ChatView key={activeId ?? "empty"} conversationId={activeId} />
          )}

          {currentView === "settings" && <SettingsView />}

          {currentView !== "chat" && currentView !== "settings" && (
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
    </ProtectedRoute>
  );
}