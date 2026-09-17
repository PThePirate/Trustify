/**
 * solicitudApi.js — Solicitud de pedido (A7) y confirmación + reseña (A8).
 * Mismo patrón de fetch real que authApi.js / negocioApi.js.
 */
import { getToken, logout } from "@/services/authApi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }

  if (res.status === 401) logout();

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
// A7 — Solicitud de pedido
// ---------------------------------------------------------------------
export async function crearSolicitud({ negocioSlug, descripcion, fechaEstimada }) {
  return api("/solicitudes", { method: "POST", body: { negocioSlug, descripcion, fechaEstimada } });
}

export async function misSolicitudes() {
  return api("/solicitudes/mias");
}

// ---------------------------------------------------------------------
// A8 — Confirmación y reseña
// ---------------------------------------------------------------------
export async function confirmarSolicitud(id) {
  return api(`/solicitudes/${id}/confirmar`, { method: "PATCH" });
}

export async function dejarResena(id, { estrellas, comentario }) {
  return api(`/solicitudes/${id}/resena`, { method: "POST", body: { estrellas, comentario } });
}