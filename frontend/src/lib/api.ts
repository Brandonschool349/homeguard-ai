import { Message, LLMProvider, ChatResponse } from "@/types";
import { getToken, logout } from "./auth";
import { Conversation, Settings } from "@/types";

const BACKEND = process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "http://localhost:8000";

let unauthorizedCallback: (() => void) | null = null;

export function setUnauthorizedCallback(callback: (() => void) | null) {
  unauthorizedCallback = callback;
}

function getAuthHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to handle responses and validate session expirations
async function handleResponse<T>(
  res: Response,
  context: string,
  sentToken: string | null
): Promise<T> {
  if (res.status === 401) {
    const currentToken = getToken();

    // Solo invalidar si el token que falló es el token activo actual en localStorage
    if (sentToken && sentToken === currentToken) {
      if (unauthorizedCallback) {
        unauthorizedCallback();
      } else {
        logout();
      }
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
  const token = getToken();
  const res = await fetch(`${BACKEND}/chat/completions`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      provider,
      messages,
      max_tokens: 500,
      temperature: 0.7,
      conversation_id: conversationId,
      custom_prompt: customPrompt ?? "",
    }),
  });

  return handleResponse(res, "Chat request", token);
}

// ===== CONVERSATIONS =====
export async function getConversations(): Promise<Conversation[]> {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<Conversation[]>(res, "Failed to fetch conversations", token);
}

export async function createConversation(provider: string): Promise<Conversation> {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/?provider=${provider}`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  return handleResponse<Conversation>(res, "Failed to create conversation", token);
}

export async function getConversation(id: string) {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/${id}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res, "Failed to fetch conversation", token);
}

export async function deleteConversation(id: string) {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(res, "Failed to delete conversation", token);
}

export async function deleteAllConversations() {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(res, "Failed to delete conversations", token);
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
  const token = getToken();
  const res = await fetch(`${BACKEND}/settings`, {
    headers: getAuthHeaders(token),
  });

  return handleResponse<Settings>(res, "Failed to load settings", token);
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
  const token = getToken();
  const res = await fetch(`${BACKEND}/settings`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(settings),
  });
  return handleResponse(res, "Failed to save settings", token);
}

export async function clearAllConversations() {
  const token = getToken();
  const res = await fetch(`${BACKEND}/conversations/`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return handleResponse(res, "Failed to clear conversations", token);
}