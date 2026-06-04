"use client";

import { useConversation } from "@/context/ConversationContext";
import { useSettingsStore } from "@/hooks/useSettingsStore";

import ProviderSelector from "@/components/ui/ProviderSelector";
import ChatView from "@/components/chat/ChatView";

export default function ChatPage() {
  const { primaryProvider } = useSettingsStore();
  const { activeId } = useConversation();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      <ProviderSelector />

      <ChatView
        key={activeId ?? "empty"}
        conversationId={activeId}
      />

    </div>
  );
}