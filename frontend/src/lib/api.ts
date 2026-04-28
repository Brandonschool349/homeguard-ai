import { Message, LLMProvider, ChatResponse } from "@/types";

const BACKEND = process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "http://localhost:8000";

// ===== CHAT =====
export async function sendMessage(
  messages: Message[],
  provider: LLMProvider = "local",
  conversationId?: string,
  customPrompt?: string
): Promise<ChatResponse> {
  const res = await fetch(`${BACKEND}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      messages,
      max_tokens: 500,
      temperature: 0.7,
      conversation_id: conversationId,
      custom_prompt: customPrompt ?? "",
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ===== CONVERSATIONS =====
export async function getConversations() {
  const res = await fetch(`${BACKEND}/conversations/`);
  return res.json();
}

export async function createConversation(provider: string) {
  const res = await fetch(`${BACKEND}/conversations/?provider=${provider}`, {
    method: "POST",
  });
  return res.json();
}

export async function getConversation(id: string) {
  const res = await fetch(`${BACKEND}/conversations/${id}`);
  return res.json();
}

export async function deleteConversation(id: string) {
  await fetch(`${BACKEND}/conversations/${id}`, { method: "DELETE" });
}

export async function deleteAllConversations() {
  await fetch(`${BACKEND}/conversations/`, { method: "DELETE" });
}

// ===== HEALTH =====
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// ===== SETTINGS =====
export async function getSettings() {
  const res = await fetch(`${BACKEND}/settings`);
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

export async function saveSettings(settings: {
  primary_provider: string;
  fallback_enabled: boolean;
  system_prompt: string;
  groq_api_key: string;
  custom_api_url: string;
  custom_api_key: string;
  custom_model: string;
  permissions: Record<string, boolean>;
}) {
  const res = await fetch(`${BACKEND}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}