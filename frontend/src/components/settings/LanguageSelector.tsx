"use client";

import { useState } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇲🇽" },
];

export default function LanguageSelector() {
  const [selected, setSelected] = useState("en");

  return (
    <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Language
      </h3>
      <p className="text-xs text-gray-500">
        Select the language for the interface
      </p>

      <div className="flex gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              selected === lang.code
                ? "border-green-500/50 bg-green-500/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <span>{lang.flag}</span>
            <span className="text-sm font-medium">{lang.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}