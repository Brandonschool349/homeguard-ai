const BACKEND = process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "http://localhost:8000";

export async function register(email: string, password: string) {
  const res = await fetch(`${BACKEND}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Register failed");
  }

  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  localStorage.setItem("token", data.access_token);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export async function getCurrentUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${BACKEND}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      logout();
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}