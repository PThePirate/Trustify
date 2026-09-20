/**
 * adminApi.js — capa de datos del panel de administrador.
 *
 * Conectado al backend real (checkbiz-backend, Kotlin + Spring Boot).
 * Por defecto apunta a http://localhost:4000/api — cambia VITE_API_URL
 * en un .env si tu backend corre en otra URL (ver .env.example).
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "checkbiz_admin_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Envoltorio de fetch: arma headers, parsea JSON y convierte errores del
 * backend (ErrorResponse { error, mensaje }) en un Error de JS legible,
 * tal como lo esperan las pantallas (err.message).
 */
async function api(path, { method = "GET", body, auth = true } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth ? authHeaders() : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté corriendo (docker compose up)."
    );
  }

  if (res.status === 401 && auth) {
    clearToken();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Respuesta sin cuerpo
  }

  if (!res.ok) {
    throw new Error(data?.mensaje || `Error del servidor (${res.status})`);
  }

  return data;
}

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------
export async function adminLogin({ correo, password }) {
  const data = await api("/admin/login", {
    method: "POST",
    body: { correo, password },
    auth: false,
  });
  setToken(data.token);
  return data;
}

export function adminLogout() {
  clearToken();
}

export function isAdminLoggedIn() {
  return Boolean(getToken());
}

// ---------------------------------------------------------------------
// KYC — cola de fotos (E2)
// ---------------------------------------------------------------------
export async function listarFotos(estado = "en_revision") {
  return api(`/admin/kyc/fotos?estado=${estado}`);
}

export async function decidirFoto(id, { estado, motivoRechazo }) {
  return api(`/admin/kyc/fotos/${id}`, {
    method: "PATCH",
    body: { estado, motivoRechazo },
  });
}

/**
 * El archivo de la foto (selfie + cédula) ya no es un estático público en
 * /uploads — es un dato sensible que exige rol ADMIN. Un <img src="..."> no
 * puede mandar el header Authorization, así que lo traemos como blob y
 * devolvemos una URL de objeto local para usarla en el <img>.
 * El caller debe llamar URL.revokeObjectURL(url) cuando ya no la necesite.
 */
export async function obtenerFotoVerificacionUrl(id) {
  const res = await fetch(`${API_BASE}/admin/kyc/fotos/${id}/archivo`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "La foto ya no está disponible" : `Error del servidor (${res.status})`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// ---------------------------------------------------------------------
// Veto por cédula (E4)
// ---------------------------------------------------------------------
export async function vetarCedula({ cedula, motivo }) {
  return api("/admin/veto", { method: "POST", body: { cedula, motivo } });
}

/**
 * El backend todavía no tiene un endpoint GET para listar vetos (solo
 * POST /admin/veto para crear uno). Hasta que exista, esta función
 * devuelve una lista vacía en vez de fallar, para que la pantalla de
 * Veto siga funcionando sin un "historial reciente" real.
 * TODO backend: agregar GET /api/admin/veto.
 */
export async function listarVetosRecientes() {
  return [];
}

// ---------------------------------------------------------------------
// Panel general — estadísticas y actividad (conectado)
// ---------------------------------------------------------------------
export async function obtenerEstadisticas() {
  return api("/admin/estadisticas");
}

export async function listarActividadReciente(limite = 6) {
  return api(`/admin/actividad?limite=${limite}`);
}

// ---------------------------------------------------------------------
// Búsqueda global + ficha de usuario 360° (conectado)
// ---------------------------------------------------------------------
export async function buscarUsuarios(query) {
  const q = query.trim();
  if (!q) return [];
  return api(`/admin/usuarios?buscar=${encodeURIComponent(q)}`);
}

export async function obtenerUsuario(id) {
  return api(`/admin/usuarios/${id}`);
}

// ---------------------------------------------------------------------
// E5 — Categorías del catálogo maestro (conectado)
// ---------------------------------------------------------------------
export async function listarCategorias() {
  return api("/admin/categorias");
}

export async function crearCategoria({ nombre, icono }) {
  return api("/admin/categorias", { method: "POST", body: { nombre, icono } });
}

export async function alternarCategoria(id) {
  return api(`/admin/categorias/${id}`, { method: "PATCH" });
}

// ---------------------------------------------------------------------
// E3 — Moderación de denuncias (conectado)
// ---------------------------------------------------------------------
export async function listarDenuncias(estado = "abierta") {
  return api(`/admin/denuncias?estado=${estado}`);
}

export async function resolverDenuncia(id, accion) {
  return api(`/admin/denuncias/${id}`, { method: "PATCH", body: { accion } });
}

// ---------------------------------------------------------------------
// E8 — Logs de auditoría (conectado)
// ---------------------------------------------------------------------
export async function listarLogsAuditoria() {
  return api("/admin/logs");
}