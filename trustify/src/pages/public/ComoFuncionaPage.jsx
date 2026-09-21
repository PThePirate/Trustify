import { Link } from "react-router-dom";
import { ArrowRight, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import Reveal from "@/components/ui/Reveal";
import { PASOS, CAPAS } from "@/data/content";

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
  { title: "Actívate", desc: "Verifica tu cédula, tu teléfono y tu foto; acepta el Contrato de Adhesión y confirma tu actividad con SENESCYT/SRI." },
  { title: "Publica", desc: "Crea tu Mini Landing Page: nombre, categoría, ciudad, catálogo y WhatsApp. Queda visible en la búsqueda pública en minutos." },
  { title: "Crece", desc: "Recibe solicitudes, súbelas a 'en conversación', confirma trabajos y acumula reseñas reales que suben tu Trust Score e insignias." },
];

export default function ComoFuncionaPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PublicNav />

      <div className="container pt-32 pb-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>
            <span className="mx-auto">Cómo funciona</span>
          </SectionLabel>
          <h1 className="text-3xl font-bold sm:text-4xl">
            El recorrido completo, para cada tipo de cuenta
          </h1>
          <p className="mt-4 text-muted-foreground">
            CheckBiz conecta a personas verificadas: quien busca un servicio y
            quien lo ofrece se identifican con cédula antes de contactarse.
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

        {/* Capas de identidad */}
        <section className="mt-20">
          <Reveal className="max-w-2xl">
            <SectionLabel>Identidad verificada en capas</SectionLabel>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Una cédula válida no basta. Por eso verificamos en 5 capas
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada capa cierra una brecha distinta. El estado que ves abajo es
              real: ninguna capa se presenta como activa si no lo está.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CAPAS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08}>
                <Card glow={c.n === 3} className="group flex h-full flex-col p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-muted-foreground">Capa {c.n}</span>
                    <div className="grid size-9 place-items-center rounded-lg bg-muted/60 text-trust transition-transform duration-300 group-hover:scale-110">
                      <c.icon className="size-[18px]" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold leading-tight">{c.title}</h3>
                  <p className="text-xs font-medium text-trust">{c.subtitle}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                  <Badge variant={toneBadge[c.tone]} className="mt-4 self-start">{c.estado}</Badge>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-16 text-center">
          <p className="text-muted-foreground">
            ¿Representas una universidad o cámara?{" "}
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
