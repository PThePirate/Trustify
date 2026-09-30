/**
 * denunciaApi.js — reportar un negocio (A11). Mismo patrón de fetch
 * real que el resto de servicios del cliente.
 */
import { getToken, logout } from "@/services/authApi";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, { method = "GET", body } = {}) {
  let res;
  const tokenEnviado = getToken();
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(tokenEnviado ? { Authorization: `Bearer ${tokenEnviado}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }

  if (res.status === 401 && getToken() === tokenEnviado) logout();

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sin cuerpo
  }
  if (!res.ok) throw new Error(data?.mensaje || `Error del servidor (${res.status})`);
  return data;
}

export async function reportarNegocio({ negocioSlug, motivo }) {
  return api("/denuncias", { method: "POST", body: { negocioSlug, motivo } });
}

export async function misDenuncias() {
  return api("/denuncias/mias");
}

