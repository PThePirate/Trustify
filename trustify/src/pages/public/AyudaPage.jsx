import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown, HelpCircle, ShieldCheck, Flag, Mail, ArrowLeft,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { isLoggedIn } from "@/services/authApi";

const PREGUNTAS_COMPRADOR = [
  {
    p: "¿Por qué necesito verificar mi cuenta para contactar a un negocio?",
    r: "Para contactar a un negocio necesitas registrar tu cédula y confirmar tu correo con el código de 6 dígitos que te enviamos. Puedes revisar el estado de tu verificación en Mi cuenta.",
  },
  {
    p: "¿CheckBiz procesa el pago de lo que compro?",
    r: "No. El pago se acuerda directamente con el negocio, fuera de la app — por eso no cobramos comisión. CheckBiz solo verifica identidades y reputación, nunca retiene ni gestiona dinero.",
  },
  {
    p: "Ya recibí mi producto o servicio, ¿qué hago?",
    r: "Entra a \"Mis solicitudes\", confirma que lo recibiste y podrás dejar una reseña. Solo las reseñas de solicitudes confirmadas cuentan para el Trust Score del negocio — así evitamos reseñas falsas.",
  },
  {
    p: "¿Cómo reporto un negocio sospechoso o un mal comportamiento?",
    r: "Entra al perfil público del negocio y usa el botón \"Reportar\" junto a Contáctenos. Tu reporte llega al equipo de moderación, que revisa el caso.",
  },
];

const PREGUNTAS_EMPRENDEDOR = [
  {
    p: "¿Cuántas capas de verificación existen y cuáles son obligatorias?",
    r: "En Mi cuenta puedes consultar el registro de cédula, correo, revisión de ambas caras del documento y SENESCYT/SRI. La consulta a SENESCYT/SRI está simulada durante el piloto. La biometría facial es una capa separada y sigue pendiente.",
  },
  {
    p: "¿Cuánto demora la revisión de mi cédula?",
    r: "El equipo administrador revisa manualmente el frente y reverso. Mientras esté \"en revisión\" puedes seguir usando tu cuenta con las capas que ya tengas aprobadas. Las imágenes se eliminan después de la decisión.",
  },
  {
    p: "¿Qué pasa si mi cédula queda vetada?",
    r: "Un veto es permanente y cierra tu sesión de inmediato en todos tus dispositivos — no podrás volver a iniciar sesión con esa cuenta. Se aplica solo tras revisar denuncias reales, nunca automáticamente.",
  },
  {
    p: "¿Para qué sirve la Ruta de Formalización y el simulador RIMPE?",
    r: "La ruta organiza ocho requisitos en dos niveles: Verificado y Formalizado. El simulador estima en qué categoría RIMPE calificarías según tus ingresos anuales; no confirma tu registro ante el SRI.",
  },
  {
    p: "¿Qué gano si mejoro mi plan de suscripción?",
    r: "Más ítems en tu catálogo, video de presentación, analítica avanzada y otras funciones según el plan. CheckBiz no procesa el pago de tu suscripción dentro de la app — se coordina directo con el equipo.",
  },
];

function ItemFAQ({ pregunta, abierta, onToggle }) {
  return (
    <div className="panel overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={abierta}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="font-medium">{pregunta.p}</span>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${abierta ? "rotate-180" : ""}`} />
      </button>
      {abierta && (
        <p className="border-t border-border px-4 pb-4 pt-3 text-sm text-muted-foreground">{pregunta.r}</p>
      )}
    </div>
  );
}

function SeccionFAQ({ titulo, preguntas, prefijo }) {
  const [abiertaId, setAbiertaId] = useState(null);
  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-bold">{titulo}</h2>
      <div className="space-y-2">
        {preguntas.map((preg, i) => {
          const id = `${prefijo}-${i}`;
          return (
            <ItemFAQ
              key={id}
              pregunta={preg}
              abierta={abiertaId === id}
              onToggle={() => setAbiertaId(abiertaId === id ? null : id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function AyudaPage() {
  const conSesion = isLoggedIn();

  return (
    <div className="client-help min-h-screen bg-background">
      {!conSesion && (
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="size-4" /> Volver
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>
      )}

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="client-page-heading mb-8 text-center">
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-trust/10 text-trust">
            <HelpCircle className="size-6" />
          </span>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Centro de Ayuda</h1>
          <p className="mt-1 text-muted-foreground">Respuestas rápidas sobre verificación, solicitudes y reportes.</p>
        </div>

        <div className="space-y-8">
          <SeccionFAQ titulo="Para compradores" preguntas={PREGUNTAS_COMPRADOR} prefijo="comprador" />
          <SeccionFAQ titulo="Para emprendedores" preguntas={PREGUNTAS_EMPRENDEDOR} prefijo="emprendedor" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="panel p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <Flag className="size-4 text-danger" /> ¿Encontraste algo sospechoso?
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Busca el perfil del negocio y usa el botón "Reportar" — cada perfil público tiene uno.
            </p>
          </div>
          <div className="panel p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <Mail className="size-4 text-trust" /> ¿No encontraste tu respuesta?
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Escríbenos a{" "}
              <a href="mailto:soporte@checkbiz.ec" className="font-medium text-trust hover:underline">
                soporte@checkbiz.ec
              </a>.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" /> CheckBiz no procesa pagos ni cobra comisiones — solo verifica identidad y reputación.
        </div>
      </div>
    </div>
  );
}
