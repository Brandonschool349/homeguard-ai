import { Message, LLMProvider } from "@/types";

const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "http://localhost:8000";
const GROQ_API  = process.env.NEXT_PUBLIC_GROQ_API_URL  ?? "http://localhost:8001";

// ===== CHAT =====
export async function sendMessage(
  messages: Message[],
  provider: LLMProvider = "local"
): Promise<string> {
  const url = provider === "local" ? LOCAL_API : GROQ_API;

  const res = await fetch(`${url}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();
  return data.choices[0].message.content;
}

// ===== HEALTH CHECK =====
export async function checkHealth(provider: LLMProvider = "local"): Promise<boolean> {
  try {
    const url = provider === "local" ? LOCAL_API : GROQ_API;
    const res = await fetch(`${url}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// ===== PDF =====
export async function uploadPDF(file: File, chatId: string): Promise<{ chunks: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chat_id", chatId);

  const res = await fetch(`${LOCAL_API}/upload-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload PDF");
  return res.json();
}