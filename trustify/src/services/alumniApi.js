/**
 * alumniApi.js — verificación de alumni (Módulo C, lado del usuario).
 * Mismo patrón de fetch real que denunciaApi.js.
 */
import { getToken, logout } from "@/services/authApi";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

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
      headers: { "Content-Type": "application/json", ...(tokenEnviado ? { Authorization: `Bearer ${tokenEnviado}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }

  if (res.status === 401 && auth && getToken() === tokenEnviado) logout();

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sin cuerpo
  }
  if (!res.ok) throw new Error(data?.mensaje || `Error del servidor (${res.status})`);
  return data;
}

export async function listarUniversidades() {
  return api("/universidades", { auth: false });
}

export async function solicitarVerificacionAlumni(universidadId) {
  return api("/alumni/verificacion", { method: "POST", body: { universidadId } });
}

export async function misVerificacionesAlumni() {
  return api("/alumni/mis-verificaciones");
}

