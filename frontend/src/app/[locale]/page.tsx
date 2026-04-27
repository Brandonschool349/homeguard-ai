"use client";

import { useState } from "react";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useConversations } from "@/hooks/useConversations";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/ui/StatusBar";
import ProviderSelector from "@/components/ui/ProviderSelector";
import ChatView from "@/components/chat/ChatView";
import SettingsView from "@/components/settings/SettingsView";

export default function Home() {
  const [currentView, setCurrentView] = useState("chat");
  const { primaryProvider, setPrimaryProvider } = useSettingsStore();
  const { conversations, activeId, setActiveId, create, remove } = useConversations(primaryProvider);

  const handleNewConversation = async () => {
    await create();
    setCurrentView("chat");
  };

  return (
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
          <ProviderSelector provider={primaryProvider} onProviderChange={setPrimaryProvider} />
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
  );
}