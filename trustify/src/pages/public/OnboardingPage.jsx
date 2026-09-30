import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShieldCheck, Search, FileCheck2, ArrowRight, ArrowLeft, Check, Store, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

const PASOS = [
  { icon: ShieldCheck, etiqueta: "Conoce a quién contratas", titulo: "La confianza empieza con una identidad.", texto: "Revisa las verificaciones de cada negocio antes de contactar. Así sabes quién está detrás del servicio que necesitas.", consejo: "Una identidad verificada es un punto de partida. Revisa también el perfil y las reseñas.", tono: "trust", detalles: ["Identidad del emprendedor", "Verificaciones visibles", "Reseñas de solicitudes confirmadas"] },
  { icon: Search, etiqueta: "Encuentra tu próximo servicio", titulo: "Busca con intención. Elige con criterio.", texto: "Explora categorías, filtra por ciudad y consulta el perfil de cada negocio. Compara sus servicios, reputación y nivel de formalización.", consejo: "Consulta qué incluye el servicio, los plazos y el precio antes de acordar una compra.", tono: "verified", detalles: ["Explora una categoría", "Consulta el perfil del negocio", "Elige a quién contactar"] },
  { icon: FileCheck2, etiqueta: "De la solicitud a la reseña", titulo: "Todo empieza con una conversación.", texto: "Envía tu solicitud y coordina con el negocio. Cuando recibas el producto o servicio, confirma la entrega y comparte tu experiencia.", consejo: "El pago y la entrega se acuerdan directamente con el negocio, fuera de CheckBiz.", tono: "action", detalles: ["Envía una solicitud", "Coordina con el negocio", "Confirma y deja tu reseña"] },
];
const TONOS = { trust: "text-trust bg-trust/10", verified: "text-verified bg-verified/10", action: "text-action bg-action/10" };

export default function OnboardingPage() {
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();
  const reducir = useReducedMotion();
  const actual = PASOS[paso];
  const Icon = actual.icon;
  return (
    <div className="onboarding-ui min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2"><ThemeToggle /><Button variant="ghost" size="sm" onClick={() => navigate('/panel')}>Saltar</Button></div>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8 lg:pt-12">
        <nav aria-label="Pasos de bienvenida" className="mb-8 grid grid-cols-3 gap-2 sm:gap-5">
          {PASOS.map((p, i) => <button key={p.tono} onClick={() => setPaso(i)} aria-current={i === paso ? 'step' : undefined} className="onboarding-step text-left"><span className="mb-3 block h-1 rounded-full bg-border"><span className={`block h-full rounded-full transition-all duration-300 ${i <= paso ? 'w-full bg-trust' : 'w-0'}`} /></span><span className="flex items-center gap-2 text-xs sm:text-sm"><span className={`grid size-6 shrink-0 place-items-center rounded-full ${i === paso ? 'bg-trust text-[hsl(var(--primary-ink))]' : 'bg-muted text-muted-foreground'}`}>{i < paso ? <Check className="size-3.5" /> : i + 1}</span><span className="hidden sm:inline">{p.etiqueta}</span><span className="sm:hidden">Paso {i + 1}</span></span></button>)}
        </nav>
        <AnimatePresence mode="wait" initial={false}>
          <motion.section key={paso} initial={{ opacity: 0, x: reducir ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducir ? 0 : -16 }} transition={{ duration: reducir ? 0 : .2 }} className="grid items-center gap-8 lg:min-h-[460px] lg:grid-cols-2 lg:gap-16">
            <div>
              <span className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${TONOS[actual.tono]}`}><Icon className="size-4" />{actual.etiqueta}</span>
              <h1 className="max-w-xl text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-5xl">{actual.titulo}</h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{actual.texto}</p>
              <p className="mt-6 max-w-lg border-l-2 border-action pl-4 text-sm leading-relaxed text-muted-foreground">{actual.consejo}</p>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-trust/20 bg-trust/5 p-6 sm:p-10">
              <div className="mb-7 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-trust">{paso === 0 ? 'Una decisión informada' : paso === 1 ? 'Tu búsqueda, paso a paso' : 'Así funciona tu solicitud'}</span><Icon className="size-7 shrink-0 text-trust" /></div>
              <div className="relative rounded-2xl border border-border bg-card p-5 shadow-lg shadow-trust/5 sm:p-7">
                <div className={`mb-6 inline-grid size-16 place-items-center rounded-2xl ${TONOS[actual.tono]}`}>{paso === 0 ? <Store className="size-8" /> : paso === 1 ? <Search className="size-8" /> : <MessageCircle className="size-8" />}</div>
                <ol className="space-y-5">{actual.detalles.map((detalle, i) => <li key={detalle} className="flex items-center gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full ${TONOS[actual.tono]}`}>{paso === 0 ? <ShieldCheck className="size-4" /> : paso === 2 && i === 2 ? <Star className="size-4" /> : <span className="text-sm font-bold">{i + 1}</span>}</span><span className="text-sm font-medium sm:text-base">{detalle}</span></li>)}</ol>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-verified" /> Tú decides con quién trabajar.</div>
            </div>
          </motion.section>
        </AnimatePresence>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 lg:mt-12">
          <Button variant="ghost" disabled={paso === 0} onClick={() => setPaso(p => p - 1)}><ArrowLeft />Atrás</Button>
          <span className="hidden text-sm text-muted-foreground sm:block">{paso + 1} de {PASOS.length}</span>
          <Button size="lg" onClick={() => paso === 2 ? navigate('/panel') : setPaso(p => p + 1)}>{paso === 2 ? 'Ir a mi panel' : 'Siguiente'}<ArrowRight /></Button>
        </footer>
      </main>
    </div>
  );
}
