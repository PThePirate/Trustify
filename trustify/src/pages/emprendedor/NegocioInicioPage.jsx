import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bell, CheckCircle2, Copy, Eye, MessageCircle, QrCode, Rocket, ShieldCheck, Sparkles, Star, Store, TrendingUp } from "lucide-react";
import { obtenerMiNegocio, obtenerMiAnalitica, misSolicitudesRecibidas, listarMisResenas } from "@/services/negocioApi";


export default function NegocioInicioPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    Promise.allSettled([obtenerMiNegocio(), obtenerMiAnalitica(), misSolicitudesRecibidas(), listarMisResenas()])
      .then(([negocio, analitica, solicitudes, resenas]) => {
        if (negocio.status === "rejected" && negocio.reason?.codigo !== "SIN_NEGOCIO") setError(negocio.reason?.message || "No se pudo cargar el negocio");
        setDatos({
          negocio: negocio.status === "fulfilled" ? negocio.value : null,
          analitica: analitica.status === "fulfilled" ? analitica.value : null,
          solicitudes: solicitudes.status === "fulfilled" ? solicitudes.value : null,
          resenas: resenas.status === "fulfilled" ? resenas.value : null,
        });
      });
  }, []);

  async function copiar() {
    if (!datos?.negocio) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/negocio/publico/${datos.negocio.slug}`);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch { setError("No se pudo copiar el enlace. Ábrelo desde Mi Mini Landing."); }
  }

  if (!datos) return <p className="text-muted-foreground">Cargando tu espacio de negocio…</p>;
  const { negocio, analitica, solicitudes, resenas } = datos;
  const pendientes = solicitudes?.filter((item) => item.estado === "enviada").length;
  const sinResponder = resenas?.filter((item) => !item.respuestaNegocio).length;
  const visitasMes = analitica?.comparativaMensual?.periodoActual;
  const kpis = [
    { label: "Trust Score", value: negocio ? `${negocio.trustScore}/100` : "—", icon: Star, tone: "trust", detail: "Tu señal de confianza" },
    { label: "Visitas este mes", value: visitasMes ?? "—", icon: Eye, tone: "verified", detail: analitica ? "A tu perfil público" : "Sin datos disponibles" },
    { label: "Por responder", value: pendientes ?? "—", icon: MessageCircle, tone: "action", detail: "Solicitudes nuevas" },
    { label: "Sello Verificado", value: negocio?.insignias?.some(i => i.nombre === "Emprendedor Verificado") ? "Otorgado" : "Pendiente", icon: ShieldCheck, tone: "pending", detail: "Identidad del negocio" },
  ];

  return <div className="business-page space-y-7">
    <section className="business-hero relative overflow-hidden rounded-[2rem] p-7 text-white sm:p-10">
      <div className="relative z-10 max-w-2xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold"><Store className="size-4" /> Tu espacio para crecer</span>
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{negocio ? `Hoy impulsa a ${negocio.nombreComercial}` : "Tu negocio empieza aquí"}</h1>
        <p className="mt-4 max-w-xl text-white/80">{negocio ? "Tu presencia, conversaciones y reputación en un solo lugar." : "Crea tu Mini Landing, publícala y empieza a conectar con clientes verificados."}</p>
        <Link to="/negocio/editar" className="business-hero-cta mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#183247]">{negocio ? "Editar mi Mini Landing" : "Crear mi Mini Landing"}<ArrowUpRight className="size-4" /></Link>
      </div>
      <div className="business-hero-orbit" aria-hidden="true"><Store className="size-24 opacity-40" /></div>
      <div className="business-hero-spark business-hero-spark-one" aria-hidden="true"><Sparkles className="size-5" /></div>
      <div className="business-hero-spark business-hero-spark-two" aria-hidden="true"><Star className="size-5" /></div>
      <div className="business-hero-float" aria-hidden="true"><ShieldCheck className="size-5" /><span>Confianza que se ve</span></div>
    </section>
    <div className="business-motion-strip" aria-label="Publica tu trabajo, conecta con clientes y fortalece tu reputación"><div className="business-motion-track" aria-hidden="true">{Array.from({ length: 2 }, (_, i) => <span key={i}>✦ Publica lo que haces <b>✦</b> Conecta con personas reales <b>✦</b> Construye reputación <b>✦</b> Haz crecer tu negocio</span>)}</div></div>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    <section aria-label="Indicadores del negocio" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, tone, detail }) => <div key={label} className={`business-kpi business-kpi-${tone}`}>
        <div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">{label}</span><Icon className="size-5 text-trust" /></div>
        <p className="mt-5 font-display text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>)}
    </section>
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <section className="business-surface p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-3"><span className="business-icon"><TrendingUp className="size-5" /></span><div><h2 className="text-xl font-bold">Acciones para hoy</h2><p className="text-sm text-muted-foreground">Llega rápido a lo que mueve tu negocio.</p></div></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={copiar} disabled={!negocio} className="business-action"><Copy className="size-5 text-trust" /><span><strong>{copiado ? "Enlace copiado" : "Copiar enlace público"}</strong><small>Comparte tu Mini Landing</small></span><ArrowUpRight className="ml-auto size-4" /></button>
          <Link to="/negocio/qr" className="business-action"><QrCode className="size-5 text-verified" /><span><strong>Compartir QR</strong><small>Para tu local o redes</small></span><ArrowUpRight className="ml-auto size-4" /></Link>
          <Link to="/negocio/solicitudes" className="business-action"><MessageCircle className="size-5 text-action" /><span><strong>Responder clientes</strong><small>{pendientes ?? 0} solicitudes pendientes</small></span><ArrowUpRight className="ml-auto size-4" /></Link>
          <Link to="/negocio/catalogo" className="business-action"><Store className="size-5 text-pending" /><span><strong>Actualizar catálogo</strong><small>Productos y servicios</small></span><ArrowUpRight className="ml-auto size-4" /></Link>
        </div>
      </section>
      <section className="business-surface p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-3"><span className="business-icon"><Bell className="size-5" /></span><div><h2 className="text-xl font-bold">Tu siguiente oportunidad</h2><p className="text-sm text-muted-foreground">Señales basadas en tu actividad.</p></div></div>
        <div className="space-y-3">
          {sinResponder > 0 && <Link className="business-alert" to="/negocio/reputacion"><Star className="size-5 text-pending" /><span>Tienes {sinResponder} {sinResponder === 1 ? "reseña" : "reseñas"} por responder.</span><ArrowUpRight className="ml-auto size-4" /></Link>}
          {pendientes > 0 && <Link className="business-alert" to="/negocio/solicitudes"><MessageCircle className="size-5 text-action" /><span>{pendientes} {pendientes === 1 ? "cliente espera" : "clientes esperan"} tu respuesta.</span><ArrowUpRight className="ml-auto size-4" /></Link>}
          {negocio && <Link className="business-alert" to="/negocio/formalizacion"><ShieldCheck className="size-5 text-verified" /><span>Consulta el estado de tus sellos.</span><ArrowUpRight className="ml-auto size-4" /></Link>}
          {!negocio && <Link className="business-alert" to="/negocio/editar"><Store className="size-5 text-trust" /><span>Completa tu perfil para aparecer en el catálogo.</span><ArrowUpRight className="ml-auto size-4" /></Link>}
          {negocio && !sinResponder && !pendientes && <p className="rounded-xl bg-verified/10 p-4 text-sm text-verified">Todo al día. Tu perfil está listo para recibir clientes.</p>}
        </div>
      </section>
    </div>
    <section className="business-surface business-journey p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-trust">Tu recorrido emprendedor</p><h2 className="mt-1 text-2xl font-bold">Cada paso abre una puerta</h2></div><span className="rounded-full bg-verified/10 px-3 py-1.5 text-xs font-semibold text-verified">{[Boolean(negocio), negocio?.estadoPublicacion === "publicado", (solicitudes?.length ?? 0) > 0].filter(Boolean).length} de 3 pasos</span></div>
      <div className="business-journey-line mt-6 grid gap-4 md:grid-cols-3">
        {[
          { icon: Store, title: "Crea tu vitrina", detail: "Prepara tu Mini Landing", done: Boolean(negocio), to: "/negocio/editar" },
          { icon: Rocket, title: "Sal al mundo", detail: "Publica tu perfil", done: negocio?.estadoPublicacion === "publicado", to: "/negocio/editar" },
          { icon: MessageCircle, title: "Inicia conexiones", detail: "Conversa con tus clientes", done: (solicitudes?.length ?? 0) > 0, to: "/negocio/solicitudes" },
        ].map(({ icon: Icon, title, detail, done, to }, index) => <Link to={to} key={title} className="business-journey-step group"><span className={`business-journey-symbol ${done ? "business-journey-done" : ""}`}>{done ? <CheckCircle2 className="size-6" /> : <Icon className="size-6" />}</span><span className="flex-1"><small>Paso {index + 1}</small><strong>{title}</strong><em>{detail}</em></span><ArrowUpRight className="size-4 text-trust transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>)}
      </div>
    </section>
  </div>;
}
