const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function obtenerPerfilPublico(id) {
  const res = await fetch(`${API_BASE}/perfiles/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(res.status === 404 ? "No encontramos este perfil." : "No se pudo cargar el perfil.");
  return res.json();
}

export const imagenPerfilPublico = (id, tipo) => `${API_BASE}/perfiles/${encodeURIComponent(id)}/${tipo}`;

