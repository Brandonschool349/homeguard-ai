"use client";

import { useState } from "react";

type Permission = {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
};

const defaultPermissions: Permission[] = [
  {
    id: "camera_monitoring",
    label: "Camera Monitoring",
    description: "Allow the agent to access and analyze camera feeds",
    icon: "📷",
    enabled: true,
  },
  {
    id: "motion_detection",
    label: "Motion Detection",
    description: "Detect and report movement in monitored areas",
    icon: "🏃",
    enabled: true,
  },
  {
    id: "face_recognition",
    label: "Face Recognition",
    description: "Identify and track faces detected by cameras",
    icon: "👤",
    enabled: true,
  },
  {
    id: "alerts",
    label: "Alerts & Notifications",
    description: "Send alerts when security events are detected",
    icon: "🚨",
    enabled: true,
  },
  {
    id: "night_mode",
    label: "Night Mode",
    description: "Suppress alerts between 10:00 PM and 6:00 AM",
    icon: "🌙",
    enabled: false,
  },
];

type Props = {
  onChange?: (permissions: Record<string, boolean>) => void;
};

export default function AgentPermissions({ onChange }: Props) {
  const [permissions, setPermissions] = useState(defaultPermissions);

  const toggle = (id: string) => {
    const updated = permissions.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    setPermissions(updated);

    if (onChange) {
      const map = Object.fromEntries(updated.map((p) => [p.id, p.enabled]));
      onChange(map);
    }
  };

  return (
    <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Agent Permissions
      </h3>
      <p className="text-xs text-gray-500">
        Control what your security agent is allowed to do
      </p>

      <div className="space-y-3">
        {permissions.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{p.icon}</span>
              <div>
                <p className="text-sm text-white font-medium">{p.label}</p>
                <p className="text-xs text-gray-500">{p.description}</p>
              </div>
            </div>

            <button
              onClick={() => toggle(p.id)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                p.enabled ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  p.enabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}