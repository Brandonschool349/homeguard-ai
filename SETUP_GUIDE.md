# HomeGuard AI - Setup & Installation Guide

Guía completa para configurar y ejecutar el proyecto HomeGuard AI (backend + frontend).

## Prerequisitos

- **Python** 3.10+
- **Node.js** 18+
- **MongoDB** 5.0+ (local o Docker)
- **Git**

## Estructura del proyecto

```
homeguard-ai/
├── backend/        # FastAPI backend
│   ├── app/
│   │   ├── api/routes/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt (a crear)
└── frontend/       # Next.js frontend
    ├── src/
    ├── package.json
    └── .env.local (crear)
```

## Backend Setup

### 1. Crear entorno virtual

```powershell
cd C:\Proyectos\homeguard-ai\backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 2. Instalar dependencias

```powershell
pip install --upgrade pip
pip install fastapi "uvicorn[standard]" motor pydantic python-dotenv "passlib[bcrypt]" "python-jose[cryptography]" httpx transformers
```

**Nota para LLM local (opcional):**
- Instala `torch` según tu plataforma: https://pytorch.org/get-started/locally/
- Requiere CUDA compatible o CPU (más lento)

Ejemplo para CPU:
```powershell
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### 3. Crear archivo `.env`

Copia `.env.example` a `.env` y configura:

```powershell
Copy-Item .env.example .env
```

Luego edita `.env` con tus valores:
```env
SECRET_KEY=your_very_secure_random_key_minimum_32_chars
GROQ_API_KEY=sk-... (obtenido de https://console.groq.com)
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=homeguard
```

**Generar SECRET_KEY seguro:**
```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Levantar MongoDB

**Opción A: Docker**
```powershell
docker run -d -p 27017:27017 --name homeguard-mongo mongo:6
```

**Opción B: MongoDB local instalado**
```powershell
mongod --dbpath C:\data\db
```

### 5. Crear índices en MongoDB (recomendado)

```powershell
mongosh "mongodb://localhost:27017/homeguard" --eval "
db.users.createIndex({email:1},{unique:true});
db.conversations.createIndex({updated_at:-1});
db.messages.createIndex({conversation_id:1});
"
```

### 6. Iniciar servidor FastAPI

```powershell
uvicorn app.main:app --reload --port 8000
```

Acceso: http://localhost:8000/docs (Swagger UI)

---

## Frontend Setup

### 1. Instalar dependencias

```powershell
cd C:\Proyectos\homeguard-ai\frontend
npm install
```

### 2. Crear `.env.local`

```powershell
@"
NEXT_PUBLIC_LOCAL_API_URL=http://localhost:8000
"@ | Out-File -Encoding utf8 .env.local
```

### 3. Iniciar servidor de desarrollo

```powershell
npm run dev
```

Acceso: http://localhost:3000

---

## Flujo de uso

### 1. Registrarse

```bash
POST http://localhost:8000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### 2. Login

```bash
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

# Respuesta:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

Copia el `access_token` y úsalo en requests posteriores:
```bash
Authorization: Bearer eyJhbGc...
```

### 3. Enviar mensaje a LLM

```bash
POST http://localhost:8000/chat/completions
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "provider": "groq",
  "messages": [
    {"role": "user", "content": "¿Cómo estás?"}
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

---

## Troubleshooting

### Error: "Could not validate credentials"
- Asegúrate de pasar el `Authorization: Bearer <token>` header
- Verifica que el token no haya expirado (expires in 60 min por defecto)

### Error: "mongodb://localhost:27017 connection refused"
- Verifica que MongoDB esté corriendo: `mongosh --eval "db.adminCommand('ping')"`
- Si usas Docker: `docker ps | findstr mongo`

### Error: "GROQ_API_KEY not found"
- Crea `.env` en `/backend` con tu key desde https://console.groq.com

### LLM local es muy lento / out of memory
- Desactiva LLM local en settings y usa `groq` como provider principal
- O reducir `max_tokens` en requests

### Frontend no se conecta al backend
- Verifica CORS_ORIGINS en `.env`: debe incluir `http://localhost:3000`
- Revisa la consola del navegador para errores de CORS

---

## Variables de entorno (resumen)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SECRET_KEY` | Clave JWT (CRÍTICA) | generada con `secrets.token_urlsafe(32)` |
| `GROQ_API_KEY` | API key de Groq (opcional) | `gsk_...` |
| `MONGO_URL` | Conexión MongoDB | `mongodb://localhost:27017` |
| `LOCAL_MODEL_ID` | Modelo Hugging Face | `meta-llama/Llama-3.2-3B-Instruct` |
| `CORS_ORIGINS` | Orígenes permitidos | `http://localhost:3000` |

---

## Próximos pasos

1. **Seguridad**: Genera SECRET_KEY seguro y nunca lo commits a git
2. **Base de datos**: Crea índices para mejor rendimiento (ver sección 5 del Backend Setup)
3. **Autenticación**: El frontend ahora envía `Authorization: Bearer <token>` automáticamente
4. **Cámaras/Visión**: (futuro) Implementar pipeline de ingest y procesamiento

---

## Documentación adicional

- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- Motor (async MongoDB): https://motor.readthedocs.io/
- Groq API: https://console.groq.com/docs

---

## Contacto / Issues

Crea un issue en el repositorio con:
- Pasos para reproducir
- Error log completo
- Entorno (Windows/Linux, Python version, etc.)
