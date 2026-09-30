import { Link } from "react-router-dom";
import { ArrowRight, Store, ShoppingBag, ShieldCheck, MessageCircle, Star, Fingerprint } from "lucide-react";
import "./comoFunciona.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import Reveal from "@/components/ui/Reveal";
import IdentitySeals from "@/components/brand/IdentitySeals";
import { PASOS } from "@/data/content";

const toneBadge = { verified: "verified", trust: "trust", pending: "pending" };

function SectionLabel({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-trust">
      <span className="size-1.5 rounded-full bg-action" />
      {children}
    </div>
  );
}

const PASOS_EMPRENDEDOR = [
  { title: "Actívate", desc: "Verifica tu cédula y tu rostro, confirma tu correo y acepta los términos. Firma tu Declaración Responsable. Si tienes RUC, solicita también el sello Formalizado." },
  { title: "Publica", desc: "Elige un plan individual o una plaza cubierta por tu universidad. Crea tu Mini Landing Page con catálogo y chat." },
  { title: "Crece", desc: "Acepta o rechaza solicitudes, conversa por el chat y recibe reseñas de clientes verificados. El modelo contempla que las solicitudes expiren a los 7 días." },
];

export default function ComoFuncionaPage() {
  return (
    <div className="how-experience relative min-h-screen overflow-x-hidden">
      <PublicNav />
      <div className="how-atmosphere" aria-hidden="true">
        <span className="how-light how-light-blue" /><span className="how-light how-light-green" />
        <svg viewBox="0 0 1400 700" preserveAspectRatio="none"><path d="M-50 500 Q300 -100 700 350 T1450 150" /><path className="how-signal" d="M-50 500 Q300 -100 700 350 T1450 150" /><ellipse cx="700" cy="300" rx="570" ry="240" /></svg>
        {[Store, ShoppingBag, ShieldCheck, MessageCircle, Star, Fingerprint].map((Icon, index) => <span className={`how-object how-object-${index}`} key={index}><Icon /></span>)}
        {Array.from({length:20}, (_, index) => <i key={index} style={{left:`${(index * 29 + 5) % 96}%`, top:`${(index * 17 + 8) % 94}%`, animationDelay:`-${index * .7}s`}} />)}
      </div>

      <div className="container pt-32 pb-16">
        <Reveal className="how-heading mx-auto max-w-2xl text-center">
          <SectionLabel>
            <span className="mx-auto">Cómo funciona</span>
          </SectionLabel>
          <h1 className="text-3xl font-bold sm:text-4xl">
            El recorrido completo, para cada tipo de cuenta
          </h1>
          <p className="mt-4 text-muted-foreground">
            CheckBiz conecta a personas verificadas: quien busca un servicio y
            quien lo ofrece se identifican antes de contactarse. Puedes explorar sin cuenta.
            Así funciona paso a paso.
          </p>
        </Reveal>

        {/* Cliente */}
        <section className="mt-16">
          <Reveal className="mb-8 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-trust/10 text-trust">
              <ShoppingBag className="size-5" />
            </span>
            <h2 className="text-2xl font-bold">Si buscas un servicio</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <Card className="shine group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-trust/10 text-trust transition-transform duration-300 group-hover:scale-110">
                      <p.icon className="size-6" />
                    </div>
                    <span className="font-display text-3xl font-bold text-muted-foreground/30">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <Button variant="trust" asChild>
              <Link to="/registro">Crear cuenta de cliente <ArrowRight /></Link>
            </Button>
          </Reveal>
        </section>

        {/* Emprendedor */}
        <section className="mt-20">
          <Reveal className="mb-8 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-verified/10 text-verified">
              <Store className="size-5" />
            </span>
            <h2 className="text-2xl font-bold">Si ofreces un servicio</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {PASOS_EMPRENDEDOR.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <Card className="shine group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="how-step-icon"><Store className="size-6" /></span>
                    <span className="font-display text-3xl font-bold text-muted-foreground/30">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <Button variant="verified" asChild>
              <Link to="/registro">Crear perfil de emprendedor <ArrowRight /></Link>
            </Button>
          </Reveal>
        </section>

        <section className="mt-20"><SectionLabel>Los sellos del perfil</SectionLabel><h2 className="text-3xl font-bold">Verificado y Formalizado</h2><IdentitySeals /></section>

        <Reveal className="mt-16 text-center">
          <p className="text-muted-foreground">
            ¿Representas una universidad?{" "}
            <Link to="/universidades" className="font-medium text-trust hover:underline">
              Conoce el panel institucional
            </Link>.
          </p>
        </Reveal>
      </div>

      <PublicFooter />
    </div>
  );
}

