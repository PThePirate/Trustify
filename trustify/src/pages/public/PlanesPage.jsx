import { Link } from "react-router-dom";
import { ArrowRight, Check, Store, Sparkles, GraduationCap, ShieldCheck, MessageCircle } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import "./planes.css";
import UniversityPlans from "@/components/public/UniversityPlans";
import PlansDecoration from "@/components/public/PlansDecoration";

const FEATURES = [
  ["Perfil del negocio, catálogo, precios de referencia, categoría y reseñas", "Incluido", "Incluido"],
  ["Fotos", "30", "50"],
  ["Videos de hasta 45 segundos", "5", "10"],
  ["Sello Verificado · verificación de identidad", "Incluido", "Incluido"],
  ["Sello Formalizado, con RUC", "Opcional", "Opcional"],
  ["Chat con clientes · solicitudes de mensaje", "Incluido", "Incluido"],
  ["Estadísticas", "Básicas: visitas, solicitudes y reseñas del mes", "Completas"],
];
const PLANS = [
  { name:"Básico", price:"10", icon:Store, description:"Presenta tu negocio y conversa con tus clientes.", items:["Perfil con catálogo, categoría y reseñas", "30 fotos y 5 videos de hasta 45 segundos", "Sellos Verificado y Formalizado opcional", "Chat con clientes y estadísticas básicas"] },
  { name:"Plus", price:"20", icon:Sparkles, description:"Más espacio para mostrar tu trabajo y conocer su alcance.", items:["Perfil con catálogo, categoría y reseñas", "50 fotos y 10 videos de hasta 45 segundos", "Sellos Verificado y Formalizado opcional", "Chat con clientes y estadísticas completas"] },
];

export default function PlanesPage() {
  return <div className="plans-page relative min-h-screen overflow-x-hidden">
    <PublicNav />
    <PlansDecoration />
    <main className="container pb-20 pt-32">
      <div className="plans-intro">
        <div className="plans-orbit" aria-hidden="true"><Store /><MessageCircle /><ShieldCheck /></div>
        <span className="plans-kicker"><Store size={16} /> Planes para tu negocio</span>
        <h1>Tu trabajo merece<br />un lugar para crecer.</h1>
        <p>Elige cómo mostrar tu negocio. Ambos planes incluyen tu perfil, catálogo y chat con clientes; Plus te ofrece más fotos, videos y estadísticas.</p>
        <span className="plans-free">Explorar negocios es gratis. No necesitas una cuenta para navegar.</span>
      </div>
      <section className="plans-cards" aria-label="Planes mensuales">
        {PLANS.map(({name,price,icon:Icon,description,items}) => <article key={name} className={`plans-card ${name === "Plus" ? "plans-plus" : ""}`}>
          <div className="plans-card-title"><span><Icon size={25} /></span><h2>{name}</h2></div>
          <p className="plans-description">{description}</p>
          <p className="plans-price"><strong>${price}</strong><span>/ mes</span></p>
          <p className="plans-tax">IVA incluido · renovación mensual</p>
          <ul>{items.map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul>
          <Button variant={name === "Plus" ? "trust" : "outline"} size="lg" asChild className="w-full"><Link to="/registro">Crear mi cuenta <ArrowRight /></Link></Button>
        </article>)}
      </section>
      <p className="plans-payment-note">La activación de planes en esta demostración no realiza cobros ni genera facturas.</p>
      <section className="plans-comparison" aria-labelledby="compare-title">
        <h2 id="compare-title">Compara lo que incluye cada plan</h2>
        <div className="plans-table-scroll"><table><caption className="sr-only">Características de Básico y Plus</caption><thead><tr><th scope="col">Para tu negocio</th><th scope="col">Básico</th><th scope="col">Plus</th></tr></thead><tbody>{FEATURES.map(([feature,basic,plus]) => <tr key={feature}><th scope="row">{feature}</th><td>{basic}</td><td>{plus}</td></tr>)}</tbody></table></div>
        <p className="plans-small">Los sellos se muestran cuando corresponde: contratar un plan no sustituye la revisión de identidad ni acredita por sí solo la formalización.</p>
      </section>
      <UniversityPlans />
      <section className="plans-campus">
        <GraduationCap size={38} aria-hidden="true" /><div><h2>Tu universidad también puede impulsarte</h2><p>Los convenios incluyen cuentas para estudiantes, visibilidad para su comunidad y beneficios para egresados. Conoce las opciones Bronze, Silver y Gold.</p></div><Button variant="outline" asChild><Link to="/universidades">Ver convenios <ArrowRight /></Link></Button>
      </section>
      <section className="plans-faq" aria-labelledby="faq-title"><h2 id="faq-title">Antes de elegir</h2>
        <details><summary>¿Y si tengo dos emprendimientos?</summary><p>El negocio adicional está propuesto a $7 al mes en Básico o $14 al mes en Plus. Su contratación todavía no está habilitada.</p></details>
        <details><summary>¿Hay un descuento para egresados?</summary><p>Para egresados de hasta 5 años de una universidad con convenio se propone un 25% de descuento en Básico durante un año ($7,50 al mes), después de verificar el título. Su activación automática todavía no está disponible.</p></details>
        <details><summary>¿Qué puedo publicar en el catálogo?</summary><p>Productos o servicios, su categoría y precios de referencia. Tu perfil también reúne las reseñas de tus clientes.</p></details>
        <details><summary>¿Necesito pagar para buscar un negocio?</summary><p>No. Explorar el directorio es gratis y puedes hacerlo sin una cuenta. Para conversar con un negocio, crea tu cuenta de cliente.</p></details>
      </section>
    </main><PublicFooter />
  </div>;
}
