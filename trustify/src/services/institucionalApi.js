/**
 * institucionalApi.js — capa de datos del panel institucional (D1/D2).
 * Mismo patrón que adminApi.js, con su propio token — una cuenta
 * institucional nunca comparte sesión con un usuario o un admin.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "checkbiz_institucional_token";
const INFO_KEY = "checkbiz_institucional_info";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(INFO_KEY);
}

/** tipo: 'universidad' | 'camara_impuestos' | 'camara_negocio' — decide qué nav/dashboard mostrar. */
export function obtenerInstitucionActual() {
  try {
    return JSON.parse(localStorage.getItem(INFO_KEY));
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, { method = "GET", body, auth = true } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo (docker compose up).");
  }

  if (res.status === 401 && auth) clearToken();

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sin cuerpo
  }

  if (!res.ok) throw new Error(data?.mensaje || `Error del servidor (${res.status})`);
  return data;
}

// ---------------------------------------------------------------------
// Login institucional (D1)
// ---------------------------------------------------------------------
export async function institucionalLogin({ correo, password }) {
  const data = await api("/institucional/login", { method: "POST", body: { correo, password }, auth: false });
  setToken(data.token);
  localStorage.setItem(INFO_KEY, JSON.stringify(data.institucion));
  return data;
}

export function institucionalLogout() {
  clearToken();
}

export function isInstitucionalLoggedIn() {
  return Boolean(getToken());
}

// ---------------------------------------------------------------------
// Dashboard agregado de formalización (D2)
// ---------------------------------------------------------------------
export async function obtenerDashboardB2G() {
  return api("/institucional/dashboard-b2g");
}

// ---------------------------------------------------------------------
// Panel B2B Universidades (C2/C3)
// ---------------------------------------------------------------------
export async function obtenerDashboardCaces() {
  return api("/institucional/dashboard-caces");
}

export async function listarAlumniSeguimiento() {
  return api("/institucional/alumni");
}

export async function decidirAlumni(id, estado) {
  return api(`/institucional/alumni/${id}`, { method: "PATCH", body: { estado } });
}
