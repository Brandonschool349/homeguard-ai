import { Message, LLMProvider, ChatResponse } from "@/types";
import { getToken, logout } from "./auth";
import { Conversation, Settings } from "@/types";

const BACKEND = process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "http://localhost:8000";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to handle 401 errors
async function handleResponse<T>(res: Response, context: string): Promise<T> {
  if (res.status === 401) {
    // Token expired or invalid
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.error || `${context} failed`);
  }
  return data;
}

// ===== CHAT =====
export async function sendMessage(
  messages: Message[],
  provider: LLMProvider = "local",
  conversationId?: string,
  customPrompt?: string
): Promise<ChatResponse> {
  const res = await fetch(`${BACKEND}/chat/completions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      provider,
      messages,
      max_tokens: 500,
      temperature: 0.7,
      conversation_id: conversationId,
      custom_prompt: customPrompt ?? "",
    }),
  });

  return handleResponse(res, "Chat request");
}

// ===== CONVERSATIONS =====
export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BACKEND}/conversations/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Conversation[]>(res, "Failed to fetch conversations");
}

export async function createConversation(provider: string): Promise<Conversation> {
  const res = await fetch(`${BACKEND}/conversations/?provider=${provider}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse<Conversation>(res, "Failed to create conversation");
}

export async function getConversation(id: string) {
  const res = await fetch(`${BACKEND}/conversations/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to fetch conversation");
}

export async function deleteConversation(id: string) {
  const res = await fetch(`${BACKEND}/conversations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to delete conversation");
}

export async function deleteAllConversations() {
  const res = await fetch(`${BACKEND}/conversations/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res, "Failed to delete conversations");
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
export async function getSettings(): Promise<Settings> {
  const res = await fetch(`${BACKEND}/settings`, {
    headers: getAuthHeaders(),
  });

  return handleResponse<Settings>(res, "Failed to load settings");
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
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  return handleResponse(res, "Failed to save settings");
}
