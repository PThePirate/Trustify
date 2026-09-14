import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Lock, ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";
import VerificationSeal from "@/components/brand/VerificationSeal";
import AuroraBackground from "@/components/ui/AuroraBackground";
import ThemeToggle from "@/components/theme/ThemeToggle";

const PUNTOS = [
  { icon: ShieldCheck, text: "KYC bidireccional: 1 cédula = 1 cuenta" },
  { icon: BadgeCheck, text: "Identidad verificada en 5 capas" },
  { icon: Lock, text: "Datos cifrados bajo la LOPDP" },
];

/**
 * AuthLayout: pantalla partida. Izquierda = panel de marca con el sello y
 * aurora animada; derecha = el formulario (children).
 */
export default function AuthLayout({ children }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Volver + tema (flotantes) */}
      <div className="absolute left-5 top-5 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver al inicio
        </Link>
      </div>
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      {/* Panel de marca (izquierda) */}
      <div className="relative hidden overflow-hidden border-r border-border/60 lg:flex">
        <AuroraBackground />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="relative z-10 flex flex-col justify-center px-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <VerificationSeal size={180} />
          </motion.div>

          <h2 className="max-w-md font-display text-4xl font-bold leading-tight">
            Confianza verificada,{" "}
            <span className="text-gradient-neon">sin intermediarios</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Únete al marketplace de identidad digital que le da a cada negocio un
            respaldo real: cédula, contrato y reputación.
          </p>

          <ul className="mt-10 space-y-4">
            {PUNTOS.map((p, i) => (
              <motion.li
                key={p.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-verified/10 text-verified">
                  <p.icon className="size-4" />
                </span>
                {p.text}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulario (derecha) */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <AuroraBackground className="opacity-40 lg:hidden" />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
