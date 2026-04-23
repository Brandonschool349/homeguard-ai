"use client";

import { useState, useCallback } from "react";
import { Message, LLMProvider } from "@/types";
import { sendMessage } from "@/lib/api";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useChat(provider: LLMProvider = "local") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const updatedMessages = [...messages, userMessage];
      const response = await sendMessage(updatedMessages, provider);

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, provider]);

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clear };
}