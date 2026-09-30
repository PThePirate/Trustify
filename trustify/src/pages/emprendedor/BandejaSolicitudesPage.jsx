import { useEffect, useState } from "react";
import { Archive, Ban, Calendar, Check, Inbox, MessageCircle, RotateCcw, ShieldCheck, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { misSolicitudesRecibidas, actualizarEstadoSolicitud, resolverImagenNegocio } from "@/services/negocioApi";
import HiloMensajes from "@/components/mensajes/HiloMensajes";
import { eliminarMensajeDirecto, archivarConversacion } from "@/services/solicitudApi";
import { imagenPerfilPublico } from "@/services/perfilPublicoApi";
import TarjetaPerfilChat from "@/components/mensajes/TarjetaPerfilChat";

const estadoInfo = { enviada: ["Pendiente", "pending"], en_conversacion: ["En conversación", "trust"], confirmada: ["Confirmada", "verified"], cancelada: ["Archivada", "outline"] };

export default function BandejaSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [seleccionId, setSeleccionId] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [perfilAbiertoId, setPerfilAbiertoId] = useState(null);

  function cargar() {
    misSolicitudesRecibidas().then((lista) => {
      setSolicitudes(lista);
      setSeleccionId((actual) => lista.some((item) => item.id === actual) ? actual : lista[0]?.id ?? null);
    }).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function cambiarEstado(id, estado) {
    setProcesando(true); setError("");
    try { await actualizarEstadoSolicitud(id, estado); cargar(); }
    catch (err) { setError(err.message); }
    finally { setProcesando(false); }
  }

  async function ocultar(id) {
    setError("");
    try {
      await eliminarMensajeDirecto(id);
      setSolicitudes((actual) => actual.filter((item) => item.id !== id));
      if (seleccionId === id) setSeleccionId(null);
    } catch (err) { setError(err.message); }
  }

  async function archivar(id, archivada) {
    setError("");
    try {
      await archivarConversacion(id, archivada);
      setSolicitudes(actual => actual.map(item => item.id === id ? { ...item, archivada } : item));
    } catch (err) { setError(err.message); }
  }

  const lista = solicitudes?.filter((item) => filtro === "archivadas" ? item.archivada : !item.archivada && (filtro !== "pendientes" || item.estado === "enviada")) ?? [];
  const seleccion = lista.find((item) => item.id === seleccionId) ?? lista[0];

  return <div className="business-page space-y-6">
    <div className="business-section-banner"><div className="relative z-10"><p className="text-sm font-semibold text-trust">Conversaciones que construyen confianza</p><h1 className="mt-1 text-3xl font-bold">Mensajes y solicitudes</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Conoce la verificación del cliente, responde sus preguntas y acuerda el pago y la entrega directamente con él.</p></div></div>
    <div className="grid min-h-[580px] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm lg:grid-cols-[minmax(270px,340px)_minmax(0,1fr)]">
      <aside className="border-b border-border lg:border-b-0 lg:border-r">
        <div className="border-b border-border p-4"><div className="flex gap-1 overflow-x-auto">{[["todas", "Todas"], ["pendientes", "Pendientes"], ["archivadas", "Archivadas"]].map(([id, label]) => <button key={id} onClick={() => setFiltro(id)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors ${filtro === id ? "bg-trust text-primary-ink" : "text-muted-foreground hover:bg-muted"}`}>{label}</button>)}</div></div>
        <div className="max-h-[620px] overflow-y-auto p-3">
          {!solicitudes ? <p className="p-4 text-sm text-muted-foreground">Cargando solicitudes…</p> : lista.length === 0 ? <div className="p-6 text-center text-sm text-muted-foreground"><Inbox className="mx-auto mb-3 size-7" />No hay solicitudes en esta vista.</div> : lista.map((item) => <div key={item.id} className={`group mb-2 flex items-start rounded-xl border transition-colors ${seleccion?.id === item.id ? "border-trust bg-trust/10" : "border-transparent hover:bg-muted/50"}`}><button onClick={() => setSeleccionId(item.id)} className="min-w-0 flex-1 p-4 text-left">
            <div className="flex items-center justify-between gap-2"><span className="truncate font-semibold">{item.cliente.nombreUsuario || item.cliente.nombreCompleto}</span><span className={`size-2 shrink-0 rounded-full ${item.estado === "enviada" ? "bg-action" : "bg-verified"}`} /></div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.descripcion}</p><p className="mt-2 text-xs text-muted-foreground">{new Date(item.creadoEn).toLocaleDateString("es-EC")}</p>
          </button><button type="button" onClick={() => ocultar(item.id)} aria-label={`Eliminar mensaje directo con ${item.cliente.nombreUsuario || item.cliente.nombreCompleto}`} title="Quitar de mis mensajes directos" className="m-2 rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"><X className="size-4" /></button></div>)}
        </div>
      </aside>
      <section className="min-w-0 p-5 sm:p-7">
        {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
        {!seleccion ? <div className="grid h-full min-h-80 place-content-center text-center text-muted-foreground"><MessageCircle className="mx-auto mb-3 size-10 text-trust" /><p>Selecciona una conversación para verla aquí.</p></div> : <>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5"><div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setPerfilAbiertoId(seleccion.cliente.id)} aria-label="Ver perfil del cliente" className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-trust/15 text-trust hover:ring-2 hover:ring-trust">{seleccion.cliente.tieneFoto ? <img src={imagenPerfilPublico(seleccion.cliente.id, "foto")} alt="" className="size-full object-cover" /> : <User className="size-5" />}</button><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h2 className="min-w-0 break-words text-xl font-bold">{seleccion.cliente.nombreUsuario || seleccion.cliente.nombreCompleto}</h2><span className="inline-flex items-center gap-1 rounded-full border border-verified/25 bg-verified/10 px-2 py-0.5 text-[11px] font-medium text-verified" title="Identidad del cliente"><ShieldCheck className="size-3" />{seleccion.cliente.capasVerificadas == null ? "Identidad sin datos" : `Identidad ${seleccion.cliente.capasVerificadas}/4`}</span><span className="inline-flex max-w-[230px] items-center gap-1 rounded-full sm:max-w-[320px] border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground" title={seleccion.descripcion}><MessageCircle className="size-3 shrink-0" /><span className="truncate">{seleccion.descripcion === "Conversación iniciada desde la Mini Landing" ? "Desde Mini Landing" : `Solicitud: ${seleccion.descripcion}`}</span></span></div><p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"><Calendar className="size-4" />Solicitud del {new Date(seleccion.creadoEn).toLocaleDateString("es-EC")}{seleccion.fechaEstimada && <span className="ml-1">· Fecha estimada: {seleccion.fechaEstimada}</span>}</p></div></div><Badge variant={estadoInfo[seleccion.estado]?.[1] ?? "outline"}>{estadoInfo[seleccion.estado]?.[0] ?? seleccion.estado}</Badge></div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(seleccion.estado === "enviada" || seleccion.estado === "cancelada") && <Button variant="verified" disabled={procesando} onClick={() => cambiarEstado(seleccion.id, "en_conversacion")}><Check className="size-4" />{seleccion.estado === "cancelada" ? "Reabrir conversación" : "Aceptar solicitud"}</Button>}
            {seleccion.estado === "en_conversacion" && <><Button variant="outline" disabled={procesando} onClick={() => cambiarEstado(seleccion.id, "enviada")}><RotateCcw className="size-4" />No puedo atenderla · Pasar a pendientes</Button><Button variant="outline" disabled={procesando} onClick={() => cambiarEstado(seleccion.id, "cancelada")}><Ban className="size-4" />Cerrar conversación</Button></>}
            <Button variant="outline" disabled={procesando} onClick={() => archivar(seleccion.id, !seleccion.archivada)}><Archive className="size-4" />{seleccion.archivada ? "Desarchivar" : "Archivar conversación"}</Button>
          </div>
          <div className="mt-7 border-t border-border pt-5"><h3 className="mb-4 flex items-center gap-2 font-semibold"><MessageCircle className="size-4 text-trust" />Conversación</h3><HiloMensajes key={seleccion.id} solicitudId={seleccion.id} estado={seleccion.estado} avatarNegocioUrl={seleccion.negocioLogoUrl || seleccion.negocioFotoPortadaUrl ? resolverImagenNegocio(seleccion.negocioLogoUrl || seleccion.negocioFotoPortadaUrl) : null} esVistaNegocio respuestasRapidas amplio /></div>
        </>}
      </section>
    </div>
    {perfilAbiertoId && <TarjetaPerfilChat usuarioId={perfilAbiertoId} contexto="cliente" onClose={() => setPerfilAbiertoId(null)} />}
  </div>;
}
