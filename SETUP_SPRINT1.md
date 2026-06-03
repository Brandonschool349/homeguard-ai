# HomeGuard AI - Sprint 1 Setup Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker
- Docker Compose
- (Optional) Git for cloning

### Step 1: Clone Repository
```bash
git clone https://github.com/Brandonschool349/homeguard-ai.git
cd homeguard-ai
```

### Step 2: Configure Environment Variables

#### Backend
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values (optional for development)
```

#### Frontend
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env if needed
```

### Step 3: Start Services
```bash
docker-compose up -d
```

Wait for all services to start. Check status:
```bash
docker-compose ps
```

### Step 4: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 5: Create an Account

1. Go to http://localhost:3000/register
2. Enter email and password (min 8 characters)
3. Click "Sign Up"
4. You'll be redirected to login

### Step 6: Login
1. Enter your email and password
2. Click "Sign In"
3. You should now have access to the chat

### Step 7: Test the Flow

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials
3. **Chat**: Send a message to the AI
4. **Refresh**: Refresh the page - you should stay logged in
5. **Logout**: Click the logout button in the sidebar
6. **Verify**: You should be redirected to `/login`

## Useful Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop Services
```bash
docker-compose down
```

### Clean Everything (including data)
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose up -d --build
```

## Troubleshooting

### Port Already in Use
If ports 3000, 8000, or 27017 are already in use, edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3001:3000"  # Change 3001 to available port

backend:
  ports:
    - "8001:8000"  # Change 8001 to available port

mongodb:
  ports:
    - "27018:27017"  # Change 27018 to available port
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend Can't Connect to Backend
- Check backend logs: `docker-compose logs backend`
- Ensure `NEXT_PUBLIC_LOCAL_API_URL` is set correctly
- Verify backend is accessible: `curl http://localhost:8000/health`

### Containers Won't Start
```bash
# Check for errors
docker-compose logs

# Rebuild everything
docker-compose down
docker-compose up -d --build
```

## Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure .env
cp .env.example .env

# Start MongoDB separately (or use Docker)
# mongod --dbpath ./data

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure .env
cp .env.example .env

# Start development server
npm run dev
```

Then access at http://localhost:3000

## Architecture

```
homeguard-ai/
├── docker-compose.yml          # Orchestration
├── Dockerfile.backend          # Backend container
├── Dockerfile.frontend         # Frontend container
│
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py     # Authentication endpoints
│   │   │       ├── chat.py     # Chat endpoint
│   │   │       ├── conversations.py
│   │   │       ├── settings.py
│   │   │       └── health.py
│   │   ├── core/
│   │   │   ├── config.py       # Configuration
│   │   │   ├── database.py     # MongoDB setup
│   │   │   ├── db_init.py      # Index creation
│   │   │   ├── security.py     # JWT & hashing
│   │   │   └── dependencies.py # Auth dependency
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic models
│   │   └── services/
│   │       └── llm_*.py        # LLM providers
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── [locale]/
    │   │       ├── page.tsx     # Chat page (protected)
    │   │       ├── login/
    │   │       ├── register/
    │   │       └── layout.tsx   # Session restore
    │   ├── components/
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── Sidebar.tsx      # Logout button
    │   │   └── chat/
    │   ├── hooks/
    │   │   ├── useAuth.ts       # Auth hook
    │   │   └── useConversations.ts
    │   ├── lib/
    │   │   ├── auth.ts          # Auth functions
    │   │   └── api.ts           # API wrapper
    │   └── context/
    │       └── AppContext.tsx   # Session restore logic
    ├── package.json
    └── .env.example
```

## Technologies

### Backend
- **FastAPI**: Modern async web framework
- **Motor**: Async MongoDB driver
- **PyJWT**: JWT token handling
- **Pydantic**: Data validation
- **Passlib**: Password hashing with bcrypt

### Frontend
- **Next.js 16**: React meta-framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **next-intl**: Internationalization

### Database
- **MongoDB**: Document database
- **Indexes**: Unique constraint on user.email

## Testing the Auth Flow

### Via cURL

**Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Protected Endpoint (with token):**
```bash
TOKEN="your-token-here"
curl -X GET http://localhost:8000/conversations/ \
  -H "Authorization: Bearer $TOKEN"
```

## Next Steps

1. ✅ Complete authentication (Sprint 1)
2. ⏳ Implement camera monitoring (Sprint 2)
3. ⏳ Add alerts system (Sprint 3)
4. ⏳ Production deployment (Sprint 4)

For more info, see AUDIT_REPORT.md and SECURITY_FIXES.md

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready (Development)
