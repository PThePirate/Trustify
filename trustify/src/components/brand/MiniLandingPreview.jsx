import { motion } from "framer-motion";
import { BadgeCheck, Star, MessageCircle, MapPin, TrendingUp } from "lucide-react";

/**
 * MiniLandingPreview: maqueta flotante de un perfil verificado.
 * Muestra el producto real en el hero (equivalente al "dashboard" de la
 * referencia) con micro-animaciones para dar sensación de vida.
 */
export default function MiniLandingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[320px] sm:w-[360px]"
      style={{ perspective: 1000 }}
    >
      {/* Tarjeta principal */}
      <div className="glass-strong hairline-gradient relative overflow-hidden rounded-3xl p-5 shadow-glow-lg">
        {/* Línea de escaneo biométrico */}
        <span className="scan-line" />
        {/* Portada */}
        <div className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-trust/30 via-trust-soft/20 to-verified/25">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-verified/15 px-2.5 py-1 text-[11px] font-medium text-verified backdrop-blur">
            <BadgeCheck className="size-3.5" /> Verificado
          </span>
        </div>

        {/* Avatar + nombre */}
        <div className="-mt-8 flex items-end gap-3 px-1">
          <div className="grid size-16 place-items-center rounded-2xl border-2 border-verified/60 bg-card text-xl font-bold text-trust shadow-glow-verified">
            A
          </div>
          <div className="pb-1">
            <p className="font-display text-base font-semibold leading-tight">
              Aura Design Studio
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> Guayaquil · Diseño de marca
            </p>
          </div>
        </div>

        {/* Trust Score + rating */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground">Trust Score</p>
            <p className="flex items-center gap-1.5 font-display text-xl font-bold text-trust">
              <TrendingUp className="size-4" /> 92
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground">Reseñas</p>
            <p className="flex items-center gap-1 font-display text-xl font-bold">
              <Star className="size-4 fill-pending text-pending" /> 4.9
            </p>
          </div>
        </div>

        {/* Capas de verificación */}
        <div className="mt-3 flex items-center gap-1.5">
          {["Estructura", "Teléfono", "Foto", "SRI"].map((c, i) => (
            <motion.span
              key={c}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 300 }}
              className="inline-flex items-center gap-1 rounded-md bg-verified/10 px-1.5 py-1 text-[10px] font-medium text-verified"
            >
              <BadgeCheck className="size-3" /> {c}
            </motion.span>
          ))}
        </div>

        {/* Botón WhatsApp */}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-action py-2.5 text-sm font-semibold text-[hsl(var(--action-ink))] transition-colors hover:brightness-95">
          <MessageCircle className="size-4" /> Contactar por WhatsApp
        </button>
      </div>

      {/* Tarjetita flotante: solicitud confirmada */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="glass absolute -right-5 -top-5 hidden rounded-2xl p-3 shadow-glow sm:block animate-float-slow"
      >
        <p className="flex items-center gap-2 text-xs font-medium">
          <span className="grid size-6 place-items-center rounded-full bg-verified/15 text-verified">
            <BadgeCheck className="size-3.5" />
          </span>
          Pedido confirmado
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Reseña desbloqueada
        </p>
      </motion.div>

      {/* Tarjetita flotante: nueva solicitud */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="glass absolute -left-6 -bottom-5 hidden rounded-2xl p-3 shadow-glow sm:block animate-float"
      >
        <p className="text-[10px] text-muted-foreground">Visitas hoy</p>
        <p className="font-display text-lg font-bold text-trust">+248</p>
      </motion.div>
    </motion.div>
  );
}
