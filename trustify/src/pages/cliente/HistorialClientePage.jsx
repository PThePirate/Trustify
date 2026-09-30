import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, CalendarDays, CheckCircle2, Clock3, Star, FileText } from "lucide-react";
import ClienteSection from "@/components/cliente/ClienteSection";
import { misSolicitudes } from "@/services/solicitudApi";

const fecha = valor => valor ? new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(valor)) : "Fecha pendiente";

export default function HistorialClientePage() {
  const [solicitudes, setSolicitudes] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { misSolicitudes().then(setSolicitudes).catch(e => setError(e.message)); }, []);
  const completadas = (solicitudes || []).filter(s => s.estado === "confirmada");
  const resenadas = completadas.filter(s => s.resena);
  return <ClienteSection icon={Award} eyebrow="Tu trayectoria" title="Historial y reseñas" description="Un registro de servicios recibidos y de las reseñas que publicaste tras confirmarlos." action={{ to: "/mis-solicitudes", label: "Ver solicitudes" }}>
    <div className="client-history-stats"><div><CheckCircle2 className="size-6" /><strong>{completadas.length}</strong><span>Trabajos confirmados</span></div><div><Star className="size-6" /><strong>{resenadas.length}</strong><span>Reseñas auditadas</span></div></div>
    {error && <p role="alert" className="client-extra-error">{error}</p>}{!solicitudes && !error && <p className="mt-6 text-sm text-muted-foreground">Cargando historial…</p>}
    {solicitudes && <div className="client-extra-split"><section className="client-extra-panel"><h2 className="font-display text-lg font-bold">Mis reseñas publicadas</h2>{resenadas.length === 0 ? <div className="client-extra-empty"><Star className="size-8 text-pending" /><strong>Aún no has publicado reseñas</strong><p>Podrás reseñar después de confirmar que recibiste un servicio.</p></div> : <div className="mt-4 space-y-3">{resenadas.map(s => <article key={s.id} className="client-history-card"><div className="flex items-center justify-between gap-2"><Link to={`/negocio/publico/${s.negocio.slug}`} className="font-bold text-trust hover:underline">{s.negocio.nombreComercial}</Link><span className="client-audit-badge"><Award className="size-3" /> Reseña auditada</span></div><div className="mt-2 flex gap-1" aria-label={`${s.resena.estrellas} de 5 estrellas`}>{[1,2,3,4,5].map(i => <Star key={i} className={`size-4 ${i <= s.resena.estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />)}</div>{s.resena.comentario && <p className="mt-2 text-sm text-muted-foreground">{s.resena.comentario}</p>}<p className="mt-2 text-xs text-muted-foreground">Publicada el {fecha(s.resena.creadoEn)}</p></article>)}</div>}</section>
    <section className="client-extra-panel"><h2 className="font-display text-lg font-bold">Trabajos recibidos</h2><p className="mt-1 text-xs text-muted-foreground">Registro de confirmaciones en CheckBiz; no es una factura ni comprobante de pago.</p>{completadas.length === 0 ? <div className="client-extra-empty"><FileText className="size-8 text-trust" /><strong>Sin trabajos confirmados</strong><p>Cuando confirmes una entrega, aparecerá aquí.</p></div> : <div className="mt-4 space-y-3">{completadas.map(s => <article key={s.id} className="client-history-card"><div className="flex items-center gap-2"><CheckCircle2 className="size-5 text-verified" /><strong>{s.negocio.nombreComercial}</strong></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.descripcion}</p><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4" /> Confirmado el {fecha(s.confirmadaEn)}</p><Link to="/mis-solicitudes" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-trust">Ver solicitud <Clock3 className="size-3" /></Link></article>)}</div>}</section></div>}
  </ClienteSection>;
}
