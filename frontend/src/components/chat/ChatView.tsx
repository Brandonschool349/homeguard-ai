"use client";

import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function ChatView() {
  const { primaryProvider } = useSettingsStore();
  const { messages, isLoading, error, send } = useChat(primaryProvider);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {error && <ErrorBanner message={error} />}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={send} isLoading={isLoading} />
    </div>
  );
}