import { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRUST_ITEMS, TRUST_NIVELES } from "@/data/content";
import { cn } from "@/lib/utils";

const R = 54;
const C = 2 * Math.PI * R;
const toneStroke = {
  pending: "hsl(var(--pending))",
  trust: "hsl(var(--trust))",
  verified: "hsl(var(--verified))",
};

function nivelDe(score) {
  return [...TRUST_NIVELES].reverse().find((n) => score >= n.min) || TRUST_NIVELES[0];
}

export default function TrustScoreCalculator() {
  const [sel, setSel] = useState(() => new Set(["cedula", "otp"]));

  const score = useMemo(
    () => TRUST_ITEMS.filter((i) => sel.has(i.id)).reduce((a, i) => a + i.pts, 0),
    [sel]
  );
  const nivel = nivelDe(score);

  // Número y anillo animados
  const spring = useSpring(0, { stiffness: 120, damping: 20 });
  useEffect(() => spring.set(score), [score, spring]);
  const shown = useTransform(spring, (v) => Math.round(v));
  const offset = useTransform(spring, (v) => C * (1 - v / 100));

  const toggle = (id) =>
    setSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <Card glow className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Medidor */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative grid place-items-center">
          <svg width="180" height="180" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <motion.circle
              cx="70" cy="70" r={R} fill="none"
              stroke={toneStroke[nivel.tone]}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C}
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <motion.span className="font-display text-5xl font-bold">{shown}</motion.span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        <Badge variant={nivel.tone} className="mt-5">{nivel.label}</Badge>
        <p className="mt-2 max-w-[15rem] text-sm text-muted-foreground">{nivel.desc}</p>
      </div>

      {/* Controles */}
      <div>
        <h3 className="text-lg font-semibold">Arma tu Trust Score</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Activa las verificaciones que completarías y mira tu puntaje proyectado
          en vivo.
        </p>
        <div className="mt-5 space-y-2.5">
          {TRUST_ITEMS.map((item) => {
            const on = sel.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  on
                    ? "border-trust/50 bg-trust/10"
                    : "border-border bg-card/40 hover:border-border/80"
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-md border transition-all",
                    on ? "border-trust bg-trust text-[hsl(var(--primary-ink))]" : "border-border text-transparent"
                  )}
                >
                  <Check className="size-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className={cn("text-sm font-semibold", on ? "text-trust" : "text-muted-foreground")}>
                  +{item.pts}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}