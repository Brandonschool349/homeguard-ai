"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useConversation } from "@/context/ConversationContext";
import * as authLib from "@/lib/auth";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser, provider } = useApp();

  const {
    conversations,
    activeId,
    setActiveId,
    create,
    remove,
    renameConversation,
    pinConversation,
  } = useConversation();

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [cmdSearch, setCmdSearch] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", String(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    authLib.logout();
    setUser(null);
    router.push("/login");
  };

  const filtered = useMemo(() => {
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const pinned = filtered.filter(c => c.pinned);
  const normal = filtered.filter(c => !c.pinned);

  const handleNewChat = async () => {
    const chat = await create(provider);
    setActiveId(chat.id);
    router.push("/chat");
  };

  return (
    <aside className={`h-screen flex flex-col bg-[#0a0f1c] border-r border-white/5 transition-all ${collapsed ? "w-20" : "w-72"}`}>

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">⬢</span>
            HomeGuard
          </div>
        )}

        <button
          onClick={() => setCollapsed(v => !v)}
          className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 text-white"
        >
          ☰
        </button>
      </div>

      {/* NAV */}
      <div className="p-2 space-y-1">
        <NavItem icon="💬" label="Chat" active={pathname.includes("chat")} onClick={handleNewChat} collapsed={collapsed} />
        <NavItem icon="📷" label="Camera" active={pathname.includes("camera")} onClick={() => router.push("/camera")} collapsed={collapsed} />
        <NavItem icon="🚨" label="Alerts" active={pathname.includes("alerts")} onClick={() => router.push("/alerts")} collapsed={collapsed} />
        <NavItem icon="⚙" label="Settings" active={pathname.includes("settings")} onClick={() => router.push("/settings")} collapsed={collapsed} />
      </div>

      {/* CHAT AREA */}
      {pathname.includes("chat") && !collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* SEARCH BAR + CMD */}
          <div className="p-2 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="flex-1 bg-white/5 text-white text-sm px-3 py-2 rounded-lg outline-none"
            />

            <button
              onClick={() => setCmdSearch(true)}
              className="w-10 bg-white/5 hover:bg-white/10 rounded-lg text-white"
            >
              ⌕
            </button>
          </div>

          {/* NEW CHAT */}
          <div className="px-2 pb-2">
            <button
              onClick={handleNewChat}
              className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg"
            >
              + New Chat
            </button>
          </div>

          {/* PINNED */}
          {pinned.map(c => (
            <ChatItem key={c.id} chat={c} activeId={activeId} setActiveId={setActiveId} remove={remove} rename={renameConversation} pin={pinConversation} />
          ))}

          {/* NORMAL */}
          {normal.map(c => (
            <ChatItem key={c.id} chat={c} activeId={activeId} setActiveId={setActiveId} remove={remove} rename={renameConversation} pin={pinConversation} />
          ))}
        </div>
      )}

      {/* USER */}
      <div className="mt-auto p-3 border-t border-white/5 flex items-center gap-3">

        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          👤
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm truncate">{user?.email}</div>
            <div className="text-[10px] text-white/40">{provider}</div>
          </div>
        )}

        <button onClick={handleLogout} className="text-red-400 text-sm">⎋</button>
      </div>

      {/* CMD SEARCH OVERLAY */}
      {cmdSearch && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-20">
          <div className="w-[500px] bg-[#0a0f1c] border border-white/10 rounded-xl p-3">
            <input
              autoFocus
              placeholder="Search deeply in chats..."
              className="w-full bg-white/5 p-2 text-white rounded"
            />
            <button onClick={() => setCmdSearch(false)} className="mt-2 text-white/50">
              close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ---------- COMPONENTS ---------- */

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
};

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
      ${active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && label}
    </button>
  );
}
type ChatItemProps = {
  chat: any;
  activeId: string | null;
  setActiveId: (id: string) => void;
  remove: (id: string) => void;
  rename: (id: string, title: string) => void;
  pin: (id: string) => void;
};


function ChatItem({ chat, activeId, setActiveId, remove, rename, pin }: ChatItemProps) {
  return (
    <div
      onClick={() => setActiveId(chat.id)}
      className={`group flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer
      ${activeId === chat.id ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      <div className="flex-1">
        <div className="text-white text-sm truncate">{chat.title}</div>
        <div className="text-[10px] text-white/40">{chat.provider}</div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); pin(chat.id); }}>📌</button>
        <button onClick={(e) => {
          e.stopPropagation();
          const t = prompt("Rename");
          if (t) rename(chat.id, t);
        }}>✏️</button>
        <button onClick={(e) => { e.stopPropagation(); remove(chat.id); }}>✕</button>
      </div>
    </div>
  );
}