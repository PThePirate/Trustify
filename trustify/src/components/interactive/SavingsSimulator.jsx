import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { TrendingUp, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TASAS = [8, 12, 20]; // % de comisión típica en otras plataformas

function useAnimated(value) {
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  useEffect(() => spring.set(value), [value, spring]);
  return useTransform(spring, (v) =>
    Math.round(v).toLocaleString("es-EC")
  );
}

export default function SavingsSimulator() {
  const [ventas, setVentas] = useState(1500);
  const [tasa, setTasa] = useState(12);

  const mensual = Math.round((ventas * tasa) / 100);
  const anual = mensual * 12;

  const mAnim = useAnimated(mensual);
  const aAnim = useAnimated(anual);

  return (
    <Card className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
      {/* Controles */}
      <div>
        <h3 className="text-lg font-semibold">¿Cuánto ahorras sin comisiones?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Mueve el slider con tus ventas mensuales y compáralo con lo que te
          cobraría una plataforma con comisión.
        </p>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Ventas mensuales</label>
            <span className="font-display text-xl font-bold text-trust">
              ${ventas.toLocaleString("es-EC")}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={ventas}
            onChange={(e) => setVentas(Number(e.target.value))}
            className="mt-3 w-full accent-[hsl(var(--trust))]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>$100</span>
            <span>$10.000</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Comisión de la otra plataforma</p>
          <div className="flex gap-2">
            {TASAS.map((t) => (
              <button
                key={t}
                onClick={() => setTasa(t)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-sm font-semibold transition-all",
                  tasa === t
                    ? "border-trust/50 bg-trust/10 text-trust"
                    : "border-border bg-card/40 text-muted-foreground hover:border-border/80"
                )}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="grid grid-rows-2 gap-4">
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4 text-danger" /> En otra plataforma pagarías
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-danger">
            $<motion.span>{aAnim}</motion.span>
            <span className="text-lg text-muted-foreground"> / año</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ≈ $<motion.span>{mAnim}</motion.span> cada mes en comisiones
          </p>
        </div>
        <div className="hairline-gradient rounded-2xl bg-verified/5 p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ban className="size-4 text-verified" /> En Trustify pagas
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-verified">
            $0<span className="text-lg text-muted-foreground"> en comisiones</span>
          </p>
          <p className="mt-1 text-xs text-verified">
            Ahorras $<motion.span>{aAnim}</motion.span> al año.
          </p>
        </div>
      </div>
    </Card>
  );
}
