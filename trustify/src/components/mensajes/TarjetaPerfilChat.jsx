import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, UserRound, ArrowUpRight } from "lucide-react";
import { imagenPerfilPublico, obtenerPerfilPublico } from "@/services/perfilPublicoApi";

export default function TarjetaPerfilChat({ usuarioId, onClose, contexto }) {
  const location = useLocation();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let activo = true;
    obtenerPerfilPublico(usuarioId).then(data => { if (activo) setPerfil(data); }).catch(err => { if (activo) setError(err.message); });
    return () => { activo = false; };
  }, [usuarioId]);
  useEffect(() => {
    const cerrar = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [onClose]);

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label="Tarjeta de perfil" className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="relative h-28 bg-gradient-to-r from-trust/50 via-verified/30 to-trust/20">
        {perfil?.tieneBanner && <img src={imagenPerfilPublico(usuarioId, "banner")} alt="" className="size-full object-cover" />}
        <button type="button" onClick={onClose} aria-label="Cerrar tarjeta" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/80"><X className="size-4" /></button>
      </div>
      <div className="relative px-5 pb-5 pt-12">
        <span className="absolute -top-10 left-5 grid size-20 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-muted text-trust">{perfil?.tieneFoto ? <img src={imagenPerfilPublico(usuarioId, "foto")} alt="" className="size-full object-cover" /> : <UserRound className="size-9" />}</span>
        {error ? <p role="alert" className="text-sm text-danger">{error}</p> : !perfil ? <p className="text-sm text-muted-foreground">Cargando perfil…</p> : <>
          <h3 className="text-xl font-bold">{perfil.nombreUsuario || perfil.nombre}</h3>
          <p className="mt-1 text-xs font-medium text-trust">{contexto === "cliente" ? "Cliente" : contexto === "emprendedor" ? "Emprendedor" : perfil.esEmprendedor ? "Emprendedor" : "Cliente"}{perfil.estado ? ` · ${perfil.estado}` : ""}</p>
          {perfil.descripcion && <p className="mt-4 whitespace-pre-wrap break-words text-sm">{perfil.descripcion}</p>}
          <Link to={`/usuarios/${usuarioId}`} state={{ volverA: location.pathname + location.search, volverTexto: "Volver a mensajes" }} onClick={onClose} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-trust hover:underline">Ver perfil completo <ArrowUpRight className="size-4" /></Link>
        </>}
      </div>
    </section>
  </div>;
}
