import { cn } from "@/lib/utils";

/**
 * AuroraBackground: manchas de color desenfocadas que se mueven lento en el
 * fondo. Optimizado: 2 manchas (en vez de 3) y más pequeñas para reducir el
 * tamaño de las texturas de blur en GPU (menos memoria). Se coloca detrás del
 * contenido (pointer-events-none).
 */
export default function AuroraBackground({ className }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="aurora-blob animate-aurora"
        style={{
          top: "-6%",
          left: "10%",
          width: "30vw",
          height: "30vw",
          background:
            "radial-gradient(circle, hsl(var(--trust) / 0.5), transparent 60%)",
        }}
      />
      <div
        className="aurora-blob animate-aurora"
        style={{
          bottom: "-8%",
          right: "6%",
          width: "28vw",
          height: "28vw",
          animationDelay: "-9s",
          background:
            "radial-gradient(circle, hsl(var(--trust-soft) / 0.42), transparent 60%)",
        }}
      />
    </div>
  );
}