/**
 * negocioApi.js — Mini Landing Page y catálogo del emprendedor (B3/B4).
 * Mismo patrón de fetch real que authApi.js / adminApi.js.
 */
import { getToken, logout } from "@/services/authApi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, { method = "GET", body, query, auth = true } = {}) {
  const qs = query
    ? "?" + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined)).toString()
    : "";
  let res;
  try {
    res = await fetch(`${API_BASE}${path}${qs}`, {
      method,
      headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }

  // Un token vencido/corrupto hace que el filtro JWT del backend responda
  // 401 incluso en rutas públicas (revisa el token antes de mirar si la
  // ruta exige sesión). En una llamada sin auth, ese 401 no significa que
  // haya que cerrar sesión.
  if (res.status === 401 && auth) logout();

  if (res.status === 204) return null; // sin contenido (ej. eliminar)

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
// Negocio (B3)
// ---------------------------------------------------------------------
export async function crearNegocio(datos) {
  return api("/negocio", { method: "POST", body: datos });
}

export async function obtenerMiNegocio() {
  return api("/negocio/mio");
}

export async function actualizarNegocio(datos) {
  return api("/negocio/mio", { method: "PUT", body: datos });
}

export async function cambiarPublicacion(publicar) {
  return api("/negocio/mio/publicacion", { method: "PATCH", query: { publicar } });
}

export async function listarCategoriasDisponibles() {
  // Vive bajo /negocios (plural, público) y no /negocio (singular, exige
  // sesión) — antes de este cambio el backend devolvía 401 para cualquiera
  // que abriera la búsqueda sin haber iniciado sesión.
  return api("/negocios/categorias-disponibles", { auth: false });
}

// ---------------------------------------------------------------------
// Bandeja de solicitudes (B5)
// ---------------------------------------------------------------------
export async function misSolicitudesRecibidas() {
  return api("/negocio/mio/solicitudes");
}

export async function actualizarEstadoSolicitud(id, estado) {
  return api(`/negocio/mio/solicitudes/${id}/estado`, { method: "PATCH", body: { estado } });
}

// ---------------------------------------------------------------------
// Reputación y Trust Score (B6)
// ---------------------------------------------------------------------
export async function obtenerReputacion() {
  return api("/negocio/mio/reputacion");
}

export async function listarMisResenas() {
  return api("/negocio/mio/resenas");
}

export async function responderResena(id, respuesta) {
  return api(`/negocio/mio/resenas/${id}/respuesta`, { method: "PATCH", body: { respuesta } });
}

// ---------------------------------------------------------------------
// Catálogo (B4)
// ---------------------------------------------------------------------
export async function listarCatalogo() {
  return api("/negocio/mio/catalogo");
}

export async function crearItemCatalogo(datos) {
  return api("/negocio/mio/catalogo", { method: "POST", body: datos });
}

export async function actualizarItemCatalogo(id, datos) {
  return api(`/negocio/mio/catalogo/${id}`, { method: "PATCH", body: datos });
}

export async function eliminarItemCatalogo(id) {
  return api(`/negocio/mio/catalogo/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------
// Perfil público (A6) — sin autenticación, cualquiera puede verlo
// ---------------------------------------------------------------------
export async function obtenerNegocioPublico(slug) {
  return api(`/negocios/publico/${slug}`, { auth: false });
}

// ---------------------------------------------------------------------
// Búsqueda pública (A4/A5) — sin autenticación
// ---------------------------------------------------------------------
export async function buscarNegocios({ texto, categoriaId, ciudad, nivel } = {}) {
  return api("/negocios", {
    query: { texto, categoriaId, ciudad, nivel },
    auth: false,
  });
}

export async function listarCiudadesDisponibles() {
  return api("/negocios/ciudades-disponibles", { auth: false });
}

// ---------------------------------------------------------------------
// QR de verificación física (B11)
// ---------------------------------------------------------------------
export async function obtenerMiQr() {
  return api("/negocio/mio/qr");
}

// Sin sesión: cualquiera que escanee el QR físico dispara esto.
export async function registrarEscaneoQr(codigo) {
  return api(`/negocios/qr/${codigo}/escaneo`, { method: "POST", auth: false });
}