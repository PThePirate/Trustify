import { getToken } from "@/services/authApi";

const EVENTO = "checkbiz-cliente-espacio";

function clave() {
  try {
    const token = getToken();
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.tipo === "USUARIO" && payload.sub) return `checkbiz-espacio-v1:${payload.sub}`;
  } catch { /* Una sesión inválida no debe compartir datos con otra cuenta. */ }
  return null;
}

const VACIO = { carpetas: [], guardados: [], recordatorios: [], cotizaciones: [] };

export function leerEspacio() {
  const key = clave();
  if (!key) return { ...VACIO };
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    return Object.fromEntries(Object.keys(VACIO).map(k => [k, Array.isArray(raw[k]) ? raw[k] : []]));
  } catch { return { ...VACIO }; }
}

export function guardarEspacio(siguiente) {
  const key = clave();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(siguiente));
  window.dispatchEvent(new Event(EVENTO));
}

export function actualizarEspacio(fn) {
  const actual = leerEspacio();
  const siguiente = fn(actual);
  guardarEspacio(siguiente);
  return siguiente;
}

export function obtenerGuardadosSlugs() { return leerEspacio().guardados.map(g => g.slug); }

export function alternarGuardado(slug, negocio = null) {
  return actualizarEspacio(actual => {
    const existe = actual.guardados.some(g => g.slug === slug);
    return { ...actual, guardados: existe
      ? actual.guardados.filter(g => g.slug !== slug)
      : [...actual.guardados, { slug, carpetaId: null, nivel: negocio?.nivelFormalizacion ?? null, capas: negocio?.capasVerificacion?.filter(c => c.cumplida).map(c => c.capa) ?? [], visto: true }] };
  });
}

export function suscribirEspacio(callback) {
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENTO, callback); window.removeEventListener("storage", callback); };
}
