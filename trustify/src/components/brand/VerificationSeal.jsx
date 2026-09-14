import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * VerificationSeal — el "sello" hexagonal de Trustify.
 * Es el símbolo visual central de la marca: aparece en el hero, perfiles,
 * catálogo y certificaciones para comunicar "identidad verificada".
 *
 * Props:
 *  - size:   diámetro en px (default 220)
 *  - color:  "trust" (default) | "verified"
 *  - animate: activa la animación de entrada del check + anillo giratorio
 */
export default function VerificationSeal({
  size = 220,
  color = "trust",
  animate = true,
  className,
}) {
  const reduce = useReducedMotion();
  const stroke = color === "verified" ? "hsl(var(--verified))" : "url(#sealGrad)";
  const glow =
    color === "verified"
      ? "hsl(var(--verified) / 0.45)"
      : "hsl(var(--trust) / 0.45)";

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Halo suave detrás del sello */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 65%)` }}
      />

      {/* Anillo exterior de guiones que gira lentamente */}
      {animate && !reduce && (
        <svg
          className="absolute animate-seal-spin"
          width={size}
          height={size}
          viewBox="0 0 240 240"
          fill="none"
        >
          <circle
            cx="120"
            cy="120"
            r="112"
            stroke="hsl(var(--trust) / 0.35)"
            strokeWidth="1.5"
            strokeDasharray="2 10"
          />
        </svg>
      )}

      {/* Sello hexagonal (escudo) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        className="relative drop-shadow-[0_8px_40px_hsl(var(--trust)/0.25)]"
      >
        <defs>
          <linearGradient id="sealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--trust))" />
            <stop offset="1" stopColor="hsl(var(--trust-soft))" />
          </linearGradient>
          <linearGradient id="sealFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--trust) / 0.14)" />
            <stop offset="1" stopColor="hsl(var(--trust-soft) / 0.05)" />
          </linearGradient>
        </defs>

        {/* Cuerpo escudo/hexágono */}
        <path
          d="M120 26 L196 66 V128 C196 172 166 200 120 216 C74 200 44 172 44 128 V66 Z"
          fill="url(#sealFill)"
          stroke={stroke}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Hexágono interior decorativo */}
        <path
          d="M120 60 L162 84 V132 C162 158 144 174 120 184 C96 174 78 158 78 132 V84 Z"
          fill="none"
          stroke="hsl(var(--trust) / 0.25)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Check verificado (se dibuja con animación) */}
        <motion.path
          d="M96 124 L114 142 L150 104"
          fill="none"
          stroke="hsl(var(--verified))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate && !reduce ? { pathLength: 0, opacity: 0 } : false}
          animate={animate && !reduce ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
