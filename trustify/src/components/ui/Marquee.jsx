import { cn } from "@/lib/utils";

/**
 * Marquee: bucle horizontal infinito y SIN saltos.
 * Se duplica el contenido y se anima a -50%. La clave para que el empalme sea
 * perfecto: cada copia lleva un padding-right igual al gap interno, de modo que
 * el "hueco" tras la última etiqueta es idéntico al de las demás. Así, cuando
 * termina la última (Mantenimiento) entra de inmediato la primera (Diseño).
 */
export default function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
}) {
  return (
    <div className={cn("group/marquee fade-edges overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]"
        )}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0 gap-4 pr-4">{children}</div>
        <div className="flex shrink-0 gap-4 pr-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}