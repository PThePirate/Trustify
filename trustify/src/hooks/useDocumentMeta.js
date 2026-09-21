import { useEffect } from "react";

const TITULO_BASE = "CheckBiz — Confianza para hacer negocios";
const DESCRIPCION_BASE = "CheckBiz — Negocios reales, identidad verificada y contacto directo.";

/**
 * F2 — SEO por página: cambia <title> y <meta name="description"> mientras
 * el componente está montado, y los restaura al desmontar (para que
 * navegar de vuelta al listado no deje el título de un negocio pegado).
 * Sin dependencias nuevas: en una SPA sin SSR esto ayuda al compartir
 * enlaces y a un crawler que ejecute JS, pero no reemplaza server-side
 * rendering para SEO exhaustivo.
 */
export function useDocumentMeta(titulo, descripcion) {
  useEffect(() => {
    if (!titulo) return;
    const tituloAnterior = document.title;
    document.title = titulo;

    let meta = document.querySelector('meta[name="description"]');
    const descripcionAnterior = meta?.getAttribute("content");
    if (descripcion) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", descripcion);
    }

    return () => {
      document.title = tituloAnterior;
      if (meta && descripcionAnterior !== undefined) {
        meta.setAttribute("content", descripcionAnterior ?? DESCRIPCION_BASE);
      }
    };
  }, [titulo, descripcion]);
}

export { TITULO_BASE, DESCRIPCION_BASE };
