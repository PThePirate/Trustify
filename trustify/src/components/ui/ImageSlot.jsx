import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ImageSlot: contenedor de imagen con animaciones.
 * - Si le pasas `src`, muestra la imagen con zoom suave al hover (efecto Ken Burns).
 * - Si NO le pasas `src`, muestra un placeholder animado (degradado neón en
 *   movimiento + ícono + etiqueta) para que sepas qué foto va ahí.
 *
 * PARA REEMPLAZAR POR FOTOS REALES:
 *   1) Copia tus imágenes en /public/images  (ej. public/images/aura.jpg)
 *   2) Pasa la ruta:  <ImageSlot src="/images/aura.jpg" ... />
 *   Todo lo demás (zoom, overlay, caption) sigue funcionando igual.
 */
export default function ImageSlot({
  src,
  alt = "",
  label,
  caption,
  Icon = ImageIcon,
  className,
}) {
  return (
    <div className={cn("group/img relative overflow-hidden rounded-2xl", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-110"
        />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-gradient-x bg-[length:200%_200%] bg-gradient-to-br from-trust/30 via-trust-soft/20 to-verified/30 transition-transform duration-700 ease-out group-hover/img:scale-110" />
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute inset-0 grid place-content-center gap-2 px-4 text-center">
            <Icon className="mx-auto size-8 text-foreground/60" />
            {label && (
              <span className="text-xs font-medium text-foreground/70">
                {label}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wide text-foreground/40">
              Foto de ejemplo
            </span>
          </div>
        </div>
      )}

      {/* Caption que aparece al hover */}
      {caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 opacity-0 transition-all duration-300 group-hover/img:translate-y-0 group-hover/img:opacity-100">
          <p className="text-sm font-semibold text-white">{caption}</p>
        </div>
      )}
    </div>
  );
}