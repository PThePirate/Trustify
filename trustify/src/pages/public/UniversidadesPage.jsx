import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Check, Clock3, Info, Link2, Lock, Mail, MessageSquare, Search, Tag, Users } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const INDICATORS = [
  { icon: Users, title: "Comunidad emprendedora", description: "Cuántos estudiantes y egresados tienen un negocio activo, y en qué rubros emprende cada carrera." },
  { icon: Check, title: "Formalización", description: "Qué parte de esos negocios tiene RUC o RIMPE activo, según la última consulta al SRI." },
  { icon: MessageSquare, title: "Demanda y reputación", description: "Cuántas solicitudes de contacto reciben, cuántas responden y cómo los califican sus clientes." },
  { icon: Clock3, title: "Permanencia", description: "Cuántos negocios siguen activos a los 6, 12 y 24 meses de haberse registrado." },
];

const STEPS = [
  { title: "Se registra en CheckBiz", description: "Crea su cuenta y verifica su identidad con su cédula y una comparación facial." },
  { title: "Confirma su vínculo", description: "Verifica su correo institucional o su título registrado en SENESCYT e indica su facultad y carrera." },
  { title: "Suma a tu panel", description: "Sus datos se incorporan a los indicadores de tu universidad, siempre agregados y nunca como ficha individual." },
];

const DASHBOARD_KPIS = [
  ["Negocios activos", "138", "64 sin título · 74 egresados"],
  ["Formalizados", "41%", "57 con RUC o RIMPE activo"],
  ["Solicitudes recibidas", "1.264", "87% respondidas"],
  ["Calificación promedio", "4,6", "de 5 · 318 reseñas"],
];

const BUSINESS_CATEGORIES = [
  ["Diseño y comunicación", 34], ["Tecnología y software", 27], ["Salud y bienestar", 22],
  ["Tutorías y educación", 19], ["Mantenimiento técnico", 15], ["Fotografía y audiovisual", 14],
  ["Otros (cortes pequeños agrupados)", 7],
];

function SectionHeading({ icon: Icon, title, children }) {
  return <div className="mb-7"><div className="mb-3 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-trust/10 text-trust"><Icon className="size-5" /></span><h2 className="text-2xl font-bold sm:text-3xl">{title}</h2></div><p className="max-w-3xl text-muted-foreground">{children}</p></div>;
}

function IndicatorCard({ icon: Icon, title, description }) {
  return <Card className="h-full p-6 transition-transform duration-300 hover:-translate-y-1"><span className="mb-5 grid size-11 place-items-center rounded-xl bg-trust/10 text-trust"><Icon className="size-5" /></span><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Card>;
}

function KpiCard({ label, value, note }) {
  return <div className="university-preview__kpi"><p>{label}</p><strong>{value}</strong><small>{note}</small></div>;
}

function DashboardPreview() {
  return <Card className="university-preview mt-8" aria-label="Vista previa del panel institucional con datos de ejemplo">
    <header className="university-preview__header"><div><p>Panel institucional</p><h3>Universidad Ejemplo</h3></div><div className="university-preview__filters"><span>Grupo: <b>Ambos</b></span><span>Carrera: <b>Todas</b></span><span>Período: <b>Últimos 6 meses</b></span></div></header>
    <div className="university-preview__body"><p className="university-preview__coverage">Basado en <b>151 personas vinculadas</b> a tu universidad · 138 con negocio activo</p><div className="university-preview__kpis">{DASHBOARD_KPIS.map(([label, value, note]) => <KpiCard key={label} label={label} value={value} note={note} />)}</div>
      <div className="university-preview__reports"><ReportCard title="Negocios por rubro"><ul className="university-preview__bars">{BUSINESS_CATEGORIES.map(([label, value]) => <li key={label}><span>{label}</span><i><em style={{ "--bar-width": `${value / 34 * 100}%` }} /></i><b>{value}</b></li>)}</ul></ReportCard><ReportCard title="Formalización por grupo"><ProgressRow label="Vinculados sin título" value="18 de 64 · 28%" width="28%" /><ProgressRow label="Egresados" value="39 de 74 · 53%" width="53%" /><div className="university-preview__legend"><span>RUC o RIMPE activo</span><span>Sin RUC</span></div></ReportCard><ReportCard title="Siguen activos"><div className="university-preview__active"><span>A 6 meses</span><b>86%</b></div><p>A 12 meses <small>Disponible al cumplir 12 meses</small></p><p>A 24 meses <small>Disponible al cumplir 24 meses</small></p></ReportCard></div><p className="university-preview__footnote">Cifras ilustrativas: la plataforma todavía no tiene usuarios reales. El estado de formalización corresponde a la última consulta al SRI.</p>
    </div>
  </Card>;
}

function ReportCard({ title, children }) { return <div className="university-preview__report"><h4>{title}</h4>{children}</div>; }
function ProgressRow({ label, value, width }) { return <div className="university-preview__progress"><div><span>{label}</span><b>{value}</b></div><i><em style={{ "--bar-width": width }} /></i></div>; }

export default function UniversidadesPage() {
  return <div className="relative min-h-screen overflow-x-hidden"><PublicNav /><main className="container pb-16 pt-32">
    <Reveal className="mx-auto max-w-3xl text-center"><span className="mb-4 inline-flex rounded-full bg-trust/10 px-3 py-1 text-sm font-medium text-trust">Panel institucional</span><h1 className="text-4xl font-bold sm:text-5xl">Tu comunidad emprendedora, con datos verificados</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Conoce cuántos de tus estudiantes y egresados tienen un negocio, cómo avanzan hacia la formalización y cómo los valoran sus clientes. Solo cifras agregadas, sin exponer a nadie en particular.</p></Reveal>
    <section className="mt-20"><Reveal><SectionHeading icon={BarChart3} title="Qué vas a poder ver">Indicadores construidos con lo que CheckBiz verifica: identidad, estado tributario en el SRI, solicitudes de contacto y reseñas de clientes verificados.</SectionHeading></Reveal><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{INDICATORS.map((indicator) => <Reveal key={indicator.title}><IndicatorCard {...indicator} /></Reveal>)}</div><Reveal><DashboardPreview /></Reveal></section>
    <section className="mt-20"><Reveal><SectionHeading icon={Link2} title="Cómo se vincula tu comunidad">Tu universidad no tiene que aprobar vínculos ni cargar listas: cada estudiante o egresado confirma el suyo.</SectionHeading></Reveal><ol className="grid gap-5 md:grid-cols-3">{STEPS.map((step, index) => <Reveal key={step.title}><Card className="h-full p-6"><span className="mb-5 grid size-9 place-items-center rounded-full bg-trust text-sm font-bold text-primary-foreground">{index + 1}</span><h3 className="text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p></Card></Reveal>)}</ol><p className="mt-6 flex items-start gap-2 rounded-xl border border-trust/20 bg-trust/5 p-4 text-sm text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0 text-trust" />Tu panel refleja a quienes se vinculan con tu universidad. Mientras más se vinculen, más completa es la foto.</p></section>
    <section className="mt-20"><div className="grid gap-5 md:grid-cols-2"><Reveal><IndicatorCard icon={Tag} title="Un beneficio para tus estudiantes" description="Con el convenio activo, tus estudiantes y egresados tienen un descuento en el plan de emprendedores durante 4 años desde que verifican su vínculo. Es un beneficio que tu universidad puede anunciar." /></Reveal><Reveal><IndicatorCard icon={Search} title="Tu universidad, visible en el directorio" description="Los clientes pueden buscar negocios por universidad de origen, así tu comunidad emprendedora se reconoce como parte de tu institución." /></Reveal></div></section>
    <section className="mt-20"><Reveal><Card className="overflow-hidden p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-verified/10 text-verified"><Lock className="size-5" /></span><h2 className="text-2xl font-bold">Diseñado para proteger datos personales</h2></div><div className="grid gap-6 md:grid-cols-3">{[["Solo cifras agregadas", "Nunca verás la ficha de una persona o de un negocio en particular."], ["Sin ingresos ni ventas", "CheckBiz no procesa pagos, así que no conoce ni muestra esos datos."], ["Grupos pequeños protegidos", "Si un corte tiene muy pocos negocios, sus cifras se agrupan o se ocultan."]].map(([title, text]) => <div key={title}><b className="block">{title}</b><span className="mt-1 block text-sm text-muted-foreground">{text}</span></div>)}</div></Card></Reveal></section>
    <Reveal><Card glow className="mt-20 p-8 text-center sm:p-12"><h2 className="text-2xl font-bold sm:text-3xl">¿Tu universidad ya tiene convenio?</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">Cada universidad recibe credenciales propias, sin acceso a datos de otras instituciones. El licenciamiento se ajusta al tamaño de tu institución.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button variant="trust" size="lg" asChild><Link to="/institucional/login">Ingresar al panel <ArrowRight /></Link></Button><Button variant="outline" size="lg" asChild><a href="mailto:hola@checkbiz.ec?subject=Acceso%20institucional%20CheckBiz"><Mail /> Solicitar acceso</a></Button></div></Card></Reveal>
  </main><PublicFooter /></div>;
}
