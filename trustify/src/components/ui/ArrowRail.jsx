import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ArrowRail({ children, label, className = "" }) {
  const rail = useRef(null);
  const timer = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  function stop() {
    clearInterval(timer.current);
    timer.current = null;
    if (rail.current) rail.current.style.scrollSnapType = "";
  }
  useEffect(() => {
    const node = rail.current;
    const update = () => setEdges({ left: node.scrollLeft > 2, right: node.scrollLeft + node.clientWidth < node.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    for (const child of node.children) observer.observe(child);
    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("blur", stop);
    update();
    return () => { stop(); observer.disconnect(); node.removeEventListener("scroll", update); window.removeEventListener("blur", stop); };
  }, [children]);
  function start(event, direction) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    stop();
    const node = rail.current;
    node.style.scrollSnapType = "none";
    node.scrollBy({ left: direction * Math.min(240, node.clientWidth * .75), behavior: "instant" });
    timer.current = setInterval(() => node.scrollBy({ left: direction * 14, behavior: "instant" }), 30);
  }
  return <div className="catalog-arrow-rail">
    <div className="catalog-rail-controls" aria-label={`Desplazar ${label}`}>
      {[-1, 1].map(direction => <button key={direction} type="button" disabled={direction < 0 ? !edges.left : !edges.right}
        aria-label={`${direction < 0 ? "Anterior" : "Siguiente"}: ${label}`}
        onPointerDown={event => start(event, direction)} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}
        onClick={event => { if (event.detail === 0) rail.current.scrollBy({ left: direction * rail.current.clientWidth * .8, behavior: "smooth" }); }}>
        {direction < 0 ? <ChevronLeft/> : <ChevronRight/>}
      </button>)}
    </div>
    <div ref={rail} className={`catalog-rail ${className}`} role="region" aria-label={label} tabIndex={0}>{children}</div>
  </div>;
}
