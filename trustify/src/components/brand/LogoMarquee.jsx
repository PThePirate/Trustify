import Marquee from "@/components/ui/Marquee";
import { ALIADOS } from "@/data/content";

/**
 * LogoMarquee: cinta continua con los logos reales de universidades e
 * institutos. Cada logo va sobre un tile claro con degradado suave (para que
 * se lea nítido en modo oscuro y claro sin verse como un bloque blanco plano).
 * La cinta lleva padding vertical para que la elevación + glow del hover NO se
 * recorten. Al pasar el cursor: la cinta se pausa y el tile se eleva, toma
 * brillo neón y el logo gana color y escala.
 */
export default function LogoMarquee() {
  return (
    <Marquee pauseOnHover className="py-12">
      {ALIADOS.map((a) => (
        <div
          key={a.nombre}
          title={a.nombre}
          className="group/logo flex h-32 min-w-[240px] cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-b from-white to-slate-100 px-10 shadow-[0_6px_24px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_38px_-12px_hsl(var(--trust)/0.6)] hover:ring-2 hover:ring-trust/60"
        >
          <img
            src={a.logo}
            alt={a.nombre}
            loading="lazy"
            className="h-16 w-auto max-w-[240px] object-contain opacity-95 grayscale-[0.15] transition-all duration-300 group-hover/logo:scale-[1.06] group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
          />
        </div>
      ))}
    </Marquee>
  );
}