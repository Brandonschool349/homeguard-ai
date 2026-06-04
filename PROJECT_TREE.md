# HomeGuard AI - Project Directory Tree

This document contains the directory structure for the HomeGuard AI project, which can be used as a reference for documentation.

```text
homeguard-ai/
├── .git/ (Ignored)
├── frontend/node_modules/ (Ignored)
├── frontend/.next/ (Ignored)
├── .dockerignore
├── AUDIT_REPORT.md
├── Dockerfile.backend
├── Dockerfile.frontend
├── IMPLEMENTATION_SUMMARY.md
├── PROJECT_TREE.md
├── SECURITY_FIXES.md
├── SETUP_GUIDE.md
├── SETUP_SPRINT1.md
├── SPRINT1_REPORT.md
├── backend/
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── chat.py
│   │   │       ├── conversations.py
│   │   │       ├── health.py
│   │   │       └── settings.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── db_init.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   └── services/
│   │       ├── llm_custom.py
│   │       ├── llm_groq.py
│   │       ├── llm_local.py
│   │       └── llm_router.py
│   └── requirements.txt
├── docker-compose.yml
├── frontend/
│   ├── .env.example
│   ├── .env.local
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── messages/
│   │   ├── en.json
│   │   └── es.json
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/
│   │   │       ├── (Dashboard)/
│   │   │       │   ├── alerts/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── camera/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── chat/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── documents/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── layout.tsx
│   │   │       │   └── settings/
│   │   │       │       └── page.tsx
│   │   │       ├── globals.css
│   │   │       ├── layout.tsx
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── page.tsx
│   │   │       └── register/
│   │   │           └── page.tsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── alerts/
│   │   │   ├── camera/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── ChatView.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── PageContainer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── StatusBar.tsx
│   │   │   ├── settings/
│   │   │   │   ├── AgentPermissions.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   ├── SettingsView.tsx
│   │   │   │   └── StorageSettings.tsx
│   │   │   └── ui/
│   │   │       ├── ErrorBanner.tsx
│   │   │       └── ProviderSelector.tsx
│   │   ├── context/
│   │   │   ├── AppContext.tsx
│   │   │   └── ConversationContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useChat.ts
│   │   │   └── useSettingsStore.ts
│   │   ├── i18n/
│   │   │   └── request.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── middleware.ts
│   │   └── types/
│   │       └── index.ts
│   └── tsconfig.json
└── generate_tree.py
```
