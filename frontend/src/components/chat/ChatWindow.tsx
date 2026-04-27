"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 min-h-0">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.length === 0 && (
          <div className="bg-gray-800 rounded-2xl p-4 text-sm text-gray-300 rounded-bl-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                <span className="text-xs">🛡️</span>
              </div>
              <span className="text-xs text-green-400 font-medium">Security Agent</span>
            </div>
            Hello! I am your HomeGuard AI security agent. I can monitor your cameras, detect faces, and answer questions about your security rules.
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}