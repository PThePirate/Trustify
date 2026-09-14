import { ShieldCheck, BadgeCheck, Palette, Code2, Building2, TrendingUp } from "lucide-react";
import Counter from "@/components/ui/Counter";
import { cn } from "@/lib/utils";

/* Nodo posicionado en la órbita: se coloca en (ángulo, radio) y se
   "des-rota" para quedar derecho; el .orbit-keep cancela el giro del grupo. */
function Node({ angle, r, children }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-${r}px)` }}
    >
      <div style={{ transform: `rotate(${-angle}deg)` }}>
        <div className="orbit-keep">{children}</div>
      </div>
    </div>
  );
}

function Avatar({ initials, grad }) {
  return (
    <div
      className={cn(
        "relative grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl font-display text-base font-bold text-white shadow-lg ring-2 ring-background",
        grad
      )}
    >
      {initials}
      <span className="absolute -bottom-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-verified ring-2 ring-background">
        <BadgeCheck className="size-3 text-[hsl(var(--primary-ink))]" />
      </span>
    </div>
  );
}

function Chip({ Icon }) {
  return (
    <div className="grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-border bg-card text-trust shadow-lg">
      <Icon className="size-5" />
    </div>
  );
}

/**
 * OrbitalNetwork — "la red de identidades verificadas".
 * Centro con contador + perfiles y categorías orbitando en dos anillos.
 */
export default function OrbitalNetwork({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative size-[420px] scale-[0.82] sm:scale-90 lg:scale-100">
        {/* pulsos */}
        <div className="absolute left-1/2 top-1/2 size-[420px] rounded-full border border-trust/40 orbit-pulse" />
        <div className="absolute left-1/2 top-1/2 size-[420px] rounded-full border border-trust/40 orbit-pulse delay" />

        {/* anillos */}
        <div className="absolute left-1/2 top-1/2 size-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-trust/20" />
        <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-muted-foreground/25" />
        <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70" />

        {/* núcleo */}
        <div className="absolute left-1/2 top-1/2 grid size-[160px] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full border border-trust/30 bg-card/80 text-center shadow-glow backdrop-blur">
          <ShieldCheck className="mx-auto mb-1 size-7 text-trust" />
          <div className="font-display text-4xl font-bold">
            <Counter value={100} suffix="+" />
          </div>
          <div className="text-xs text-muted-foreground">perfiles verificados</div>
        </div>

        {/* órbita interior */}
        <div className="orbit-g1 absolute inset-0">
          <Node angle={25} r={118}>
            <Avatar initials="AR" grad="bg-gradient-to-br from-trust to-trust-soft" />
          </Node>
          <Node angle={150} r={118}>
            <Chip Icon={Palette} />
          </Node>
          <Node angle={275} r={118}>
            <Avatar initials="VC" grad="bg-gradient-to-br from-trust-soft to-trust" />
          </Node>
        </div>

        {/* órbita exterior */}
        <div className="orbit-g2 absolute inset-0">
          <Node angle={55} r={180}>
            <Avatar initials="F3" grad="bg-gradient-to-br from-verified to-trust" />
          </Node>
          <Node angle={130} r={180}>
            <Chip Icon={Code2} />
          </Node>
          <Node angle={210} r={180}>
            <Avatar initials="JL" grad="bg-gradient-to-br from-trust to-verified" />
          </Node>
          <Node angle={320} r={180}>
            <Chip Icon={Building2} />
          </Node>
        </div>

        {/* etiquetas flotantes */}
        <div className="absolute -left-3 top-6 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 text-xs font-medium shadow-glow backdrop-blur animate-float">
          <span className="grid size-5 place-items-center rounded-md bg-verified/15 text-verified">
            <BadgeCheck className="size-3.5" />
          </span>
          Mini Landing publicada
        </div>
        <div className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-glow backdrop-blur animate-float-slow">
          <span className="text-xs text-muted-foreground">Trust Score</span>
          <span className="flex items-center gap-1 font-display text-base font-bold text-trust">
            <TrendingUp className="size-3.5" />92
          </span>
        </div>
      </div>
    </div>
  );
}