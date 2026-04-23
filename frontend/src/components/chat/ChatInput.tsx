"use client";

import { useState, KeyboardEvent } from "react";

type Props = {
  onSend: (message: string) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 p-4 bg-gray-900">
      <div className="max-w-3xl mx-auto flex gap-3 items-center">
        
        {/* PDF Upload button */}
        <button className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-gray-400 fill-none stroke-2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </button>

        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your security agent..."
          disabled={isLoading}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex-shrink-0"
        >
          {isLoading ? "..." : "Send"}
        </button>

      </div>
    </div>
  );
}