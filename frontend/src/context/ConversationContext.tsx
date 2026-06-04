"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { Conversation } from "@/types";
import {
  getConversations,
  createConversation,
  deleteConversation,
  deleteAllConversations,
} from "@/lib/api";

type ConversationContextType = {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  loading: boolean;

  create: (provider: string) => Promise<Conversation>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  reload: () => Promise<void>;

  renameConversation: (id: string, title: string) => void;
  pinConversation: (id: string) => void;
};

const ConversationContext =
  createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (provider: string) => {
    const doc = await createConversation(provider);

    setConversations((prev) => [doc, ...prev]);
    setActiveId(doc.id);

    return doc;
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await deleteConversation(id);

      setConversations((prev) => prev.filter((c) => c.id !== id));

      setActiveId((prev) => (prev === id ? null : prev));
    },
    []
  );

  const clearAll = useCallback(async () => {
    await deleteAllConversations();
    setConversations([]);
    setActiveId(null);
  }, []);

  // ✅ FIX: ahora sí dentro del provider y con state correcto
  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const pinConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      )
    );
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeId,
        setActiveId,
        loading,
        create,
        remove,
        clearAll,
        reload: load,
        renameConversation,
        pinConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);

  if (!ctx) {
    throw new Error(
      "useConversation must be used within ConversationProvider"
    );
  }

  return ctx;
}