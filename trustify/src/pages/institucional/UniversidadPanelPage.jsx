import {
  Activity, BadgeCheck, BarChart3, CalendarDays, ChevronDown, CircleHelp,
  Clock3, Info, MessageSquare, ShieldCheck, Star, TrendingUp, UsersRound,
} from "lucide-react";
import "./UniversidadPanelPage.css";

const SERIES = [52, 61, 66, 75, 84, 98, 109, 121, 132, 145, 158, 168];
const RUBROS = [
  ["Diseño y branding", 34], ["Tutorías", 27], ["Desarrollo de software", 22],
  ["Fotografía y video", 19], ["Salud y veterinaria", 16], ["Mantenimiento técnico", 14],
  ["Impresión 3D", 11], ["Limpieza", 9], ["Asesoría legal y contable", 8], ["Otros rubros", 8],
];

function InfoTip({ children }) {
  return <span className="group relative inline-grid size-4 shrink-0 place-items-center rounded-full border border-border text-muted-foreground" tabIndex="0" aria-label={children}>
    <Info className="size-2.5" />
    <span className="pointer-events-none absolute left-5 top-5 z-10 hidden w-56 rounded-lg bg-foreground px-3 py-2 text-left text-[11px] font-normal leading-snug text-background shadow-xl group-hover:block group-focus:block">{children}</span>
  </span>;
}

function FilterBar() {
  return <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2.5">
    {[['Grupo', 'Ambos'], ['Facultad y carrera', 'Todas'], ['Período', 'Trimestre · jul–sep 2026']].map(([label, value]) => (
      <button key={label} type="button" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-trust/50">
        <span className="text-muted-foreground">{label}</span><strong>{value}</strong><ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
    ))}
  </div>;
}

function MetricCard({ icon: Icon, value, label, note, tone = "text-trust" }) {
  return <article className="panel p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3"><span className={`grid size-9 place-items-center rounded-lg bg-trust/10 ${tone}`}><Icon className="size-4.5" /></span><InfoTip>{label} calculado con datos agregados de la comunidad.</InfoTip></div>
    <p className="mt-5 font-display text-3xl font-bold tracking-tight">{value}</p>
    <p className="mt-1 text-sm font-semibold">{label}</p>
    <p className="mt-1 text-xs text-muted-foreground">{note}</p>
  </article>;
}

function LineChart({ compact = false }) {
  const points = SERIES.map((value, index) => `${index * 34 + 8},${150 - value * 0.66}`).join(" ");
  return <div className={compact ? "h-40" : "h-52"}>
    <svg viewBox="0 0 390 180" className="h-full w-full" role="img" aria-label="Evolución de negocios activos durante los últimos doce meses">
      {[35, 75, 115, 150].map((y) => <line key={y} x1="8" x2="382" y1={y} y2={y} stroke="currentColor" className="text-border" strokeWidth="1" />)}
      <polyline points={`${points} 382,150 8,150`} fill="currentColor" className="text-trust/10" stroke="none" />
      <polyline points={points} fill="none" stroke="currentColor" className="text-trust" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="382" cy={150 - SERIES.at(-1) * 0.66} r="5" fill="currentColor" className="text-trust" />
      <text x="372" y="35" textAnchor="end" className="fill-current text-xs font-bold text-foreground">168</text>
      {['oct', 'dic', 'feb', 'abr', 'jun', 'ago', 'sep'].map((month, index) => <text key={month} x={index * 56 + 8} y="173" className="fill-current text-[10px] text-muted-foreground">{month}</text>)}
    </svg>
  </div>;
}

function Panel({ title, icon: Icon, tip, children, className = "" }) {
  return <section className={`panel p-4 sm:p-5 ${className}`}><div className="mb-4 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-display text-sm font-bold sm:text-base"><Icon className="size-4 text-trust" />{title}{tip && <InfoTip>{tip}</InfoTip>}</h2></div>{children}</section>;
}

function Header({ title, description }) {
  return <><div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-xs font-semibold text-muted-foreground">Universidad de Ejemplo</p><h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div><span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-pending/10 px-3 py-1.5 text-[11px] font-semibold text-pending sm:mt-0"><Activity className="size-3.5" /> Datos de ejemplo</span></div><FilterBar /><p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Info className="size-3.5" /> Datos de 214 personas vinculadas con Universidad de Ejemplo. No incluye a quienes no se han vinculado.</p></>;
}

function Summary() {
  return <><Header title="Resumen" description="Una vista rápida de cómo está la comunidad emprendedora de la universidad." /><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={BriefcaseIcon} value="168" label="Negocios activos" note="102 vinculados sin título · 66 egresados" /><MetricCard icon={BadgeCheck} value="37%" label="Formalizados" note="62 de 168, según la última verificación" tone="text-verified" /><MetricCard icon={MessageSquare} value="1.240" label="Solicitudes recibidas" note="En el período" /><MetricCard icon={Star} value="4,6" label="Calificación promedio" note="386 reseñas en el período" /></div><Panel title="Evolución de negocios activos" icon={TrendingUp} tip="Negocios de tu comunidad con perfil publicado y plan vigente."><div className="mb-3 flex items-center justify-between text-xs text-muted-foreground"><span>Últimos 12 meses</span><strong className="rounded-full bg-trust/10 px-2 py-1 text-trust">168 al cierre</strong></div><LineChart /></Panel><div className="grid gap-4 lg:grid-cols-2"><Panel title="Cómo leer este panel" icon={CircleHelp}><p className="text-sm leading-6 text-muted-foreground">Las cifras son agregadas y solo muestran información cuando hay suficientes negocios para proteger la privacidad de la comunidad.</p></Panel><Panel title="Última actualización" icon={CalendarDays}><p className="text-sm leading-6 text-muted-foreground">Datos de ejemplo · trimestre julio–septiembre 2026</p></Panel></div></>;
}

function BriefcaseIcon(props) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></svg>; }

function Community() {
  return <><Header title="Comunidad" description="Cuántos negocios de la comunidad están activos, en qué rubros y de qué generaciones." /><div className="mt-6 grid gap-3 sm:grid-cols-2"><MetricCard icon={BriefcaseIcon} value="168" label="Negocios activos" note="Estado actual · 102 vinculados sin título · 66 egresados" /><MetricCard icon={UsersRound} value="3" label="Generaciones activas" note="Semestres con negocios publicados" /></div><div className="mt-4 grid gap-4 xl:grid-cols-2"><Panel title="Negocios activos" icon={TrendingUp} tip="Negocios de tu comunidad con perfil publicado y plan vigente."><LineChart compact /></Panel><Panel title="Rubros por carrera" icon={BarChart3} tip="En qué categorías ofrecen sus servicios los negocios de cada carrera."><div className="mb-4 flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs"><span className="text-muted-foreground">Carrera</span><strong>Todas las carreras</strong></div><div className="space-y-2.5">{RUBROS.map(([name, value]) => <div key={name} className="grid grid-cols-[minmax(120px,1fr)_2fr_28px] items-center gap-2 text-xs"><span className="truncate">{name}</span><span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-trust" style={{ width: `${value / 34 * 100}%` }} /></span><strong className="text-right">{value}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">“Otros rubros” agrupa las categorías con menos de 5 negocios.</p></Panel></div><Panel title="Negocios por generación" icon={UsersRound} tip="Negocios agrupados según el semestre en que entraron a CheckBiz."><div className="space-y-4">{[['2025-2', 'jul–dic 2025', 52, '48%'], ['2026-1', 'ene–jun 2026', 87, '36%'], ['2026-2', 'en curso', 29, '21%']].map(([period, label, value, rate]) => <div key={period} className="grid gap-2 sm:grid-cols-[130px_1fr_150px] sm:items-center"><div><strong className="text-sm">{period}</strong><span className="block text-xs text-muted-foreground">{label}</span></div><div className="h-3 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-trust" style={{ width: `${value / 100 * 100}%` }} /></div><span className="text-xs font-semibold text-muted-foreground">{value} · {rate} formalizados</span></div>)}</div></Panel></>;
}

function Formalization() {
  return <><Header title="Formalización" description="Cuántos negocios tributan con RUC y cuántos lo obtuvieron mientras estaban en CheckBiz." /><Panel title="Formalizados vs. no formalizados" icon={BadgeCheck} tip="Negocios que tributan con un RUC activo, según la última verificación."><div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div><div className="mb-3 flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-3xl font-bold">168 negocios</p></div><strong className="text-sm text-verified">62 formalizados · 37%</strong></div><div className="flex h-5 overflow-hidden rounded-full bg-muted"><span className="bg-verified" style={{ width: '37%' }} /><span className="bg-muted-foreground/30" style={{ width: '63%' }} /></div><div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground"><span><i className="mr-1 inline-block size-2 rounded-full bg-verified" />Formalizado: asociado a un RUC activo</span><span><i className="mr-1 inline-block size-2 rounded-full bg-muted-foreground/40" />Sin RUC: asociado a la cédula</span></div></div><div className="space-y-3 text-sm"><div className="rounded-lg bg-background p-3"><div className="mb-2 flex justify-between"><strong>Vinculados sin título</strong><span>102</span></div><div className="flex justify-between text-xs text-muted-foreground"><span>30 formalizados · 29%</span><span>72 sin RUC · 71%</span></div></div><div className="rounded-lg bg-background p-3"><div className="mb-2 flex justify-between"><strong>Egresados</strong><span>66</span></div><div className="flex justify-between text-xs text-muted-foreground"><span>32 formalizados · 48%</span><span>34 sin RUC · 52%</span></div></div></div></div></Panel><Panel title="Formalizados en CheckBiz" icon={TrendingUp} tip="Negocios que entraron sin RUC y lo sacaron estando en CheckBiz."><div className="grid gap-6 sm:grid-cols-2"><div><p className="font-display text-3xl font-bold">11</p><p className="mt-1 text-sm font-semibold">negocios se formalizaron estando en CheckBiz</p><p className="mt-1 text-xs text-muted-foreground">En el período</p></div><div><p className="font-display text-3xl font-bold text-trust">5 meses</p><p className="mt-1 text-sm font-semibold">tiempo típico (mediana)</p><p className="mt-1 text-xs text-muted-foreground">Desde el registro hasta obtener el sello</p></div></div></Panel></>;
}

function Demand() {
  return <><Header title="Demanda y reputación" description="Cuántos clientes escriben a los negocios, qué tan rápido contestan y qué opinan de ellos." /><div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><Panel title="Solicitudes recibidas" icon={MessageSquare} tip="Veces que un cliente pidió contactar a uno de estos negocios."><div className="flex items-end justify-between"><div><p className="font-display text-3xl font-bold">1.240</p><p className="text-xs text-muted-foreground">En el período</p></div><span className="rounded-full bg-trust/10 px-2.5 py-1 text-xs font-semibold text-trust">jul–sep 2026</span></div><div className="mt-6 grid grid-cols-7 items-end gap-2" style={{ height: 150 }}>{[['abr', 68], ['may', 79], ['jun', 85], ['jul', 96], ['ago', 100], ['sep', 100], ['oct', 72]].map(([month, height], i) => <div key={month} className="flex h-full flex-col items-center justify-end gap-1"><span className="text-[10px] font-bold">{[288, 331, 356, 402, 418, 420, 310][i]}</span><div className={`w-full rounded-t-md ${i > 3 ? 'bg-trust' : 'bg-trust/25'}`} style={{ height: `${height}%` }} /><span className="text-[10px] text-muted-foreground">{month}</span></div>)}</div></Panel><div className="grid gap-4"><Panel title="Tiempo de respuesta" icon={Clock3} tip="Tiempo típico que tardan los negocios en contestar una solicitud."><p className="font-display text-4xl font-bold">3,4 <span className="text-base font-normal text-muted-foreground">horas</span></p><p className="mt-2 text-xs text-muted-foreground">Mediana entre la llegada y la aceptación o rechazo.</p></Panel><Panel title="Reseñas" icon={Star} tip="Opiniones de clientes verificados que conversaron con el negocio."><div className="flex items-end gap-2"><p className="font-display text-3xl font-bold">4,6</p><span className="mb-1 text-sm text-muted-foreground">de 5 · 386 reseñas</span></div><div className="mt-4 space-y-1.5">{[['5 ★', 280], ['4 ★', 72], ['3 ★', 20], ['2 ★', 8], ['1 ★', 6]].map(([label, value]) => <div key={label} className="grid grid-cols-[32px_1fr_28px] items-center gap-2 text-xs"><span>{label}</span><span className="h-1.5 rounded-full bg-muted"><span className="block h-full rounded-full bg-pending" style={{ width: `${value / 280 * 100}%` }} /></span><strong className="text-right">{value}</strong></div>)}</div></Panel></div></div></>;
}

function Permanence() {
  return <><Header title="Permanencia" description="Si los negocios duran y si siguen atendiendo con el tiempo." /><Panel title="Permanencia por semestre de publicación" icon={Clock3} tip="Negocios que siguen en la plataforma después de 6, 12 y 24 meses."><div className="mb-4 flex items-center gap-2 rounded-lg bg-pending/10 px-3 py-2.5 text-xs text-pending"><Clock3 className="size-4 shrink-0" />Los primeros negocios ya cumplieron 6 meses; los hitos posteriores aún no están disponibles.</div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr><th className="pb-3 pr-4">Semestre</th><th className="pb-3 pr-4">Publicados</th><th className="pb-3 pr-4" colSpan="2">A los 6 meses</th><th className="pb-3 pr-4" colSpan="2">A los 12 meses</th><th className="pb-3" colSpan="2">A los 24 meses</th></tr><tr><th /><th /><th className="pb-2 font-normal">Plataforma</th><th className="pb-2 font-normal">Atienden</th><th className="pb-2 font-normal">Plataforma</th><th className="pb-2 font-normal">Atienden</th><th className="pb-2 font-normal">Plataforma</th><th className="pb-2 font-normal">Atienden</th></tr></thead><tbody>{[['2025-2', '58', '88%', '81%', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible'], ['2026-1', '94', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible'], ['2026-2 · en curso', '32', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible', 'Aún no disponible']].map((row) => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 pr-4 font-semibold">{row[0]}</td>{row.slice(1).map((cell, index) => <td key={`${row[0]}-${index}`} className={`py-3 pr-4 ${cell.includes('Aún') ? 'text-muted-foreground' : 'font-bold text-trust'}`}>{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-4 text-xs text-muted-foreground">“Siguen atendiendo” a los 6 meses, semestre 2025-2: 3 negocios no recibieron solicitudes en ese trimestre y no entran en el cálculo.</p></Panel><div className="grid gap-4 sm:grid-cols-2"><Panel title="Regla de privacidad" icon={ShieldCheck}><p className="text-sm leading-6 text-muted-foreground">Cada cifra se calcula sobre al menos 5 negocios distintos. Si son menos, se muestra “Menos de 5 negocios”.</p></Panel><Panel title="Datos agregados" icon={UsersRound}><p className="text-sm leading-6 text-muted-foreground">Nunca se muestran nombres, listas ni datos de un negocio o persona en particular.</p></Panel></div></>;
}

export default function UniversidadPanelPage({ section = "resumen" }) {
  const content = { resumen: <Summary />, comunidad: <Community />, formalizacion: <Formalization />, demanda: <Demand />, permanencia: <Permanence /> };
  return <div className="universidad-panel mx-auto max-w-6xl space-y-4">{content[section] ?? content.resumen}</div>;
}
