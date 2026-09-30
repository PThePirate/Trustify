import { getToken, logout } from "@/services/authApi";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function consultarCedulaPublica(cedula) {
  let respuesta;
  const tokenEnviado = getToken();
  try {
    respuesta = await fetch(`${API_BASE}/cliente/verificacion/cedula`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenEnviado}` },
      body: JSON.stringify({ cedula }),
    });
  } catch { throw new Error("No se pudo conectar con el servidor."); }
  if (respuesta.status === 401 && getToken() === tokenEnviado) logout();
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new Error(datos?.mensaje || `Error del servidor (${respuesta.status})`);
  return datos;
}

