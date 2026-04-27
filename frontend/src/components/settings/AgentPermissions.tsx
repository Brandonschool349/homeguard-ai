"use client";

import { useSettingsStore } from "@/hooks/useSettingsStore";

type PermissionMeta = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

const permissionMeta: PermissionMeta[] = [
  {
    id: "camera_monitoring",
    label: "Camera Monitoring",
    description: "Allow the agent to access and analyze camera feeds",
    icon: "📷",
  },
  {
    id: "motion_detection",
    label: "Motion Detection",
    description: "Detect and report movement in monitored areas",
    icon: "🏃",
  },
  {
    id: "face_recognition",
    label: "Face Recognition",
    description: "Identify and track faces detected by cameras",
    icon: "👤",
  },
  {
    id: "alerts",
    label: "Alerts & Notifications",
    description: "Send alerts when security events are detected",
    icon: "🚨",
  },
  {
    id: "night_mode",
    label: "Night Mode",
    description: "Suppress alerts between 10:00 PM and 6:00 AM",
    icon: "🌙",
  },
];

export default function AgentPermissions() {
  const { permissions, setPermission } = useSettingsStore();

  return (
    <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Agent Permissions
      </h3>

      <p className="text-xs text-gray-500">
        Control what your security agent is allowed to do
      </p>

      <div className="space-y-3">
        {permissionMeta.map((meta) => {
          const enabled = permissions[meta.id] ?? false;

          return (
            <div
              key={meta.id}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{meta.icon}</span>
                <div>
                  <p className="text-sm text-white font-medium">{meta.label}</p>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
              </div>

              <button
                onClick={() => setPermission(meta.id, !enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  enabled ? "bg-green-500" : "bg-gray-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}