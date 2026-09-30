/**
 * institucionalApi.js — capa de datos del panel institucional (D1/D2).
 * Mismo patrón que adminApi.js, con su propio token — una cuenta
 * institucional nunca comparte sesión con un usuario o un admin.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "checkbiz_institucional_token";
const INFO_KEY = "checkbiz_institucional_info";

function getToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) return token;
  const anterior = localStorage.getItem(TOKEN_KEY);
  if (anterior) {
    sessionStorage.setItem(TOKEN_KEY, anterior);
    const info = localStorage.getItem(INFO_KEY);
    if (info) sessionStorage.setItem(INFO_KEY, info);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);
  }
  return anterior;
}
function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
}
function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(INFO_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(INFO_KEY);
}

/** tipo: 'universidad' | 'camara_impuestos' | 'camara_negocio' — decide qué nav/dashboard mostrar. */
export function obtenerInstitucionActual() {
  try {
    getToken();
    return JSON.parse(sessionStorage.getItem(INFO_KEY));
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
  const tokenEnviado = auth ? getToken() : null;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json", ...(tokenEnviado ? { Authorization: `Bearer ${tokenEnviado}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "TimeoutError") throw new Error("El servidor tardó demasiado en responder. Inténtalo de nuevo.");
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo (docker compose up).");
  }

  if (res.status === 401 && auth && getToken() === tokenEnviado) clearToken();

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
  sessionStorage.setItem(INFO_KEY, JSON.stringify(data.institucion));
  localStorage.removeItem(INFO_KEY);
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

// D3 — detalle por ciudad, con supresión de ciudades poco pobladas.
export async function obtenerDashboardDetalleB2G() {
  return api("/institucional/dashboard-b2g/detalle");
}

export async function listarAlumniSeguimiento() {
  return api("/institucional/alumni");
}

export async function decidirAlumni(id, estado) {
  return api(`/institucional/alumni/${id}`, { method: "PATCH", body: { estado } });
}

