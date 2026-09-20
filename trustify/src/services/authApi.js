/**
 * authApi.js — autenticación pública (Cliente / Emprendedor).
 *
 * Mismo patrón que adminApi.js, pero con su propia llave de token: la
 * sesión de un usuario público y la de un admin nunca se mezclan, ni
 * siquiera en el navegador.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "checkbiz_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isLoggedIn() {
  return Boolean(getToken());
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(auth ? authHeaders() : {}),
      },
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté corriendo (docker compose up)."
    );
  }

  if (res.status === 401 && auth) logout();

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sin cuerpo
  }

  if (!res.ok) {
    throw new Error(data?.mensaje || `Error del servidor (${res.status})`);
  }
  return data;
}

// ---------------------------------------------------------------------
// Registro / Login (A2 / B2)
// ---------------------------------------------------------------------
export async function registrar({ nombreCompleto, correo, telefono, pais, cedula, password, aceptoTerminos }) {
  const data = await api("/auth/registro", {
    method: "POST",
    auth: false,
    body: { nombreCompleto, correo, telefono, pais, cedula, password, aceptoTerminos },
  });
  setToken(data.token);
  return data;
}

export async function login({ correo, password }) {
  const data = await api("/auth/login", { method: "POST", auth: false, body: { correo, password } });
  setToken(data.token);
  return data;
}

export async function obtenerPerfil() {
  const data = await api("/auth/me");
  return data.usuario;
}

export async function actualizarPerfil({ nombreCompleto, telefono }) {
  const data = await api("/auth/perfil", { method: "PUT", body: { nombreCompleto, telefono } });
  return data.usuario;
}

// ---------------------------------------------------------------------
// Foto de perfil (A9)
// ---------------------------------------------------------------------
export async function subirFotoPerfil(archivo) {
  const form = new FormData();
  form.append("foto", archivo);
  const data = await api("/auth/perfil/foto", { method: "POST", body: form, isForm: true });
  return data.usuario;
}

export async function obtenerFotoPerfilUrl() {
  const res = await fetch(`${API_BASE}/auth/perfil/foto/archivo`, { headers: authHeaders() });
  if (!res.ok) return null;
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// ---------------------------------------------------------------------
// Notificaciones (A10)
// ---------------------------------------------------------------------
export async function listarNotificaciones() {
  return api("/auth/notificaciones");
}

export async function marcarNotificacionLeida(id) {
  return api(`/auth/notificaciones/${id}/leida`, { method: "PATCH" });
}

export async function marcarTodasLeidas() {
  return api("/auth/notificaciones/leidas-todas", { method: "PATCH" });
}

// ---------------------------------------------------------------------
// OTP (Capa 2 — A3)
// ---------------------------------------------------------------------
export async function enviarOtp(canal = "sms") {
  return api("/auth/otp/enviar", { method: "POST", body: { canal } });
}

export async function verificarOtp(codigo) {
  const data = await api("/auth/otp/verificar", { method: "POST", body: { codigo } });
  setToken(data.token); // el token vuelve con el kycLayer actualizado
  return data;
}

// ---------------------------------------------------------------------
// Foto de verificación (Capa 3 — A3.1)
// ---------------------------------------------------------------------
export async function subirFotoVerificacion(archivo) {
  const form = new FormData();
  form.append("foto", archivo);
  return api("/auth/foto", { method: "POST", body: form, isForm: true });
}

// ---------------------------------------------------------------------
// Activar emprendedor (Capa 4 + contrato — B2)
// ---------------------------------------------------------------------
export async function activarEmprendedor() {
  const data = await api("/emprendedor/activar", {
    method: "POST",
    body: { aceptoContratoEmprendedor: true },
  });
  setToken(data.token);
  return data;
}