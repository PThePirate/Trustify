import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, PlayCircle, ShieldCheck, Fingerprint, Building2,
  Check, X, Plus, Minus, Star, BadgeCheck, Mail, Phone, MapPin, Zap,
  Camera, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationSeal from "@/components/brand/VerificationSeal";
import MiniLandingPreview from "@/components/brand/MiniLandingPreview";
import OrbitalNetwork from "@/components/brand/OrbitalNetwork";
import LogoMarquee from "@/components/brand/LogoMarquee";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import AuroraBackground from "@/components/ui/AuroraBackground";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import Marquee from "@/components/ui/Marquee";
import TiltCard from "@/components/ui/TiltCard";
import ImageSlot from "@/components/ui/ImageSlot";
import TrustScoreCalculator from "@/components/interactive/TrustScoreCalculator";
import SavingsSimulator from "@/components/interactive/SavingsSimulator";
import {
  PILARES, PASOS, CAPAS, METRICAS, STATS, CATEGORIAS,
  CARACTERISTICAS, NEGOCIOS_DEMO, COMPARATIVA, FAQ, PERSONAS,
} from "@/data/content";

function SectionLabel({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-trust">
      <span className="size-1.5 rounded-full bg-trust shadow-[0_0_8px_hsl(var(--trust))] animate-blink" />
      {children}
    </div>
  );
}

const toneBadge = { verified: "verified", trust: "trust", pending: "pending" };
const glowByColor = {
  trust: "text-trust",
  verified: "text-verified",
  "trust-soft": "text-trust-soft",
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PublicNav />

      {/* ===================== HERO (video de fondo) ===================== */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-16">
        {/* ---- Fondo de video ---- */}
        <div className="absolute inset-0 -z-10">
          {/* Fallback (se ve si el video no carga) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#111a30] to-[#0B1220]" />
          {/* Video principal: personas.mp4 */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/personas.mp4" type="video/mp4" />
          </video>
          {/* Overlays para legibilidad del texto */}
          <div className="absolute inset-0 bg-[#0B1220]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-trust opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-trust" />
                </span>
                KYC bidireccional · 1 cédula = 1 cuenta
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.85rem]">
                El fin del anonimato en el{" "}
                <span className="relative whitespace-nowrap bg-gradient-to-r from-[#A5B4FC] to-[#60A5FA] bg-clip-text text-transparent">
                  comercio local
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 16"
                    preserveAspectRatio="none"
                    style={{ height: "0.4em" }}
                  >
                    <motion.path
                      d="M4 11 C 70 3, 150 3, 296 9"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg text-white/75">
                Trustify le da a cada emprendimiento una Mini Landing Page
                verificada —respaldada por cédula, contrato legal y certificación
                universitaria. Confianza real, sin intermediarios.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="trust" size="lg">
                  Crear mi perfil <ArrowRight />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40"
                >
                  <PlayCircle /> Ver demo
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <Fingerprint className="size-4 text-trust" /> Identidad en 5 capas
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-verified" /> Reseñas auditadas
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="size-4 text-trust-soft" /> Aval universitario
                </span>
              </div>
            </motion.div>
          </div>

          {/* Preview del producto flotando sobre el video */}
          <div className="hidden justify-center lg:flex lg:justify-end">
            <div className="animate-float">
              <MiniLandingPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="border-y border-border/60 bg-card/30 py-10">
        <div className="container grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center lg:text-left">
              <p className="font-display text-4xl font-bold text-gradient">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.note}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== CATEGORÍAS (marquee) ===================== */}
      <section className="py-10">
        <p className="container mb-6 text-center text-sm text-muted-foreground">
          Un directorio multisectorial: profesionales, técnicos y creativos
        </p>
        <Marquee>
          {CATEGORIAS.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-2.5 rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm font-medium backdrop-blur"
            >
              <c.icon className="size-4 text-trust" /> {c.label}
            </div>
          ))}
        </Marquee>
      </section>

      {/* ===================== PROBLEMA ===================== */}
      <section className="py-16">
        <div className="container">
          <Reveal className="max-w-3xl">
            <SectionLabel>El vacío de confianza</SectionLabel>
            <p className="text-2xl font-medium leading-snug sm:text-3xl">
              Facebook Marketplace facilita estafas, Instagram vende seguidores
              y Google invisibiliza al negocio local.{" "}
              <span className="text-muted-foreground">
                Nadie garantiza que del otro lado hay una persona real y
                responsable.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== CÓMO FUNCIONA ===================== */}
      <section id="como-funciona" className="py-14">
        <div className="container">
          <Reveal>
            <SectionLabel>Cómo funciona</SectionLabel>
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              Tres pasos, cero intermediarios
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <Card className="shine group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-trust/10 text-trust transition-transform duration-300 group-hover:scale-110">
                      <p.icon className="size-6" />
                    </div>
                    <span className="font-display text-3xl font-bold text-muted-foreground/30">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ALIADOS (social proof) ===================== */}
      <section className="border-y border-border/60 bg-card/20 py-14">
        <Reveal className="container mb-8 text-center">
          <SectionLabel>
            <span className="mx-auto">Respaldo institucional</span>
          </SectionLabel>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Anclado en el ecosistema universitario del Ecuador
          </h2>
        </Reveal>
        <LogoMarquee />
      </section>

      {/* ===================== CARACTERÍSTICAS (producto) ===================== */}
      <section id="producto" className="relative border-y border-border/60 py-14">
        <AuroraBackground className="opacity-30" />
        <div className="container relative">
          <Reveal className="max-w-2xl">
            <SectionLabel>Qué hace Trustify</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Mucho más que un directorio: un Micro-SaaS de identidad
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CARACTERISTICAS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.08}>
                <Card className="shine group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-trust/20 to-verified/10 text-trust transition-transform duration-300 group-hover:scale-110">
                    <c.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== IDENTIDAD EN CAPAS ===================== */}
      <section id="identidad" className="py-14">
        <div className="container">
          <Reveal className="max-w-2xl">
            <SectionLabel>Identidad verificada en capas</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Una cédula válida no basta. Por eso verificamos en 5 capas
            </h2>
            <p className="mt-4 text-muted-foreground">
              El mismo principio que usan bancos y operadoras: cada capa cierra
              una brecha distinta. Reconocer los límites del Módulo 10 y mostrar
              cómo se mitigan es más creíble que presentarlo como solución
              cerrada.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CAPAS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08}>
                <TiltCard>
                  <Card
                    glow={c.n === 3}
                    className="group flex h-full flex-col p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-display text-sm font-semibold text-muted-foreground">
                        Capa {c.n}
                      </span>
                      <div className="grid size-9 place-items-center rounded-lg bg-muted/60 text-trust transition-transform duration-300 group-hover:scale-110">
                        <c.icon className="size-[18px]" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold leading-tight">{c.title}</h3>
                    <p className="text-xs font-medium text-trust">{c.subtitle}</p>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {c.desc}
                    </p>
                    <Badge variant={toneBadge[c.tone]} className="mt-4 self-start">
                      {c.estado}
                    </Badge>
                  </Card>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CALCULADORA TRUST SCORE ===================== */}
      <section className="relative border-y border-border/60 py-14">
        <AuroraBackground className="opacity-25" />
        <div className="container relative">
          <Reveal className="mb-10 max-w-2xl">
            <SectionLabel>Widget interactivo</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Calcula tu Trust Score en vivo
            </h2>
            <p className="mt-4 text-muted-foreground">
              Así de simple: cada verificación suma puntos y sube tu nivel de
              confianza. Pruébalo tú mismo.
            </p>
          </Reveal>
          <Reveal>
            <TrustScoreCalculator />
          </Reveal>
        </div>
      </section>

      {/* ===================== NEGOCIOS: ORBITAL + TARJETAS ===================== */}
      <section className="relative overflow-hidden border-y border-border/60 bg-card/20 py-14">
        <AuroraBackground className="opacity-25" />
        <div className="container relative">
          <Reveal className="max-w-2xl">
            <SectionLabel>Negocios en Trustify</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Una red de perfiles reales y verificables
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada Mini Landing es una persona verificada. Así se ve la red por dentro.
            </p>
          </Reveal>

          <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
            {/* Orbital */}
            <Reveal>
              <OrbitalNetwork />
            </Reveal>

            {/* 4 tarjetas 2x2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              {NEGOCIOS_DEMO.map((n, i) => (
                <Reveal key={n.n} delay={i * 0.08}>
                  <Card className="group h-full overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1.5">
                    <div className="relative">
                      <ImageSlot src={n.foto} label={n.categoria} Icon={Camera} className="h-24" />
                      <span className="absolute left-3 top-2.5 font-display text-lg font-bold text-white drop-shadow-lg">
                        {n.n}
                      </span>
                      <Badge variant="verified" className="absolute right-2 top-2 backdrop-blur">
                        <BadgeCheck /> {n.tag}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold leading-tight">{n.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{n.categoria}</p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="size-3.5 fill-pending text-pending" /> {n.score}
                        </span>
                        <span className={glowByColor[n.color]}>{n.nivel}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <span
                            key={k}
                            className={
                              "h-1.5 flex-1 rounded-full " +
                              (k < n.capas ? "bg-verified" : "bg-muted")
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {n.capas} de 5 capas verificadas
                      </p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PERSONAS REALES (video de fondo) ===================== */}
      <section className="relative overflow-hidden border-y border-border/60 py-20">
        {/* ---- Fondo de video ---- */}
        <div className="absolute inset-0 -z-10">
          {/* Fallback si el video no carga */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#111a30] to-[#0B1220]" />
          {/* Video de la sección Personas reales: hero.mp4 */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          {/* Overlays para legibilidad */}
          <div className="absolute inset-0 bg-[#0B1220]/78" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/70 to-[#0B1220]/40" />
        </div>

        <div className="container relative">
          <Reveal className="max-w-2xl">
            <SectionLabel>Detrás de cada perfil</SectionLabel>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Personas reales, con nombre y rostro
            </h2>
            <p className="mt-4 text-white/75">
              No hay cuentas fantasma ni vendedores anónimos. Cada emprendimiento
              está respaldado por una persona verificada.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {PERSONAS.map((p, i) => (
              <Reveal key={p.rol} delay={(i % 6) * 0.06}>
                <ImageSlot
                  src={p.foto}
                  label={p.rol}
                  Icon={p.Icon}
                  caption={`${p.rol} · ${p.ciudad}`}
                  className="aspect-[4/5] ring-1 ring-white/10"
                />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/70">
            <Users className="size-4 text-trust" />
            Reemplaza estos espacios con fotos reales de emprendedores en sus
            talleres, locales o escritorios.
          </p>
        </div>
      </section>

      {/* ===================== NÚCLEO INTOCABLE ===================== */}
      <section className="py-14">
        <div className="container">
          <Reveal className="max-w-2xl">
            <SectionLabel>El núcleo intocable</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Cuatro pilares que no se negocian
            </h2>
            <p className="mt-4 text-muted-foreground">
              Toda función nueva se filtra por estos cuatro principios: si los
              refuerza, se prioriza; si compite con ellos, se descarta.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PILARES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1}>
                <Card className="shine flex h-full gap-4 p-6">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-verified/10 text-verified">
                    <p.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COMPARATIVA ===================== */}
      <section className="border-y border-border/60 bg-card/20 py-14">
        <div className="container">
          <Reveal className="max-w-2xl">
            <SectionLabel>Por qué no te copian</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Trustify frente a las alternativas
            </h2>
          </Reveal>

          <Reveal className="mt-10 overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] items-end gap-2 border-b border-border pb-4">
                <div />
                {COMPARATIVA.columnas.map((col) => (
                  <div
                    key={col.nombre}
                    className={
                      "rounded-t-xl px-3 py-2 text-center text-sm font-semibold " +
                      (col.destacado ? "bg-trust/15 text-trust" : "text-muted-foreground")
                    }
                  >
                    {col.nombre}
                  </div>
                ))}
              </div>
              {COMPARATIVA.criterios.map((crit, ri) => (
                <div
                  key={crit}
                  className="grid grid-cols-[1.4fr_repeat(4,1fr)] items-center gap-2 border-b border-border/50 py-3.5"
                >
                  <div className="text-sm font-medium">{crit}</div>
                  {COMPARATIVA.columnas.map((col) => (
                    <div
                      key={col.nombre}
                      className={"grid place-items-center " + (col.destacado ? "bg-trust/5" : "")}
                    >
                      {col.valores[ri] ? (
                        <span className="grid size-7 place-items-center rounded-full bg-verified/15 text-verified">
                          <Check className="size-4" />
                        </span>
                      ) : (
                        <span className="grid size-7 place-items-center rounded-full bg-muted text-muted-foreground/50">
                          <X className="size-4" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SIMULADOR DE AHORRO ===================== */}
      <section className="py-14">
        <div className="container">
          <Reveal className="mb-10 max-w-2xl">
            <SectionLabel>Widget interactivo</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Lo que ahorras con $0 de comisión
            </h2>
            <p className="mt-4 text-muted-foreground">
              Otras plataformas se quedan con un porcentaje de cada venta. En
              Trustify, ese dinero es tuyo.
            </p>
          </Reveal>
          <Reveal>
            <SavingsSimulator />
          </Reveal>
        </div>
      </section>

      {/* ===================== MÉTRICAS ===================== */}
      <section id="metricas" className="py-14">
        <div className="container">
          <Reveal className="max-w-2xl">
            <SectionLabel>Para el panel de jueces</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Unidad económica que se sostiene
            </h2>
            <p className="mt-4 text-muted-foreground">
              Estimaciones de planificación para un MVP universitario. Un ratio
              LTV/CAC sobre 3× ya se considera saludable.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {METRICAS.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.07}>
                <Card className="shine h-full p-6">
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="mt-3 font-display text-3xl font-bold">
                    <Counter
                      value={m.value}
                      prefix={m.prefix}
                      suffix={m.suffix}
                      decimals={m.decimals || 0}
                    />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="border-y border-border/60 py-14">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionLabel>Preguntas del jurado</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Adelantándonos a las objeciones
            </h2>
            <p className="mt-4 text-muted-foreground">
              Las preguntas que más se repiten en un pitch, respondidas de
              frente.
            </p>
          </Reveal>

          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <Card key={i} className="overflow-hidden p-0">
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-trust">
                      {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                  </motion.div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CTA + CONTACTO ===================== */}
      <section className="py-16">
        <div className="container">
          <Card glow className="relative overflow-hidden px-6 py-16 sm:px-12">
            <AuroraBackground className="opacity-50" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-trust/30 bg-trust/10 px-3 py-1 text-xs font-medium text-trust">
                  <Zap className="size-3.5" /> Demo lista para el 23 de septiembre
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                  Dale identidad a tu negocio hoy
                </h2>
                <p className="mt-4 max-w-lg text-muted-foreground">
                  Publica tu Mini Landing Page verificada en minutos y empieza a
                  construir tu Trust Score. Gratis para siempre en el plan
                  Básico.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="trust" size="lg">
                    Crear mi perfil <ArrowRight />
                  </Button>
                  <Button variant="outline" size="lg">
                    Soy universidad o cámara
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Mail className="size-4 text-trust" /> hola@trustify.ec
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="size-4 text-trust" /> +593 99 000 0000
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-trust" /> Guayaquil, Ecuador
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <VerificationSeal size={200} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
