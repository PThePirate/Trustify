import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, BadgeCheck, Building2, Calculator, Check, Circle, Loader2, Mail, Receipt, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { obtenerFormalizacion, marcarRimpeRegistrado, simularRimpe } from "@/services/negocioApi";

function SimuladorRimpe() {
  const [ingresos, setIngresos] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  async function calcular(evento) {
    evento.preventDefault(); setCargando(true); setError("");
    try { setResultado(await simularRimpe(Number(ingresos))); }
    catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }
  return <div className="panel p-5">
    <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold"><Calculator className="size-4" /> Simulador RIMPE</h3>
    <p className="mb-4 text-sm text-muted-foreground">Estima tu categoría según tus ingresos anuales. Esta simulación no valida tu registro.</p>
    <form onSubmit={calcular} className="flex flex-wrap gap-2"><label className="min-w-[180px] flex-1"><span className="sr-only">Ingresos anuales estimados</span><input type="number" min="0" step="0.01" value={ingresos} onChange={e => setIngresos(e.target.value)} placeholder="Ingresos anuales estimados ($)" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><Button type="submit" variant="trust" disabled={cargando || !ingresos}>{cargando ? <Loader2 className="size-4 animate-spin" /> : "Calcular"}</Button></form>
    {error && <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>}
    {resultado && <div className="mt-4 rounded-xl bg-muted/30 p-4"><div className="flex items-center gap-2"><Receipt className="size-4 text-trust" /><strong>{resultado.categoria}</strong></div>{resultado.cuotaAnualEstimada != null && <p className="mt-1 text-2xl font-bold text-trust">${Number(resultado.cuotaAnualEstimada).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ año</span></p>}<p className="mt-2 text-sm text-muted-foreground">{resultado.mensaje}</p><p className="mt-2 flex items-start gap-1.5 text-xs text-pending"><ShieldAlert className="size-4 shrink-0" />{resultado.advertencia}</p></div>}
  </div>;
}

const enlaces = {
  "Verificar tu identidad completa (Capas 1 a 4)": ["/negocio/perfil", "Revisar mi identidad"],
  "Publicar tu Mini Landing Page": ["/negocio/editar", "Ir a mi Mini Landing"],
  "Agregar al menos un producto o servicio a tu catálogo": ["/negocio/catalogo", "Ir al catálogo"],
  "Obtener tu primera reseña confirmada": ["/negocio/reputacion", "Ver reputación"],
  "Alcanzar un Trust Score de al menos 50 puntos": ["/negocio/reputacion", "Ver reputación"],
  "Mantener un Trust Score de al menos 80 puntos": ["/negocio/reputacion", "Ver reputación"],
};

export default function FormalizacionPage() {
  const [ruta, setRuta] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  async function cargar() {
    setError(""); setCargando(true);
    try { setRuta(await obtenerFormalizacion()); }
    catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);
  async function cambiarRimpe(completado) {
    setError(""); setGuardando(true);
    try { setRuta(await marcarRimpeRegistrado(completado)); }
    catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  }
  const niveles = ruta?.niveles || [];
  const total = niveles.reduce((s, n) => s + n.requisitos.length, 0);
  const cumplidos = niveles.reduce((s, n) => s + n.requisitos.filter(r => r.completado).length, 0);
  return <div className="business-page space-y-6">
    <header className="business-section-banner p-6 sm:p-8"><span className="text-sm font-semibold text-trust">Identidad y formalización</span><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Ruta de Formalización</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Completa los requisitos de Verificado y Formalizado. El Trust Score sigue sumando identidad, reseñas, solicitudes y formalización hasta 100 puntos.</p></header>
    <section className="business-surface p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-xl font-bold">Tu progreso</h2><p className="mt-1 text-sm text-muted-foreground">{ruta ? `${cumplidos} de ${total} requisitos completados` : "Cargando requisitos…"}</p></div><Button variant="outline" onClick={cargar} disabled={cargando}>{cargando ? <><Loader2 className="size-4 animate-spin" /> Actualizando…</> : "Actualizar progreso"}</Button></div><div className="mt-5 grid grid-cols-2 gap-3">{[{ id: "verificado", nombre: "Verificado", Icon: BadgeCheck }, { id: "formalizado", nombre: "Formalizado", Icon: Building2 }].map(({ id, nombre, Icon }) => { const nivel = niveles.find(n => n.nivel === id); return <div key={id} className={`rounded-2xl border p-4 ${nivel?.completo ? "border-verified/50 bg-verified/10" : "border-border bg-background/50"}`}><Icon className={`size-6 ${nivel?.completo ? "text-verified" : "text-trust"}`} /><strong className="mt-2 block">{nombre}</strong><span className="text-xs text-muted-foreground">{nivel?.completo ? "Requisitos completos" : `${nivel?.requisitos.filter(r => r.completado).length || 0}/${nivel?.requisitos.length || 0} requisitos`}</span></div>; })}</div><div role="progressbar" aria-label="Progreso de formalización" aria-valuenow={cumplidos} aria-valuemin={0} aria-valuemax={total || 8} className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-verified transition-[width]" style={{ width: `${total ? (cumplidos / total) * 100 : 0}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">El registro ante el SRI lo declaras tú; el sistema aún no lo verifica oficialmente.</p></section>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-5">{niveles.map(nivel => <section key={nivel.nivel} className="business-surface p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-display text-lg font-bold">{nivel.nivel === "verificado" ? <BadgeCheck className="size-5 text-verified" /> : <Building2 className="size-5 text-trust" />}{nivel.nivel === "verificado" ? "Verificado" : "Formalizado"}</h2><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{nivel.completo ? "Completo" : "En progreso"}</span></div><ul className="mt-4 space-y-4">{nivel.requisitos.map(requisito => { const enlace = enlaces[requisito.requisito]; return <li key={requisito.requisito} className="flex items-start gap-3 text-sm"><span className="mt-0.5 shrink-0">{requisito.completado ? <Check className="size-4 text-verified" /> : <Circle className="size-4 text-muted-foreground" />}</span><div><span className={requisito.completado ? "text-foreground" : "text-muted-foreground"}>{requisito.requisito}</span>{requisito.manual ? <div className="mt-2 flex flex-wrap items-center gap-2"><Button type="button" variant="outline" size="sm" disabled={guardando} onClick={() => cambiarRimpe(!requisito.completado)}>{guardando ? "Guardando…" : requisito.completado ? "Retirar mi declaración" : "Declarar mi registro"}</Button><span className="text-xs text-muted-foreground">Declaración personal, pendiente de validación oficial</span></div> : !requisito.completado && enlace && <Link to={enlace[0]} className="mt-1 block text-xs font-semibold text-trust underline">{enlace[1]}</Link>}</div></li>; })}</ul></section>)}{!ruta && !error && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando requisitos…</p>}</div><div className="space-y-5"><SimuladorRimpe /><div className="panel p-5"><h3 className="font-display font-bold">¿Necesitas ayuda para formalizarte?</h3><p className="mt-2 text-sm text-muted-foreground">Conecta con el Consultorio Contable Universitario.</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-trust underline" href="mailto:consultorio.contable@checkbiz.ec?subject=Quiero%20asesor%C3%ADa%20para%20formalizarme"><Mail className="size-4" /> Conectar ahora</a></div></div></div>
  </div>;
}
