import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, BarChart3, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import Reveal from "@/components/ui/Reveal";

function SectionLabel({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-trust">
      <span className="size-1.5 rounded-full bg-action" />
      {children}
    </div>
  );
}

const PARA_UNIVERSIDADES = [
  {
    icon: GraduationCap,
    title: "Seguimiento de Alumni",
    desc: "Tus egresados solicitan asociarse a tu universidad desde su perfil; tú confirmas o rechazas cada vínculo antes de que cuente.",
  },
  {
    icon: BarChart3,
    title: "Indicadores CACES",
    desc: "Cuántos de tus egresados verificados publicaron un negocio en CheckBiz y en qué nivel de formalización están — listo para tu reporte institucional.",
  },
];

const PARA_CAMARAS = [
  {
    icon: Building2,
    title: "Panel agregado B2G",
    desc: "Totales de negocios verificados por nivel de formalización y sector, sin exponer datos individuales de ningún negocio o usuario.",
  },
  {
    icon: Users,
    title: "Proyección del ecosistema",
    desc: "Una fotografía en tiempo real de cuántos emprendimientos de tu ciudad están construyendo reputación verificable.",
  },
];

function Bloque({ icon: Icon, title, desc }) {
  return (
    <Card className="h-full p-6">
      <div className="mb-4 grid size-11 place-items-center rounded-xl bg-trust/10 text-trust">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}

export default function UniversidadesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PublicNav />

      <div className="container pt-32 pb-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>
            <span className="mx-auto">Panel institucional</span>
          </SectionLabel>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Universidades y cámaras de comercio
          </h1>
          <p className="mt-4 text-muted-foreground">
            CheckBiz solo expone a instituciones datos agregados o vínculos
            que sus propios egresados confirmaron — nunca información de
            negocios ni usuarios ajenos a su alcance autorizado.
          </p>
        </Reveal>

        <section className="mt-14">
          <Reveal className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-trust/10 text-trust">
              <GraduationCap className="size-5" />
            </span>
            <h2 className="text-2xl font-bold">Para universidades</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {PARA_UNIVERSIDADES.map((b) => (
              <Reveal key={b.title}><Bloque {...b} /></Reveal>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <Reveal className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-verified/10 text-verified">
              <Building2 className="size-5" />
            </span>
            <h2 className="text-2xl font-bold">Para cámaras de comercio</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {PARA_CAMARAS.map((b) => (
              <Reveal key={b.title}><Bloque {...b} /></Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <Card glow className="relative mt-16 overflow-hidden px-6 py-12 sm:px-10">
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  ¿Ya tienes una cuenta institucional?
                </h2>
                <p className="mt-3 max-w-lg text-muted-foreground">
                  Cada universidad o cámara recibe credenciales propias, sin
                  acceso a datos de otras instituciones.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="trust" size="lg" asChild>
                    <Link to="/institucional/login">Ingresar al panel <ArrowRight /></Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="mailto:hola@checkbiz.ec?subject=Acceso%20institucional%20CheckBiz">
                      <Mail /> Solicitar acceso
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <PublicFooter />
    </div>
  );
}
