"use client";

import { useState } from "react";
import { Conversation } from "@/types";
import ConversationList from "./chat/ConversationList";

type Props = {
  currentView: string;
  onViewChange: (view: string) => void;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string | null;
  conversations: Conversation[];
};

const navItems = [
  { id: "chat",      icon: "💬", label: "Chat"      },
  { id: "camera",    icon: "📷", label: "Camera"    },
  { id: "alerts",    icon: "🚨", label: "Alerts"    },
  { id: "documents", icon: "📄", label: "Documents" },
  { id: "settings",  icon: "⚙️", label: "Settings"  },
];

export default function Sidebar({
  currentView,
  onViewChange,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  activeConversationId,
  conversations,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold text-green-400">🛡️ HomeGuard AI</h1>
            <p className="text-xs text-gray-500 mt-0.5">Security System</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-gray-400 fill-none stroke-2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1 border-b border-gray-800">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
              ${currentView === item.id
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Conversation list */}
      {!collapsed && currentView === "chat" && (
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onConversationSelect}
            onDelete={onDeleteConversation}
            onNew={onNewConversation}
          />
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Admin</p>
              <p className="text-xs text-gray-500">Local Mode</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}