"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, LLMProvider } from "@/types";
import { sendMessage, getConversation } from "@/lib/api";
import { useSettingsStore } from "@/hooks/useSettingsStore";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useChat(provider: LLMProvider = "local", conversationId?: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { systemPrompt } = useSettingsStore();

  // Cargar mensajes cuando cambia la conversación
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const conv = await getConversation(conversationId);
        if (conv && conv.messages) {
          setMessages(conv.messages);
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
    };

    loadMessages();
  }, [conversationId]);

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
      const response = await sendMessage(
        updatedMessages,
        provider,
        conversationId ?? undefined,
        systemPrompt
      );

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response.choices[0].message.content,
        timestamp: getTimestamp(),
        provider: response.provider_used, // 👈 AQUÍ
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, provider, conversationId, systemPrompt]);

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clear };
}