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
    // Detectar saludos simples
    const greetings = ["hola", "hi", "hello", "hey", "buenos días", "buenas", "good morning"];
    const isGreeting = greetings.some(g => content.toLowerCase().trim() === g);

    if (isGreeting) {
    const greetingResponse: Message = {
        id: generateId(),
        role: "assistant",
        content: "Hello! I'm HomeGuard AI, your security assistant. How can I help you today?",
        timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, greetingResponse]);
    setIsLoading(false);
    return;
    }

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