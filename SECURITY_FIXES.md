# Sprint 0: Security Fixes - Cambios Realizados

## Resumen ejecutivo
Se han implementado **fixes críticos de seguridad** en el backend de HomeGuard AI. 
Todos los cambios están listos para usar en producción local.

**Duración estimada del sprint**: 2-4 horas  
**Estado**: ✅ Completado

---

## Cambios realizados

### 1. Configuración de Secrets (CRÍTICO)

**Archivo**: `backend/app/core/config.py`
- ✅ Movido `SECRET_KEY` de hardcodeado a variable de entorno
- ✅ Movido `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` a env
- ✅ Configuración de MongoDB URL desde env (`MONGO_URL`, `MONGO_DB_NAME`)
- ✅ CORS_ORIGINS ahora se lee desde env

**Archivo**: `backend/app/core/security.py`
- ✅ Eliminado `SECRET_KEY = "super-secret-key"` hardcodeado
- ✅ Ahora importa desde `settings` (config.py)
- ✅ `create_access_token()` usa `settings.SECRET_KEY`

**Archivo**: `backend/.env.example`
- ✅ Creado template de variables de entorno
- ✅ Incluye instrucciones de configuración

### 2. Autenticación JWT (CRÍTICO)

**Archivo**: `backend/app/core/dependencies.py` (NUEVO)
- ✅ Creada dependencia `get_current_user()`
- ✅ Valida JWT usando `jwt.decode(token, SECRET_KEY, ALGORITHM)`
- ✅ Devuelve usuario si válido, else `HTTPException(401)`
- ✅ Usa `OAuth2PasswordBearer` para obtener token del header `Authorization`

### 3. Protección de rutas (CRÍTICO)

**Archivo**: `backend/app/api/routes/auth.py`
- ✅ Reemplazado `return {"error": ...}` por `raise HTTPException(...)`
- ✅ Códigos HTTP correctos: `409` (user exists), `401` (invalid credentials)
- ✅ Response model: `AuthResponse` para type safety

**Archivo**: `backend/app/api/routes/chat.py`
- ✅ Añadido `Depends(get_current_user)` — endpoint ahora requiere auth
- ✅ Error handling con `HTTPException(500)` en lugar de `{"error": ...}`
- ✅ Prefix `/chat` y tag `"chat"` para organizar en Swagger

**Archivo**: `backend/app/api/routes/conversations.py`
- ✅ Todas las rutas (GET, POST, DELETE) ahora requieren `Depends(get_current_user)`
- ✅ Añadido campo `user_email` al crear conversación (para futura validación)
- ✅ Errores ahora son `HTTPException(404)`, `HTTPException(status.HTTP_*)` estándar

**Archivo**: `backend/app/api/routes/settings.py`
- ✅ GET `/settings` y PUT `/settings` requieren autenticación
- ✅ Prefix `/settings` y tag organizado

**Archivo**: `backend/app/api/routes/health.py`
- ✅ `/health` permanece PÚBLICA (sin autenticación)
- ✅ Útil para healthchecks de balanceadores de carga

### 4. Configuración Base de Datos (ALTO)

**Archivo**: `backend/app/core/database.py`
- ✅ Cambiado de hardcodeado `mongodb://localhost:27017` a `settings.MONGO_URL`
- ✅ Database name también configurable desde env

### 5. Integración CORS (ALTO)

**Archivo**: `backend/app/main.py`
- ✅ CORS origins ahora se leen de `settings.CORS_ORIGINS`
- ✅ Permite configuración dinámica sin hardcoding

### 6. Frontend - Autenticación (ALTO)

**Archivo**: `frontend/src/lib/api.ts`
- ✅ Nueva función `getAuthHeaders()` que incluye `Authorization: Bearer <token>`
- ✅ Todos los fetch() ahora envían header si hay token disponible
- ✅ Error handling mejorado: captura `data.detail` (FastAPI standard)

---

## Nuevos archivos creados

| Archivo | Descripción |
|---------|-------------|
| `backend/.env.example` | Template de variables de entorno |
| `backend/app/core/dependencies.py` | Dependencia `get_current_user()` con JWT |
| `backend/requirements.txt` | Dependencias Python (pip install -r) |
| `SETUP_GUIDE.md` | Guía completa de instalación y setup |
| `SECURITY_FIXES.md` | Este archivo - resumen de cambios |

---

## Checklist post-implementación

- [ ] **Generar SECRET_KEY seguro**: Ejecuta en PowerShell:
  ```powershell
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
  Copia el resultado a `.env` (en `backend/`)

- [ ] **Crear `.env` en backend**:
  ```powershell
  cd backend
  Copy-Item .env.example .env
  # Edita .env y reemplaza valores
  ```

- [ ] **Instalar dependencias**:
  ```powershell
  pip install -r requirements.txt
  ```

- [ ] **Levantar MongoDB**:
  ```powershell
  docker run -d -p 27017:27017 --name homeguard-mongo mongo:6
  # O usar mongod local
  ```

- [ ] **Crear índices en MongoDB**:
  ```powershell
  mongosh "mongodb://localhost:27017/homeguard" --eval "db.users.createIndex({email:1},{unique:true})"
  ```

- [ ] **Iniciar backend**:
  ```powershell
  uvicorn app.main:app --reload --port 8000
  ```

- [ ] **Verificar en Swagger**:
  - Abre http://localhost:8000/docs
  - Prueba `/auth/register` sin token (OK)
  - Prueba `/conversations/` sin token (debe fallar con 401)
  - Registrate, haz login, copia token, pégalo en "Authorize" (arriba a la derecha)
  - Intenta nuevamente `/conversations/` (debe funcionar)

---

## Cambios de comportamiento (importante)

### Antes
```
POST /chat/completions → NO REQUERÍA AUTH → Respuesta de error: {"error": "..."}
GET /conversations/ → NO REQUERÍA AUTH
POST /auth/login → Respuesta: {"access_token": "...", "token_type": "bearer"}
```

### Ahora
```
POST /chat/completions → REQUIERE Authorization header → HTTPException(401/500)
GET /conversations/ → REQUIERE Authorization header
POST /auth/login → Respuesta: mismo, pero ahora válido siempre (no más fallos sin token)
GET /health → SIGUE SIN REQUERIR AUTH (intencionalmente para healthchecks)
```

---

## Integración Frontend

**Automático**: El frontend ya envía el token si existe:
```typescript
// frontend/src/lib/api.ts - NUEVO
function getAuthHeaders() {
  const token = getToken(); // desde localStorage
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
}
```

No se requieren cambios adicionales en frontend (ya está integrado).

---

## Roadmap siguiente (Sprint 1-2)

1. **Crear índices MongoDB** (recomendado):
   ```powershell
   mongosh ... --eval "db.users.createIndex({email:1},{unique:true})"
   ```

2. **Lazy-load del modelo local** (`llm_local.py`):
   - Cambiar de import-time a startup/first-call
   - Soporte para CPU fallback
   - Documentar requisitos de GPU

3. **Rate limiting** en endpoints LLM (opcional pero recomendado)

4. **Auditoría y logs** en endpoints de autenticación

5. **Migrar token a cookie HttpOnly** (más seguro que localStorage)

---

## Testing rápido (PowerShell)

```powershell
$API = "http://localhost:8000"

# 1. Register
$register = @{
  email = "test@example.com"
  password = "TestPassword123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "$API/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $register

# 2. Login
$login = @{
  email = "test@example.com"
  password = "TestPassword123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $login

$token = ($response.Content | ConvertFrom-Json).access_token
Write-Host "Token: $token"

# 3. Get conversations (con auth)
Invoke-WebRequest -Uri "$API/conversations/" `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## Notas de seguridad

- ⚠️ **NUNCA commitees `.env`** — está en `.gitignore` (agregarlo si no existe)
- ✅ **SECRET_KEY debe ser único y seguro** — usa `secrets.token_urlsafe(32)`
- ✅ **Tokens expiran en 60 min** — configurable en `.env`
- ✅ **Todos los endpoints sensibles ahora requieren JWT**
- ⚠️ **En producción**: Usa HTTPS, configura CORS_ORIGINS restrictivo, rota SECRET_KEY periódicamente

---

## Preguntas frecuentes

**P: ¿Cómo regenero la SECRET_KEY?**  
R: Genera nueva con `python -c "import secrets; print(secrets.token_urlsafe(32))"`, actualiza `.env`, **reinicia el servidor**.  
Nota: Los tokens antiguos serán inválidos.

**P: ¿El usuario puede ver su contraseña almacenada?**  
R: No, se hashea con bcrypt. Revisalo en la DB: `db.users.find({})` mostrará `password: "$2b$12$..."`

**P: ¿Qué pasa si no envío Authorization header?**  
R: FastAPI devuelve `401 Unauthorized` automáticamente (gracias a `OAuth2PasswordBearer`).

---

**Última actualización**: Junio 2, 2026  
**Versión de cambios**: Sprint 0 (Security Fixes)
