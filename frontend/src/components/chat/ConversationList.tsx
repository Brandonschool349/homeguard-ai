"use client";

import { Conversation } from "@/types";

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
};

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-800">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
        >
          <span>+</span>
          <span>New conversation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-600 text-center mt-4">No conversations yet</p>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
              activeId === conv.id
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{conv.title}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {conv.provider === "groq" ? "⚡ Groq" : "🖥️ Local"}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}