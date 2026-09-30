import { useEffect, useRef, useState } from "react";

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 800;

// Muestra el primer viewport de la página publicada, sin ampliar su portada.
export default function MiniLandingFirstView({ slug, nombre }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[8/5] w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-trust/10"
      aria-label={`Primer vistazo de la Mini Landing publicada de ${nombre}`}
    >
      {width > 0 && (
        <iframe
          key={slug}
          title={`Vista previa de la Mini Landing de ${nombre}`}
          src={`/negocio/publico/${encodeURIComponent(slug)}?vistaPrevia=1`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, transform: `scale(${width / PREVIEW_WIDTH})` }}
        />
      )}
    </div>
  );
}
