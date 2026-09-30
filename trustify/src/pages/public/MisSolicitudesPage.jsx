import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Loader2, CheckCircle2, Star, AlertCircle,
  Archive, Calendar, Store, MessageSquareText, MessageCircle, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { misSolicitudes, confirmarSolicitud, dejarResena, eliminarMensajeDirecto, archivarConversacion } from "@/services/solicitudApi";
import HiloMensajes from "@/components/mensajes/HiloMensajes";
import TarjetaPerfilChat from "@/components/mensajes/TarjetaPerfilChat";
import { resolverImagenNegocio } from "@/services/negocioApi";

const ESTADO_INFO = {
  enviada: { label: "Enviada", variant: "pending" },
  en_conversacion: { label: "En conversación", variant: "trust" },
  confirmada: { label: "Confirmada", variant: "verified" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

function AvatarNegocio({ negocio, className = "size-10" }) {
  const imagen = negocio.logoUrl || negocio.fotoPortadaUrl;
  return <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-trust/15 font-bold text-trust ${className}`}>
    {imagen ? <img src={resolverImagenNegocio(imagen)} alt="" className="size-full object-cover" /> : negocio.nombreComercial.slice(0, 2).toUpperCase()}
  </span>;
}

function FormularioResena({ solicitudId, onListo }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await dejarResena(solicitudId, { estrellas, comentario: comentario || undefined });
      onListo();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-3 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium">Deja tu reseña auditada</p>
      <p className="text-xs text-muted-foreground">
        Solo puedes reseñar porque confirmaste una solicitud real — por eso tus reseñas son confiables.
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setEstrellas(n)}>
            <Star className={`size-6 ${n <= estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="¿Cómo te fue? (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}
      <Button type="submit" variant="trust" size="sm" disabled={enviando}>
        {enviando ? <Loader2 className="size-4 animate-spin" /> : "Publicar reseña"}
      </Button>
    </form>
  );
}

export default function MisSolicitudesPage() {
  const [searchParams] = useSearchParams();
  const [solicitudes, setSolicitudes] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [error, setError] = useState("");
  const [hiloAbiertoId, setHiloAbiertoId] = useState(searchParams.get("chat"));
  const [filtro, setFiltro] = useState('todas');
  const [perfilAbiertoId, setPerfilAbiertoId] = useState(null);

  function cargar() {
    misSolicitudes().then((lista) => { setSolicitudes(lista); setError(""); }).catch((err) => setError(err.message));
  }

  const visibles = solicitudes?.filter(s => filtro === 'archivadas' ? s.archivada : !s.archivada && (filtro === 'todas' || (filtro === 'activas' && s.estado !== 'confirmada' && s.estado !== 'cancelada') || (filtro === 'por-resenar' && s.estado === 'confirmada' && !s.resena))) ?? [];
  const seleccion = visibles.find((s) => s.id === hiloAbiertoId) ?? visibles[0];
  useEffect(cargar, []);
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (!chatId || !solicitudes?.some(s => s.id === chatId)) return;
    setHiloAbiertoId(chatId);
  }, [solicitudes, searchParams]);

  async function confirmar(id) {
    setConfirmandoId(id);
    setError("");
    try {
      await confirmarSolicitud(id);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmandoId(null);
    }
  }

  async function ocultar(id) {
    setError("");
    try {
      await eliminarMensajeDirecto(id);
      setSolicitudes((actual) => actual.filter((item) => item.id !== id));
      if (hiloAbiertoId === id) setHiloAbiertoId(null);
    } catch (err) { setError(err.message); }
  }

  async function archivar(id, archivada) {
    setError("");
    try {
      await archivarConversacion(id, archivada);
      setSolicitudes(actual => actual.map(item => item.id === id ? { ...item, archivada } : item));
    } catch (err) { setError(err.message); }
  }

  return <div className="client-inner-page client-messages mx-auto max-w-6xl">
    <div className="client-page-heading mb-5"><h1 className="font-display text-2xl font-bold sm:text-3xl">Mensajes directos</h1><p className="mt-1 text-sm text-muted-foreground">Conversa con los negocios desde CheckBiz.</p></div>
    {error && <p role="alert" className="mb-4 flex items-center gap-2 text-sm text-danger"><AlertCircle className="size-4" />{error}</p>}
    <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-border md:border-b-0 md:border-r">
        <div className="border-b border-border p-4"><h2 className="font-semibold">Mensajes directos</h2><div className="mt-3 flex flex-wrap gap-1">{[['todas', 'Todas'], ['activas', 'Activas'], ['por-resenar', 'Por reseñar'], ['archivadas', 'Archivadas']].map(([id, label]) => <button key={id} type="button" aria-pressed={filtro === id} onClick={() => setFiltro(id)} className={`rounded-lg px-2.5 py-1.5 text-xs ${filtro === id ? 'bg-trust/15 text-trust' : 'text-muted-foreground hover:bg-muted'}`}>{label}</button>)}</div></div>
        <div className="max-h-[540px] overflow-y-auto p-2">{solicitudes === null ? error ? <button type="button" onClick={cargar} className="p-4 text-sm text-trust underline">Reintentar</button> : <p className="p-4 text-sm text-muted-foreground">Cargando conversaciones…</p> : visibles.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No hay conversaciones aquí.</p> : visibles.map((s) => <div key={s.id} className={`group flex items-center gap-2 rounded-xl pr-2 ${seleccion?.id === s.id ? 'bg-trust/15' : 'hover:bg-muted/60'}`}><button type="button" onClick={() => s.negocio.propietarioId && setPerfilAbiertoId(s.negocio.propietarioId)} aria-label={`Ver perfil de ${s.negocio.nombreUsuario || s.negocio.nombreComercial}`} className="ml-3 hover:ring-2 hover:ring-trust"><AvatarNegocio negocio={s.negocio} /></button><button type="button" onClick={() => setHiloAbiertoId(s.id)} className="min-w-0 flex-1 py-3 text-left"><strong className="block truncate text-sm">{s.negocio.nombreComercial}</strong><small className="block truncate text-muted-foreground">{s.descripcion}</small></button><button type="button" onClick={() => ocultar(s.id)} aria-label={`Eliminar mensaje directo con ${s.negocio.nombreComercial}`} title="Quitar de mis mensajes directos" className="rounded-lg p-1.5 text-muted-foreground opacity-60 hover:bg-danger/10 hover:text-danger group-hover:opacity-100"><X className="size-4" /></button></div>)}</div>
      </aside>
      <section className="flex min-w-0 flex-col p-4 sm:p-6">{!seleccion ? <div className="grid flex-1 place-content-center text-center text-muted-foreground"><MessageCircle className="mx-auto mb-3 size-10" /><p>Elige una conversación o contacta a un negocio.</p><Link to="/buscar" className="mt-3 text-sm text-trust underline">Explorar negocios</Link></div> : <>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div className="flex items-center gap-3"><button type="button" onClick={() => seleccion.negocio.propietarioId && setPerfilAbiertoId(seleccion.negocio.propietarioId)} aria-label="Ver perfil del emprendedor" className="rounded-full hover:ring-2 hover:ring-trust"><AvatarNegocio negocio={seleccion.negocio} className="size-11" /></button><div><Link to={`/negocio/publico/${seleccion.negocio.slug}`} className="text-lg font-bold hover:text-trust">{seleccion.negocio.nombreComercial}</Link>{seleccion.negocio.nombreUsuario && <p className="text-xs text-trust">{seleccion.negocio.nombreUsuario}</p>}<p className="mt-1 text-xs text-muted-foreground"><Calendar className="mr-1 inline size-3.5" />Desde {formatearFecha(seleccion.creadoEn)}</p></div></div><Badge variant={ESTADO_INFO[seleccion.estado]?.variant ?? 'outline'}>{ESTADO_INFO[seleccion.estado]?.label ?? seleccion.estado}</Badge></header>
        {seleccion.descripcion !== 'Conversación iniciada desde la Mini Landing' && <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm"><strong className="text-xs text-muted-foreground">Solicitud original</strong><p className="mt-1">{seleccion.descripcion}</p></div>}
        <div className="min-h-0 flex-1"><HiloMensajes key={seleccion.id} solicitudId={seleccion.id} estado={seleccion.estado} avatarNegocioUrl={seleccion.negocio.logoUrl || seleccion.negocio.fotoPortadaUrl ? resolverImagenNegocio(seleccion.negocio.logoUrl || seleccion.negocio.fotoPortadaUrl) : null} amplio /></div>
        <Button variant="outline" size="sm" className="mt-4 self-start" onClick={() => archivar(seleccion.id, !seleccion.archivada)}><Archive className="size-4" />{seleccion.archivada ? "Desarchivar conversación" : "Archivar conversación"}</Button>
        {seleccion.estado !== 'confirmada' && seleccion.estado !== 'cancelada' && seleccion.descripcion !== 'Conversación iniciada desde la Mini Landing' && <Button variant="outline" size="sm" className="mt-4 self-start" disabled={confirmandoId === seleccion.id} onClick={() => confirmar(seleccion.id)}><CheckCircle2 className="size-4" />Confirmar que recibí el producto/servicio</Button>}
        {seleccion.estado === 'confirmada' && !seleccion.resena && <FormularioResena solicitudId={seleccion.id} onListo={cargar} />}
        {seleccion.resena && <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MessageSquareText className="size-4" />Reseña publicada: {seleccion.resena.estrellas} estrellas</p>}
      </>}</section>
    </div>
    {perfilAbiertoId && <TarjetaPerfilChat usuarioId={perfilAbiertoId} onClose={() => setPerfilAbiertoId(null)} />}
  </div>;
}
