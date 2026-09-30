/**
 * authApi.js — autenticación pública (Cliente / Emprendedor).
 *
 * Mismo patrón que adminApi.js, pero con su propia llave de token: la
 * sesión de un usuario público y la de un admin nunca se mezclan, ni
 * siquiera en el navegador.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "checkbiz_token";
const PERFIL_KEY = "checkbiz_perfil_sesion";

function sujetoSesion() {
  try { return JSON.parse(atob(getToken().split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).sub; }
  catch { return null; }
}

export function leerPerfilSesion() {
  const sujeto = sujetoSesion();
  if (!sujeto) return null;
  try {
    const guardado = JSON.parse(sessionStorage.getItem(PERFIL_KEY) || "null");
    return guardado?.sujeto === sujeto ? guardado.usuario : null;
  } catch { return null; }
}

function guardarPerfilSesion(usuario) {
  const sujeto = sujetoSesion();
  if (!sujeto || String(usuario?.id).toLowerCase() !== String(sujeto).toLowerCase()) return;
  let cambio = true;
  try {
    const siguiente = JSON.stringify({ sujeto, usuario });
    cambio = sessionStorage.getItem(PERFIL_KEY) !== siguiente;
    if (cambio) sessionStorage.setItem(PERFIL_KEY, siguiente);
  }
  catch { /* La sesión funciona aunque el navegador bloquee este almacenamiento. */ }
  if (cambio) window.dispatchEvent(new Event("checkbiz:perfil-actualizado"));
}

export function getToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) return token;
  // Tras actualizar desde versiones anteriores, conserva la sesión de esta
  // pestaña y elimina la credencial compartida con las demás ventanas.
  const anterior = localStorage.getItem(TOKEN_KEY);
  if (anterior) {
    sessionStorage.setItem(TOKEN_KEY, anterior);
    localStorage.removeItem(TOKEN_KEY);
  }
  return anterior;
}
function setToken(token) {
  sessionStorage.removeItem(PERFIL_KEY);
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
}
export function logout() {
  sessionStorage.removeItem(PERFIL_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("checkbiz:perfil-actualizado"));
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
  const tokenEnviado = auth ? getToken() : null;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      signal: AbortSignal.timeout(12000),
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(tokenEnviado ? { Authorization: `Bearer ${tokenEnviado}` } : {}),
      },
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "TimeoutError") throw new Error("El servidor tardó demasiado en responder. Inténtalo de nuevo.");
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté corriendo (docker compose up)."
    );
  }

  if (res.status === 401 && auth && getToken() === tokenEnviado) logout();

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
  if (data.usuario) guardarPerfilSesion(data.usuario);
  return data;
}

export async function login({ correo, password }) {
  const data = await api("/auth/login", { method: "POST", auth: false, body: { correo, password } });
  setToken(data.token);
  if (data.usuario) guardarPerfilSesion(data.usuario);
  return data;
}

export async function obtenerPerfil() {
  const data = await api("/auth/me");
  guardarPerfilSesion(data.usuario);
  return data.usuario;
}

export async function actualizarPerfil({ nombreCompleto, telefono, nombreUsuario, descripcionPerfil, estadoPerfil, negocioFavoritoSlug, negociosGuardadosSlugs }) {
  const data = await api("/auth/perfil", { method: "PUT", body: { nombreCompleto, telefono, nombreUsuario, descripcionPerfil, estadoPerfil, negocioFavoritoSlug, negociosGuardadosSlugs } });
  guardarPerfilSesion(data.usuario);
  return data.usuario;
}

// ---------------------------------------------------------------------
// Foto de perfil (A9)
// ---------------------------------------------------------------------
export async function subirFotoPerfil(archivo) {
  const form = new FormData();
  form.append("foto", archivo);
  const data = await api("/auth/perfil/foto", { method: "POST", body: form, isForm: true });
  guardarPerfilSesion(data.usuario);
  return data.usuario;
}

export async function obtenerFotoPerfilUrl() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/perfil/foto/archivo`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: AbortSignal.timeout(12000) });
  if (!res.ok || getToken() !== token) return null;
  const blob = await res.blob();
  if (getToken() !== token) return null;
  return URL.createObjectURL(blob);
}

// ---------------------------------------------------------------------
// Cuenta / Seguridad (B12)
// ---------------------------------------------------------------------
export async function cambiarPassword(passwordActual, passwordNueva) {
  return api("/auth/password", { method: "PATCH", body: { passwordActual, passwordNueva } });
}

export async function recuperarPassword(correo) {
  return api("/auth/password/recuperar", { method: "POST", auth: false, body: { correo } });
}

export async function restablecerPassword(correo, codigo, passwordNueva) {
  return api("/auth/password/restablecer", { method: "POST", auth: false, body: { correo, codigo, passwordNueva } });
}

export async function eliminarCuenta(password) {
  return api("/auth/cuenta", { method: "DELETE", body: { password } });
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
export async function subirFotoVerificacion(frente, reverso) {
  const form = new FormData();
  form.append("frente", frente);
  form.append("reverso", reverso);
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

export async function subirBannerPerfil(archivo) {
  const form = new FormData();
  form.append("foto", archivo);
  const data = await api("/auth/perfil/banner", { method: "POST", body: form, isForm: true });
  guardarPerfilSesion(data.usuario);
  return data.usuario;
}

export async function obtenerBannerPerfilUrl() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/perfil/banner/archivo`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: AbortSignal.timeout(12000) });
  if (!res.ok || getToken() !== token) return null;
  const blob = await res.blob();
  return getToken() === token ? URL.createObjectURL(blob) : null;
}

export async function listarFotosPerfilRecientes() {
  return api("/auth/perfil/fotos-recientes");
}

export async function obtenerFotoPerfilRecienteUrl(id) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/perfil/fotos-recientes/${id}/archivo`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error("No se pudo cargar esta foto.");
  const blob = await res.blob();
  if (getToken() !== token) throw new Error("La sesión cambió. Vuelve a abrir esta foto.");
  return URL.createObjectURL(blob);
}

export async function elegirFotoPerfilReciente(id) {
  const data = await api(`/auth/perfil/fotos-recientes/${id}/elegir`, { method: "PUT" });
  guardarPerfilSesion(data.usuario);
  return data.usuario;
}

