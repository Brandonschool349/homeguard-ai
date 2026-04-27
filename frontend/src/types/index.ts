// ===== CHAT =====
export type MessageRole = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  provider?: string;
};

export type Conversation = {
  id: string;
  title: string;
  provider: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
};

// ===== LLM =====
export type LLMProvider = "groq" | "local" | "custom";

export type LLMConfig = {
  provider: LLMProvider;
  model: string;
  temperature: number;
  maxTokens: number;
};

// ===== ALERTS =====
export type AlertType = "motion" | "face_detected" | "unknown_face" | "intrusion";

export type Alert = {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  imageUrl?: string;
  resolved: boolean;
};

// ===== AUTH =====
export type User = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};