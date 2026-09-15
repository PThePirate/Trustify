import { cn } from "@/lib/utils";

const TONES = {
  trust: "bg-trust/10 text-trust",
  verified: "bg-verified/10 text-verified",
  pending: "bg-pending/10 text-pending",
  danger: "bg-danger/10 text-danger",
  muted: "bg-muted text-muted-foreground",
};

/**
 * Tarjeta de métrica para el panel general. `tono` define el color del
 * ícono; `nota` es un texto pequeño debajo del valor (ej. "de 128 en total").
 */
export default function StatCard({ icon: Icon, etiqueta, valor, nota, tono = "trust", className }) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-center justify-between">
        <span className={cn("grid size-10 place-items-center rounded-xl", TONES[tono])}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold leading-none">{valor}</p>
      <p className="mt-1.5 text-sm font-medium text-foreground/80">{etiqueta}</p>
      {nota && <p className="mt-0.5 text-xs text-muted-foreground">{nota}</p>}
    </div>
  );
}