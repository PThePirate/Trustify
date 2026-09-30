import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BarChart3, Check, CircleHelp,
  FileImage, LayoutTemplate, Loader2, MessageCircle, ShieldCheck,
  Sparkles, Store, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarPlanes, obtenerMiSuscripcion, obtenerMediosPlan, cambiarPlan } from "@/services/negocioApi";
import "./planesPanel.css";

const NAMES = { basico: "Acceso inicial", pro: "Básico", elite: "Plus" };
const OFFERS = [
  { id: "pro", name: "Básico", price: 10, photos: 30, videos: 5, icon: Store, description: "Tu negocio visible, listo para recibir consultas.", badge: "Para empezar" },
  { id: "elite", name: "Plus", price: 20, photos: 50, videos: 10, icon: Sparkles, description: "Más espacio para mostrar y entender tu crecimiento.", badge: "Más posibilidades" },
];
const ROWS = [
  ["Perfil del negocio, catálogo, precios de referencia, categoría y reseñas", "Incluido", "Incluido"],
  ["Fotos", "30", "50"],
  ["Videos de hasta 45 segundos", "5", "10"],
  ["Sello Verificado · verificación de identidad", "Incluido", "Incluido"],
  ["Sello Formalizado, con RUC", "Opcional", "Opcional"],
  ["Chat con clientes · solicitudes de mensaje", "Incluido", "Incluido"],
  ["Estadísticas", "Básicas: visitas, solicitudes y reseñas del mes", "Completas"],
];

function LandingPreview() {
  return (
    <div className="panel-plan-preview" aria-hidden="true">
      <div className="panel-plan-preview-browser"><i /><i /><i /><span>tusitio.checkbiz.ec</span></div>
      <div className="panel-plan-preview-cover"><div className="panel-plan-preview-cover-mark"><Sparkles size={24} /></div></div>
      <div className="panel-plan-preview-body">
        <div className="panel-plan-preview-avatar"><Store size={25} /></div>
        <div className="panel-plan-preview-lines"><b>Tu negocio</b><span>Tu historia merece un espacio propio</span></div>
        <div className="panel-plan-preview-verified"><BadgeCheck size={13} /> Perfil público</div>
        <div className="panel-plan-preview-tile"><FileImage size={19} /><span>Tu trabajo</span></div>
        <div className="panel-plan-preview-tile"><MessageCircle size={19} /><span>Conversaciones</span></div>
        <div className="panel-plan-preview-contact">Contáctame <ArrowRight size={14} /></div>
      </div>
      <div className="panel-plan-preview-float panel-plan-preview-float-one"><ShieldCheck size={17} /> Tu identidad</div>
      <div className="panel-plan-preview-float panel-plan-preview-float-two"><BarChart3 size={17} /> Tus visitas</div>
    </div>
  );
}

export default function PlanesPage({ onActivated, primeraLanding = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function load() {
    setError("");
    Promise.all([listarPlanes(), obtenerMiSuscripcion(), obtenerMediosPlan().catch(() => null)])
      .then(([planes, suscripcion, medios]) => setData({ planes, suscripcion, medios }))
      .catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function activate() {
    if (busy || !selected) return;
    setBusy(true);
    setError("");
    try {
      const suscripcion = await cambiarPlan(selected.id, "mensual");
      setData((d) => ({ ...d, suscripcion }));
      obtenerMediosPlan().then((medios) => setData((d) => ({ ...d, medios }))).catch(() => {});
      setSelected(null);
      setMessage("Plan actualizado en demostración. No se realizó ningún cobro.");
      onActivated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <div className="business-surface p-6">{error ? <><p role="alert" className="text-danger">{error}</p><Button onClick={load}>Reintentar</Button></> : <p className="flex gap-2"><Loader2 className="size-4 animate-spin" />Cargando tu suscripción…</p>}</div>;

  const { planes, suscripcion } = data;
  const current = suscripcion.plan;
  const planActivo = ["pro", "elite"].includes(current.nombre) && suscripcion.estado === "activa" && suscripcion.venceEn && new Date(suscripcion.venceEn) > new Date();

  if (selected) return (
    <div className="panel-plan-confirm business-surface mx-auto max-w-xl p-7">
      <Button variant="ghost" disabled={busy} onClick={() => { setSelected(null); setError(""); }}><ArrowLeft />Volver a los planes</Button>
      <div className="panel-plan-confirm-icon"><selected.icon size={32} /></div>
      <h1 className="mt-5 text-2xl font-bold">Confirmar plan {selected.name}</h1>
      <p className="mt-3 text-3xl font-bold">${selected.price} <span className="text-sm font-normal">/ mes · IVA incluido</span></p>
      <p className="mt-5 text-muted-foreground">Esta activación es una demostración: cambia tu plan, pero no realiza cobros, pagos recurrentes ni emite factura.</p>
      <p className="mt-3 text-sm text-muted-foreground">El límite de fotos y videos se ajustará al plan que elijas.</p>
      {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
      <Button className="mt-6 w-full" disabled={busy} onClick={activate}>{busy ? "Actualizando…" : "Activar en demostración"}</Button>
    </div>
  );

  return (
    <div className="business-page panel-plans-page">
      <section className="panel-plans-hero">
        <div className="panel-plans-hero-copy">
          <span className="panel-plans-kicker"><LayoutTemplate size={16} /> {primeraLanding && !planActivo ? "Tu primera Mini Landing" : "Tu espacio para crecer"}</span>
          <h1>{primeraLanding && !planActivo ? "Tu negocio merece su propio lugar." : "Un plan para la siguiente etapa de tu negocio."}</h1>
          <p>{primeraLanding && !planActivo ? "Elige el plan que quieres usar para crear tu Mini Landing. Podrás contar tu historia, mostrar tu trabajo y recibir consultas desde un perfil público." : "Compara lo que incluye cada plan y elige el espacio que necesita tu negocio."}</p>
          <div className="panel-plans-hero-facts">
            <span><ShieldCheck size={17} /> Una sola cuenta</span>
            <span><LayoutTemplate size={17} /> Página propia</span>
            <span><MessageCircle size={17} /> Contacto directo</span>
          </div>
          <div className="panel-plans-current"><span className="panel-plans-current-dot" /> Tu plan actual: <strong>{NAMES[current.nombre] || current.nombre}</strong>{suscripcion.venceEn && <span> · Hasta el {new Date(suscripcion.venceEn).toLocaleDateString("es-EC")}</span>}</div>
        </div>
        <LandingPreview />
      </section>

      {message && <p role="status" className="panel-plans-message">{message}</p>}

      <div className="panel-plans-heading"><div><h2>Elige cómo empezar</h2><p>Ambos planes permiten crear tu Mini Landing y conectar con clientes.</p></div><span>IVA incluido · mensual</span></div>
      <div className="panel-plans-offers">
        {OFFERS.map((o) => {
          const api = planes.find((p) => p.nombre === o.id);
          const aligned = api && Number(api.precioMensual) === o.price;
          const actual = current.nombre === o.id && planActivo;
          const Icon = o.icon;
          return (
            <article className={`panel-plan-offer ${o.id === "elite" ? "panel-plan-offer-plus" : ""}`} key={o.id}>
              <div className="panel-plan-offer-art" aria-hidden="true"><div className="panel-plan-offer-rings" /><Icon size={45} strokeWidth={1.5} /></div>
              <div className="panel-plan-offer-content">
                <span className="panel-plan-offer-badge">{o.badge}</span>
                <h3>{o.name}</h3>
                <p className="panel-plan-offer-description">{o.description}</p>
                <div className="panel-plan-offer-price"><strong>${o.price}</strong><span>/ mes</span></div>
                <ul>
                  <li><Check size={17} /> Perfil, catálogo, categoría y reseñas</li>
                  <li><FileImage size={17} /> {o.photos} fotos para mostrar tu trabajo</li>
                  <li><Video size={17} /> {o.videos} videos de hasta 45 segundos</li>
                  <li><ShieldCheck size={17} /> Sello Verificado y Formalizado opcional</li>
                  <li><MessageCircle size={17} /> Chat y solicitudes de clientes</li>
                  <li><BarChart3 size={17} /> Estadísticas {o.id === "elite" ? "completas" : "básicas"}</li>
                </ul>
                <Button variant={actual ? "outline" : "trust"} disabled={actual || !aligned} onClick={() => { setSelected(o); setError(""); }}>
                  {actual ? "Tu plan actual" : primeraLanding ? `Elegir ${o.name}` : "Ver cambio de plan"}{!actual && <ArrowRight size={17} />}
                </Button>
                {!aligned && <p className="panel-plan-offer-warning">El servidor debe actualizar esta tarifa antes de permitir el cambio.</p>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="panel-plans-note"><CircleHelp size={19} /><p>La activación actual es una demostración: no se realiza ningún cobro. El editor aplica el límite de fotos y videos de tu plan activo.</p></div>
      {data.medios && <p className="panel-plans-capacity">Medios publicados: {data.medios.fotosUsadas}/{data.medios.fotosPermitidas} fotos · {data.medios.videosUsados}/{data.medios.videosPermitidos} videos.</p>}

      <section className="panel-plans-detail business-surface">
        <div className="panel-plans-detail-heading"><div><h2>Compara los detalles</h2><p>Lo que tendrás disponible al publicar tu negocio.</p></div><BadgeCheck size={30} /></div>
        <div className="plans-table-scroll"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr><th className="p-4">Beneficio</th><th className="p-4">Básico</th><th className="p-4">Plus</th></tr></thead><tbody>{ROWS.map(([name, basic, plus]) => <tr className="border-t border-border" key={name}><th scope="row" className="p-4 font-medium">{name}</th><td className="p-4">{basic}</td><td className="p-4">{plus}</td></tr>)}</tbody></table></div>
        <p className="mt-4 text-sm text-muted-foreground">Un plan no aprueba automáticamente tu identidad ni formaliza tu negocio.</p>
      </section>

      <section className="panel-plans-extras">
        <div><Store size={23} /><h3>¿Tienes otro emprendimiento?</h3><p>Negocio adicional: $7 al mes en Básico o $14 al mes en Plus. Su contratación aún no está habilitada en este panel.</p></div>
        <div><Sparkles size={23} /><h3>Beneficio para egresados</h3><p>Egresados de hasta 5 años de una universidad con convenio: 25% de descuento en Básico durante 1 año ($7,50 al mes), después de verificar el título. El descuento automático aún no está habilitado.</p></div>
        <div><ShieldCheck size={23} /><h3>Renovación y facturación</h3><p>La oferta contempla pagos en la web, renovación mensual y un correo antes de cada cobro. La demostración no procesa pagos recurrentes ni emite facturas.</p></div>
      </section>
      <Link to="/planes" className="panel-plans-public-link">Consultar todos los planes y convenios <ArrowRight size={16} /></Link>
      {current.limiteCatalogo != null && <p className="panel-plans-capacity">Catálogo actual: {suscripcion.totalCatalogoUsado} ítems usados · Capacidad habilitada: {current.limiteCatalogo >= 32767 ? "sin límite práctico" : current.limiteCatalogo}.</p>}
    </div>
  );
}
