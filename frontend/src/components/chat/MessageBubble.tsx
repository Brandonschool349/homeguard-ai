type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-br-sm"
            : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-bl-sm"
          }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
              <span className="text-xs">🛡️</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Security Agent</span>
          </div>
        )}
        <p>{message.content}</p>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-blue-300" : "text-gray-500"}`}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
}