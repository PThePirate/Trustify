import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Fingerprint, Building2,
  Plus, Minus, Star, BadgeCheck, Mail, MapPin, Zap, Check, X,
  Users, Store, MessageCircle, Heart, Sparkles, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import MiniLandingPreview from "@/components/brand/MiniLandingPreview";
import LogoMarquee from "@/components/brand/LogoMarquee";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import { useTheme } from "@/components/theme/ThemeProvider";
import AuroraBackground from "@/components/ui/AuroraBackground";
import Reveal from "@/components/ui/Reveal";
import ImageSlot from "@/components/ui/ImageSlot";
import Marquee from "@/components/ui/Marquee";
import SavingsSimulator from "@/components/interactive/SavingsSimulator";
import {
  PILARES, PASOS, CATEGORIAS, CARACTERISTICAS, FAQ, PERSONAS,
} from "@/data/content";
import "./landing.css";
import IdentitySeals from "@/components/brand/IdentitySeals";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

function LandingAtmosphere() {
  return <div className="landing-atmosphere" aria-hidden="true">
    <span className="landing-light landing-light-blue" /><span className="landing-light landing-light-green" /><span className="landing-light landing-light-coral" />
    <svg className="landing-connections" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <path d="M-80 780 C260 780 210 140 650 140 S1160 700 1510 280" />
      <path d="M-80 320 C300 320 350 820 830 820 S1250 100 1510 100" />
      <path className="landing-signal" d="M-80 780 C260 780 210 140 650 140 S1160 700 1510 280" />
      <path className="landing-signal landing-signal-two" d="M-80 320 C300 320 350 820 830 820 S1250 100 1510 100" />
      <circle cx="650" cy="140" r="9" /><circle cx="830" cy="820" r="7" /><circle cx="1270" cy="425" r="8" />
    </svg>
    {Array.from({ length: 28 }, (_, i) => <span key={i} className="landing-spark" style={{ "--spark-x": `${8 + (i * 23) % 86}%`, "--spark-y": `${12 + (i * 17) % 78}%`, "--spark-delay": `${i * -.7}s` }} />)}
    {[Store, MessageCircle, Heart, ShoppingBag, Star, Sparkles].map((Icon, index) => <span className={`landing-toy landing-toy-${index}`} key={index}><Icon /></span>)}
    <span className="landing-sonar landing-sonar-one" /><span className="landing-sonar landing-sonar-two" />
  </div>;
}

function SectionLabel({ children }) {
  return (
    <>
    <div className="landing-section-art" aria-hidden="true"><span /><span /><span /><Sparkles /><Store /><MessageCircle /></div>
    <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-trust">
      <span className="size-1.5 rounded-full bg-action" />
      {children}
    </div>
    </>
  );
}


export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const { theme } = useTheme();

  return (
    <div className="landing-experience relative min-h-screen overflow-x-hidden">
      <PublicNav />

      {/* ===================== HERO (video de fondo) ===================== */}
      <section className="landing-hero relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-16">
        {/* ---- Fondo de video ---- */}
        <div className="landing-hero-media absolute inset-0">
          {/* Fallback (se ve si el video no carga) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#172A36] via-[#203743] to-[#172A36]" />
          {/* Video principal: personas.mp4 */}
          <BackgroundVideo src="/videos/personas-720.mp4" poster="/videos/personas-poster.jpg" className="absolute inset-0 h-full w-full object-cover" />
          {/* Overlays para legibilidad del texto */}
          <div className="absolute inset-0 bg-[#172A36]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172A36] via-[#172A36]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#172A36]/45 to-transparent" />
        </div>

        <LandingAtmosphere />

        <div className="container relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                <span className="relative flex size-2">
                  <span className="relative inline-flex size-2 rounded-full bg-action" />
                </span>
                Todos se identifican: quien vende y quien compra
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.85rem]">
                El fin del anonimato en el{" "}
                <span className="relative whitespace-nowrap text-[#B7DEE4]">
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
                      stroke="#F09A70"
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
                Encuentra negocios de tu comunidad universitaria y conoce quién está detrás. Si emprendes, crea tu Mini Landing Page respaldada por identidad verificada y vinculada a tu universidad.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="trust" size="lg" asChild>
                  <Link to="/registro">Crear mi perfil <ArrowRight /></Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40"
                  asChild
                >
                  <Link to="/buscar"><Store /> Buscar negocios</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <Fingerprint className="size-4 text-trust" /> Identidad verificada
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-verified" /> Reseñas de clientes verificados
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="size-4 text-trust-soft" /> Comunidad universitaria
                </span>
              </div>
              <a href="#perfiles-ejemplo" className="mt-6 inline-block text-sm font-semibold text-trust underline underline-offset-4">Ver un perfil de ejemplo</a>
            </motion.div>
          </div>

          {/* Preview del producto flotando sobre el video */}
          <div className="landing-preview-stage hidden justify-center lg:flex lg:justify-end">
            <span className="landing-preview-orbit" aria-hidden="true" />
            <div className="animate-float relative z-10">
              <MiniLandingPreview />
            </div>
            <span className="landing-floating-note landing-note-identity"><ShieldCheck size={18} /> Una identidad real</span>
            <span className="landing-floating-note landing-note-local"><MapPin size={18} /> Tu comunidad, más cerca</span>
          </div>
        </div>
      </section>

      <section className="landing-stats border-y border-border/60 py-8"><div className="container flex flex-wrap items-center justify-between gap-5"><p className="text-2xl font-bold text-verified">$0 de comisión por tus ventas</p><p className="text-muted-foreground">Tu venta es tuya. Elige un plan fijo para publicar tu negocio.</p><Link className="text-trust font-semibold hover:underline" to="/planes">Conocer los planes</Link></div></section>
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
              En redes no siempre sabes quién está del otro lado.{" "}
              <span className="text-muted-foreground">
                Conoce a la persona, revisa sus sellos y conversa antes de decidir.
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
                <Card className="landing-surface shine group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
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

          <Reveal className="mt-8">
            <Link to="/como-funciona" className="text-sm font-medium text-trust hover:underline">
              Ver el recorrido completo, para clientes y emprendedores →
            </Link>
          </Reveal>
        </div>
      </section>


      <section className="border-y border-border/60 bg-card/20 py-14">
        <Reveal className="container text-center">
          <SectionLabel>Universidades e institutos</SectionLabel>
          <h2 className="text-2xl font-semibold sm:text-3xl">Una comunidad que conecta el talento universitario</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">Conoce las instituciones del ecosistema universitario. Su presencia aquí no implica un convenio activo.</p>
        </Reveal>
        <LogoMarquee />
      </section>

      {/* ===================== CARACTERÍSTICAS (producto) ===================== */}
      <section id="producto" className="relative border-y border-border/60 py-14">
        <AuroraBackground className="opacity-30" />
        <div className="container relative">
          <Reveal className="max-w-2xl">
            <SectionLabel>Qué hace CheckBiz</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Todo lo que tu negocio necesita para que confíen en él
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CARACTERISTICAS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.08}>
                <Card className="landing-surface shine group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
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

      <section id="identidad" className="py-16"><div className="container"><SectionLabel>Dos sellos, dos significados</SectionLabel><h2 className="text-3xl font-bold sm:text-4xl">Identidad y formalización, con claridad</h2><p className="mt-4 max-w-2xl text-muted-foreground">Un sello identifica a la persona. El otro identifica la formalización de su negocio.</p><IdentitySeals /></div></section>

      <section id="perfiles-ejemplo" className="border-y border-border/60 bg-card/20 py-16"><div className="container"><SectionLabel>Perfiles de ejemplo</SectionLabel><h2 className="text-3xl font-bold sm:text-4xl">Así puede verse tu negocio</h2><p className="mt-3 text-muted-foreground">Perfiles ilustrativos para conocer la presentación, los sellos y las reseñas.</p><div className="example-profile-grid">{[
        { name: "Aura Design Studio", category: "Diseño de marca", Icon: Sparkles, rating: "4.9", formalized: true },
        { name: "Forge 3D Lab", category: "Impresión 3D a medida", Icon: Store, rating: "5.0", formalized: true },
        { name: "Tutorías en comunidad", category: "Acompañamiento académico", Icon: Building2, rating: "4.8", formalized: false },
      ].map(({name, category, Icon, rating, formalized}) => <article className="example-profile" key={name}><div className="example-profile-cover" aria-hidden="true"><Icon size={64}/><span/><span/></div><div className="p-6"><h3 className="text-xl font-semibold">{name}</h3><p className="text-sm text-muted-foreground mt-1">{category}</p><div className="flex flex-wrap gap-2 my-4"><Badge variant="verified"><BadgeCheck/> Verificado</Badge>{formalized && <Badge variant="trust"><Building2/> Formalizado</Badge>}</div><p className="flex items-center gap-2 text-sm"><Star className="size-4 text-pending fill-pending"/> {rating} · Calificación ilustrativa</p></div></article>)}</div><Button asChild variant="outline" className="mt-8"><Link to="/buscar">Buscar negocios <ArrowRight/></Link></Button></div></section>
      {/* ===================== PERSONAS REALES (video según el tema) ===================== */}
      <section className="relative overflow-hidden border-y border-border/60 py-20">
        {/* ---- Fondo de video ---- */}
        <div className="absolute inset-0 -z-10">
          {/* Fallback si el video no carga */}
          <div className="absolute inset-0 bg-[#F4EBDD] dark:bg-[#172A36]" />
          {/* En claro usa hero2.mp4; en oscuro conserva hero.mp4. */}
          <BackgroundVideo src={theme === "light" ? "/videos/hero2-720.mp4" : "/videos/hero-720.mp4"} poster={theme === "light" ? "/videos/hero2-poster.jpg" : "/videos/hero-poster.jpg"} className="absolute inset-0 h-full w-full object-cover" />
          {/* Capa cálida en claro y azul petróleo en oscuro. */}
          <div className="absolute inset-0 bg-[#FFFCF6]/72 dark:bg-[#172A36]/78" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFCF6]/95 via-[#FFFCF6]/76 to-[#FFFCF6]/42 dark:from-[#172A36] dark:via-[#172A36]/72 dark:to-[#172A36]/45" />
        </div>

        <div className="container relative">
          <Reveal className="max-w-2xl">
            <SectionLabel>Detrás de cada perfil</SectionLabel>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Personas reales, con nombre y rostro
            </h2>
            <p className="mt-4 text-muted-foreground">
              Diseño, tecnología, tutorías y más: descubre el trabajo de tu comunidad y conoce a quienes lo hacen.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {PERSONAS.map((persona, index) => (
              <Reveal key={persona.rol} delay={index * 0.06}>
                <ImageSlot
                  src={persona.foto}
                  alt={persona.rol}
                  label={persona.rol}
                  Icon={persona.Icon}
                  caption={`${persona.rol} · ${persona.ciudad}`}
                  placeholderLabel={null}
                  className="aspect-[4/5] ring-1 ring-border"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NÚCLEO INTOCABLE ===================== */}
      <section className="py-14">
        <div className="container">
          <Reveal className="max-w-2xl">
            <SectionLabel>Tu negocio, tus decisiones</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Vende con independencia
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tú acuerdas el pago y la entrega con tu cliente. CheckBiz facilita que se conozcan y conversen.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PILARES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1}>
                <Card className="landing-surface shine flex h-full gap-4 p-6">
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


      <section className="border-y border-border/60 bg-card/20 py-16">
        <div className="container">
          <Reveal>
            <SectionLabel>Beneficios para tu negocio</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">Qué te da CheckBiz</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">Compara el enfoque de CheckBiz con otros canales para dar a conocer tu negocio.</p>
          </Reveal>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[740px] text-left text-sm">
              <caption className="sr-only">Comparación del enfoque de CheckBiz con otras plataformas</caption>
              <thead className="bg-trust/15"><tr>
                <th scope="col" className="px-6 py-5 font-semibold">Beneficio</th>
                {["CheckBiz", "Facebook / Instagram", "Catálogo gremial", "LinkedIn"].map((nombre, i) => <th key={nombre} scope="col" className={`px-4 py-5 text-center font-semibold ${i === 0 ? "bg-trust/15 text-trust" : "text-muted-foreground"}`}>{nombre}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ["Identidad verificada de comprador y vendedor", [true, false, false, false]],
                  ["Reseñas vinculadas a clientes verificados y conversaciones", [true, false, false, false]],
                  ["Sin comisiones por venta directa", [true, true, true, true]],
                  ["Orientación para formalizarse", [true, false, false, false]],
                ].map(([beneficio, valores]) => <tr key={beneficio} className="border-t border-border/60 bg-card/30 transition-colors hover:bg-trust/5">
                  <th scope="row" className="px-6 py-5 font-medium">{beneficio}</th>
                  {valores.map((incluido, i) => <td key={i} className={`px-4 py-5 ${i === 0 ? "bg-trust/5" : ""}`}><span className={`comparison-status mx-auto ${incluido ? "comparison-status-yes" : "comparison-status-no"}`} role="img" aria-label={incluido ? "Contemplado en esta comparación" : "Sin un equivalente en este enfoque"}>{incluido ? <Check size={18} strokeWidth={3} aria-hidden="true"/> : <X size={18} strokeWidth={3} aria-hidden="true"/>}</span></td>)}
                </tr>)}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Comparación del enfoque propuesto: los vistos y equis indican estos criterios específicos, no todas las funciones de cada plataforma. Las funciones y condiciones pueden variar. En esta versión de CheckBiz, la revisión de identidad es manual.</p>
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
              CheckBiz, ese dinero es tuyo. La comparación muestra comisiones hipotéticas; no descuenta el costo de tu plan.
            </p>
          </Reveal>
          <Reveal>
            <SavingsSimulator />
          </Reveal>
        </div>
      </section>

      <section className="py-16"><div className="container"><Card className="landing-surface university-invitation"><div><Building2 size={40} className="text-trust"/><h2 className="text-3xl font-bold mt-5">Sus emprendedores, visibles y verificados</h2><p className="mt-4 text-muted-foreground">Vincula a estudiantes y graduados con su comunidad. Tu universidad puede cubrir sus planes y consultar datos agregados de emprendimiento.</p><Button asChild variant="trust" className="mt-6"><Link to="/universidades">Soy Universidad <ArrowRight/></Link></Button></div><div className="university-invitation-art" aria-hidden="true"><Building2 size={100}/><span><Users/> Comunidad</span><span><Store/> Emprendimientos</span><span><ShieldCheck/> Identidad</span></div></Card></div></section>
      {/* ===================== FAQ ===================== */}
      <section className="border-y border-border/60 py-14">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionLabel>Preguntas frecuentes</SectionLabel>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Resuelve tus dudas
            </h2>
            <p className="mt-4 text-muted-foreground">
              Información para clientes, emprendedores y universidades.
            </p>
          </Reveal>

          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <Card key={i} className="overflow-hidden p-0">
                  <button
                    aria-expanded={open}
                    aria-controls={`landing-faq-${i}`}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-trust">
                      {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <motion.div
                    id={`landing-faq-${i}`}
                    inert={open ? undefined : ""}
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
          <Card glow className="landing-surface relative overflow-hidden px-6 py-16 sm:px-12">
            <AuroraBackground className="opacity-50" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-trust/30 bg-trust/10 px-3 py-1 text-xs font-medium text-trust">
                  <Zap className="size-3.5" /> Conecta tu negocio con tu comunidad
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                  Dale identidad a tu negocio hoy
                </h2>
                <p className="mt-4 max-w-lg text-muted-foreground">
                  Crea tu cuenta, elige un plan y construye la presencia digital
                  de tu negocio con tu Mini Landing Page. Si tu universidad tiene convenio y te asigna una plaza, cubre tu plan.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="trust" size="lg" asChild>
                    <Link to="/registro">Crear mi perfil <ArrowRight /></Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/universidades">Soy Universidad</Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Mail className="size-4 text-trust" /> hola@checkbiz.ec
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-trust" /> Guayaquil, Ecuador
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <Logo showText={false} markClassName="h-44 w-48 rounded-3xl" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
