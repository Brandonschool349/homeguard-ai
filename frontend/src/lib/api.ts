import { Message, LLMProvider } from "@/types";

export async function sendMessage(
  messages: Message[],
  provider: LLMProvider = "local",
  customPrompt?: string
): Promise<string> {
  const res = await fetch("http://localhost:8000/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      messages,
      max_tokens: 500,
      temperature: 0.7,
      custom_prompt: customPrompt ?? "",
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}