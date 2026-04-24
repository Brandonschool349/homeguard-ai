"use client";

import { LLMProvider } from "@/types";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ErrorBanner from "@/components/ui/ErrorBanner";

type Props = {
  provider: LLMProvider;
};

export default function ChatView({ provider }: Props) {
  const { messages, isLoading, error, send } = useChat(provider);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {error && <ErrorBanner message={error} />}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={send} isLoading={isLoading} />
    </div>
  );
}