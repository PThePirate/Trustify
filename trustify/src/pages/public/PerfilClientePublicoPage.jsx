import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Heart, ShieldCheck, Sparkles, Store, UserRound } from "lucide-react";
import { obtenerPerfilPublico, imagenPerfilPublico } from "@/services/perfilPublicoApi";

function NegocioDestacado({ negocio, favorito = false }) {
  return <Link to={`/negocio/publico/${negocio.slug}`} className="client-public-business panel panel-hover">
    <span className="client-public-business-icon">{favorito ? <Heart size={22} /> : <Store size={22} />}</span>
    <span><strong>{negocio.nombre}</strong><small>{favorito ? "Mi negocio favorito" : "Negocio guardado"}</small></span>
    <span aria-hidden="true">↗</span>
  </Link>;
}

export default function PerfilClientePublicoPage() {
  const { id } = useParams();
  const location = useLocation();
  const volverA = location.state?.volverA || "/buscar";
  const volverTexto = location.state?.volverTexto || (location.state?.volverA ? "Volver a Mi Perfil" : "Explorar negocios");
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let vivo = true;
    obtenerPerfilPublico(id).then(data => { if (vivo) setPerfil(data); }).catch(err => { if (vivo) setError(err.message); });
    return () => { vivo = false; };
  }, [id]);

  if (error) return <div className="client-public-profile mx-auto max-w-5xl p-6"><Link to={volverA} className="client-public-back"><ArrowLeft size={16} /> {volverTexto}</Link><p className="mt-8">{error}</p></div>;
  if (!perfil) return <div className="client-public-profile mx-auto max-w-5xl p-6" aria-live="polite">Cargando perfil…</div>;

  return <main className="client-public-profile mx-auto max-w-5xl pb-16">
    <Link to={volverA} className="client-public-back"><ArrowLeft size={16} /> {volverTexto}</Link>
    <section className="client-public-identity">
      <div className="client-public-cover">{perfil.tieneBanner && <img src={imagenPerfilPublico(id, "banner")} alt="Banner del perfil" />}</div>
      <div className="client-public-identity-body">
        <div className="client-public-avatar">{perfil.tieneFoto ? <img src={imagenPerfilPublico(id, "foto")} alt={`Foto de ${perfil.nombreUsuario || "cliente"}`} /> : <UserRound size={32} />}</div>
        <div className="client-public-status"><span className="client-profile-status-dot" />{perfil.estado || "Disponible para conectar"}</div>
        <p className="client-public-eyebrow"><Sparkles size={14} /> Perfil de la comunidad</p>
        <h1>{perfil.nombreUsuario || perfil.nombre}</h1>
        <p className="client-public-bio">{perfil.descripcion || "Esta persona todavía no ha añadido una descripción."}</p>
        <div className="client-public-meta"><ShieldCheck size={16} /> {perfil.esEmprendedor ? "Emprendedor" : "Comprador"} en CheckBiz{perfil.miembroDesde ? ` · Desde ${new Date(perfil.miembroDesde).toLocaleDateString("es-EC", { month: "long", year: "numeric" })}` : ""}</div>
      </div>
    </section>
    <div className="client-public-grid">
      <section className="client-public-section"><div className="client-public-section-title"><Heart /> <div><h2>Mi favorito</h2><p>El negocio que más me gusta recomendar</p></div></div>{perfil.favorito ? <NegocioDestacado negocio={perfil.favorito} favorito /> : <p className="client-public-empty">Aún no ha elegido un negocio favorito.</p>}</section>
      <section className="client-public-section"><div className="client-public-section-title"><Bookmark /> <div><h2>Mi colección</h2><p>Hasta cinco negocios que quiero tener cerca</p></div></div>{perfil.guardados?.length ? <div className="client-public-businesses">{perfil.guardados.map(negocio => <NegocioDestacado key={negocio.slug} negocio={negocio} />)}</div> : <p className="client-public-empty">Aún no ha compartido negocios guardados.</p>}</section>
    </div>
  </main>;
}
