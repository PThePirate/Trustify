import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TiltCard: inclina suavemente su contenido en 3D siguiendo el cursor y
 * proyecta un "spotlight" neón en la posición del mouse. Respeta
 * prefers-reduced-motion (se desactiva el tilt). Envuelve cualquier contenido
 * (por ejemplo una <Card>).
 */
export default function TiltCard({ children, className, max = 9, glow = true }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const mx = useMotionValue(0); // -0.5..0.5
  const my = useMotionValue(0);
  const px = useMotionValue(50); // % spotlight
  const py = useMotionValue(50);

  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${px}% ${py}%, hsl(var(--trust) / 0.16), transparent 60%)`;

  function onMove(e) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    mx.set(nx - 0.5);
    my.set(ny - 0.5);
    px.set(nx * 100);
    py.set(ny * 100);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    px.set(50);
    py.set(50);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("group/tilt relative h-full [perspective:1000px]", className)}
    >
      <motion.div
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full rounded-2xl"
      >
        {glow && (
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
