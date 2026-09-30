import { Link } from "react-router-dom";
import { CircleHelp, MessageCircle, ShieldCheck, Star } from "lucide-react";

const preguntas = [
  ["¿Cómo mejora mi Trust Score?", "Completa las cuatro capas de identidad, recibe reseñas de trabajos confirmados, atiende solicitudes hasta que el cliente confirme la entrega y avanza en la ruta de formalización."],
  ["¿Qué significan los sellos?", "La ruta tiene dos niveles: Verificado reúne identidad, publicación, catálogo, primera solicitud, reseña y 50 puntos de Trust Score; Formalizado añade la declaración de registro RIMPE y 80 puntos. El registro ante el SRI aún no se valida automáticamente en esta demostración."],
  ["¿Cómo respondo a un cliente?", "En Mensajes abre una solicitud pendiente. Revisa el nivel de identidad del cliente, acepta o rechaza el contacto y, si aceptas, usa la conversación para acordar el trabajo."],
  ["¿Cuándo puedo responder una reseña?", "Cuando el cliente confirme que recibió el producto o servicio y publique su reseña, aparecerá en Reputación para que respondas públicamente."],
  ["¿CheckBiz cobra por los trabajos?", "No. El pago y la entrega de cada trabajo se acuerdan directamente con el cliente, fuera de la plataforma."],
];

export default function NegocioAyudaPage() {
  return <div className="business-page space-y-6">
    <div className="business-section-banner"><p className="text-sm font-semibold text-trust">Estamos para orientarte</p><h1 className="mt-1 text-3xl font-bold">Ayuda para tu negocio</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Resuelve tus dudas para publicar, atender clientes y fortalecer tu reputación.</p></div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
      <section className="business-surface p-6"><h2 className="mb-5 flex items-center gap-2 text-xl font-bold"><CircleHelp className="size-5 text-trust" />Preguntas frecuentes</h2><div className="space-y-3">{preguntas.map(([pregunta, respuesta]) => <details key={pregunta} className="group rounded-xl border border-border bg-background/50 p-4"><summary className="cursor-pointer font-semibold marker:text-trust">{pregunta}</summary><p className="mt-3 pl-4 text-sm leading-relaxed text-muted-foreground">{respuesta}</p></details>)}</div></section>
      <aside className="space-y-4"><Link to="/negocio/reputacion" className="business-action"><Star className="size-5 text-pending" /><span><strong>Revisar reputación</strong><small>Score y reseñas</small></span></Link><Link to="/negocio/formalizacion" className="business-action"><ShieldCheck className="size-5 text-verified" /><span><strong>Ver mi ruta</strong><small>Pasos de formalización</small></span></Link><Link to="/negocio/solicitudes" className="business-action"><MessageCircle className="size-5 text-trust" /><span><strong>Ir a mensajes</strong><small>Solicitudes de clientes</small></span></Link><div className="business-surface p-5 text-sm"><strong>¿Necesitas ayuda adicional?</strong><p className="mt-2 text-muted-foreground">Escríbenos a <a className="font-semibold text-trust hover:underline" href="mailto:soporte@checkbiz.ec">soporte@checkbiz.ec</a>.</p></div></aside>
    </div>
  </div>;
}
