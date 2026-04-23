type Props = {
  isLocalLLM: boolean;
  currentView: string;
};

const viewLabels: Record<string, string> = {
  chat: "Chat with your Security Agent",
  camera: "Camera & Face Detection",
  alerts: "Recent Alerts",
  documents: "Security Documents",
};

export default function StatusBar({ isLocalLLM, currentView }: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">
        {viewLabels[currentView] ?? "HomeGuard AI"}
      </h2>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isLocalLLM ? "bg-green-400" : "bg-yellow-400"}`} />
        <span className="text-sm text-gray-400">
          {isLocalLLM ? "Local LLM Active" : "Groq API Active"}
        </span>
      </div>
    </header>
  );
}