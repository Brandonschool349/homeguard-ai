"use client";

import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ErrorBanner from "@/components/ui/ErrorBanner";

type Props = {
  conversationId: string | null;
};

export default function ChatView({ conversationId }: Props) {
  const { primaryProvider } = useSettingsStore();
  const { messages, isLoading, error, send } = useChat(primaryProvider, conversationId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {error && <ErrorBanner message={error} />}
      {!conversationId ? (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-lg font-medium">Select or create a conversation</p>
            <p className="text-sm mt-1">Use the sidebar to get started</p>
          </div>
        </div>
      ) : (
        <>
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput onSend={send} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}