import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BellRing, CalendarDays, CheckCircle2, Clock3, FileText, Trash2 } from "lucide-react";
import ClienteSection from "@/components/cliente/ClienteSection";
import { misSolicitudes } from "@/services/solicitudApi";
import { actualizarEspacio, leerEspacio, suscribirEspacio } from "@/services/clienteEspacioLocal";

const fecha = valor => new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(`${valor}T12:00:00`));
const hoyLocal = () => { const ahora = new Date(); return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0,10); };

export default function RecordatoriosPage() {
  const [espacio, setEspacio] = useState(leerEspacio);
  const [solicitudes, setSolicitudes] = useState(null);
  const [error, setError] = useState("");
  const [titulo, setTitulo] = useState("");
  const [fechaAviso, setFechaAviso] = useState("");
  const [solicitudId, setSolicitudId] = useState("");
  useEffect(() => suscribirEspacio(() => setEspacio(leerEspacio())), []);
  useEffect(() => { misSolicitudes().then(setSolicitudes).catch(e => setError(e.message)); }, []);
  const activas = (solicitudes || []).filter(s => !["confirmada", "cancelada"].includes(s.estado));
  const hoy = hoyLocal();
  const ordenados = [...espacio.recordatorios].sort((a,b) => a.fecha.localeCompare(b.fecha));
  function crear(e) { e.preventDefault(); if (!titulo.trim() || !fechaAviso) return; actualizarEspacio(actual => ({ ...actual, recordatorios: [...actual.recordatorios, { id: crypto.randomUUID(), titulo: titulo.trim().slice(0,100), fecha: fechaAviso, solicitudId: solicitudId || null, completado: false }] })); setTitulo(""); setFechaAviso(""); setSolicitudId(""); }
  function editar(id, cambios) { actualizarEspacio(actual => ({ ...actual, recordatorios: actual.recordatorios.map(r => r.id === id ? { ...r, ...cambios } : r) })); }
  function borrar(id) { actualizarEspacio(actual => ({ ...actual, recordatorios: actual.recordatorios.filter(r => r.id !== id) })); }
  function evaluar(id) { actualizarEspacio(actual => ({ ...actual, cotizaciones: actual.cotizaciones.includes(id) ? actual.cotizaciones.filter(x => x !== id) : [...actual.cotizaciones, id] })); }
  return <ClienteSection icon={CalendarDays} eyebrow="Tu agenda" title="Recordatorios y cotizaciones" description="Organiza próximos servicios y señala las solicitudes que estás evaluando." action={{ to: "/mis-solicitudes", label: "Ver mensajes" }}>
    <div className="client-extra-note"><BellRing className="size-5" /><p>Estos avisos aparecen al entrar en esta sección. Se guardan en este navegador por cuenta; todavía no envían correos ni notificaciones fuera de la plataforma.</p></div>
    <div className="client-extra-split"><section className="client-extra-panel"><h2 className="font-display text-lg font-bold">Nuevo recordatorio</h2><form onSubmit={crear} className="mt-4 space-y-3"><label className="block text-sm font-semibold">¿Qué quieres recordar?<input className="client-extra-input mt-1 w-full" value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={100} required placeholder="Mantenimiento de mi laptop" /></label><label className="block text-sm font-semibold">Fecha<input className="client-extra-input mt-1 w-full" type="date" value={fechaAviso} min={hoy} onChange={e => setFechaAviso(e.target.value)} required /></label><label className="block text-sm font-semibold">Solicitud relacionada (opcional)<select className="client-extra-input mt-1 w-full" value={solicitudId} onChange={e => setSolicitudId(e.target.value)}><option value="">Ninguna</option>{(solicitudes || []).map(s => <option key={s.id} value={s.id}>{s.negocio.nombreComercial}</option>)}</select></label><button type="submit" className="client-extra-button">Guardar recordatorio</button></form></section><section className="client-extra-panel"><h2 className="font-display text-lg font-bold">Próximos avisos</h2>{ordenados.length === 0 ? <div className="client-extra-empty"><Clock3 className="size-8 text-trust" /><strong>Tu agenda está libre</strong><p>Agrega un servicio recurrente para tenerlo presente.</p></div> : <div className="mt-4 space-y-3">{ordenados.map(r => { const vence = !r.completado && r.fecha <= hoy; return <article key={r.id} className={`client-reminder ${vence ? "is-due" : ""}`}><button onClick={() => editar(r.id, { completado: !r.completado })} aria-label={r.completado ? "Marcar como pendiente" : "Marcar como hecho"} className="client-icon-button">{r.completado ? <CheckCircle2 className="size-5 text-verified" /> : <Clock3 className="size-5" />}</button><div className="min-w-0 flex-1"><strong className={r.completado ? "line-through opacity-60" : ""}>{r.titulo}</strong><p className="text-xs text-muted-foreground">{fecha(r.fecha)} {vence ? "· Es momento de revisarlo" : ""}</p>{r.solicitudId && <Link to="/mis-solicitudes" className="text-xs font-semibold text-trust">Ver solicitud</Link>}</div><button onClick={() => borrar(r.id)} className="client-icon-button" aria-label={`Eliminar ${r.titulo}`}><Trash2 className="size-4" /></button></article>; })}</div>}</section></div>
    <section className="client-extra-panel mt-5"><div className="flex items-center gap-2"><FileText className="size-5 text-trust" /><h2 className="font-display text-lg font-bold">Cotizaciones en evaluación</h2></div><p className="mt-1 text-sm text-muted-foreground">Marca las solicitudes activas que quieres comparar antes de decidir.</p>{error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}{solicitudes && (activas.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{activas.map(s => <button key={s.id} onClick={() => evaluar(s.id)} aria-pressed={espacio.cotizaciones.includes(s.id)} className={`client-quote ${espacio.cotizaciones.includes(s.id) ? "is-selected" : ""}`}><strong>{s.negocio.nombreComercial}</strong><span>{s.estado.replaceAll("_", " ")}</span><small>{espacio.cotizaciones.includes(s.id) ? "En evaluación ✓" : "Marcar para evaluar"}</small></button>)}</div> : <div className="client-extra-empty"><FileText className="size-8 text-trust" /><strong>No tienes solicitudes activas</strong><p>Cuando contactes a un negocio, podrás organizar aquí las propuestas.</p></div>)}</section>
  </ClienteSection>;
}
