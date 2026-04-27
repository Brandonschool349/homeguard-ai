"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation } from "@/types";
import {
  getConversations,
  createConversation,
  deleteConversation,
  deleteAllConversations,
} from "@/lib/api";

export function useConversations(provider: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async () => {
    const doc = await createConversation(provider);
    setConversations((prev) => [doc, ...prev]);
    setActiveId(doc.id);
    return doc;
  }, [provider]);

  const remove = useCallback(async (id: string) => {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const clearAll = useCallback(async () => {
    await deleteAllConversations();
    setConversations([]);
    setActiveId(null);
  }, []);

  return {
    conversations,
    activeId,
    setActiveId,
    loading,
    create,
    remove,
    clearAll,
    reload: load,
  };
}