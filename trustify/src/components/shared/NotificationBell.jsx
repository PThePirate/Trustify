import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ShieldCheck, ShieldX, Flag, Store, MessageCircle } from "lucide-react";
import { listarNotificaciones, marcarNotificacionLeida } from "@/services/authApi";

const ICONOS = {
  kyc_aprobado: { Icon: ShieldCheck, tono: "text-verified bg-verified/10" },
  kyc_rechazado: { Icon: ShieldX, tono: "text-danger bg-danger/10" },
  denuncia: { Icon: Flag, tono: "text-pending bg-pending/10" },
  negocio: { Icon: Store, tono: "text-trust bg-trust/10" },
};

function tiempoRelativo(iso) {
  const horas = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (horas < 1) return "Hace unos minutos";
  if (horas < 24) return `Hace ${horas} h`;
  return `Hace ${Math.floor(horas / 24)} d`;
}

export default function NotificationBell({ to = "/notificaciones" }) {
  const [datos, setDatos] = useState({ noLeidas: 0, items: [] });
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  function cargar() {
    listarNotificaciones().then(setDatos).catch(() => {});
  }
  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 6000);
    window.addEventListener("checkbiz:notificaciones-actualizadas", cargar);
    return () => { clearInterval(intervalo); window.removeEventListener("checkbiz:notificaciones-actualizadas", cargar); };
  }, []);

  useEffect(() => {
    function fuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  async function abrirYMarcar(notif) {
    if (!notif.leida) {
      await marcarNotificacionLeida(notif.id);
      cargar();
      window.dispatchEvent(new Event("checkbiz:notificaciones-actualizadas"));
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAbierto((a) => !a)}
        aria-label={datos.noLeidas ? `${datos.noLeidas} notificaciones sin leer` : "Notificaciones"}
        className={`relative grid size-10 place-items-center rounded-xl transition-colors ${datos.noLeidas ? "bg-red-600 text-white shadow-md shadow-red-600/30 hover:bg-red-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
      >
        <Bell className="size-[18px]" />
        {datos.noLeidas > 0 && (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-card bg-red-700 px-1 text-[10px] font-extrabold text-white">
            {datos.noLeidas > 9 ? "9+" : datos.noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notificaciones</p>
          </div>
          <div className="max-h-80 overflow-auto">
            {datos.items.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Sin notificaciones todavía.</p>
            ) : (
              datos.items.slice(0, 5).map((n) => {
                const conf = ICONOS[n.tipo] || { Icon: MessageCircle, tono: "text-muted-foreground bg-muted" };
                return (
                  <button
                    key={n.id}
                    onClick={() => abrirYMarcar(n)}
                    className={`flex w-full items-start gap-2.5 border-b border-border/60 p-3 text-left last:border-0 hover:bg-muted/50 ${!n.leida ? "bg-red-600/15 font-semibold" : "opacity-70"}`}
                  >
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${conf.tono}`}>
                      <conf.Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.titulo}{!n.leida && <span className="ml-2 inline-block size-2 rounded-full bg-red-600" />}</p>
                      {n.mensaje && <p className="line-clamp-2 text-xs text-muted-foreground">{n.mensaje}</p>}
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{tiempoRelativo(n.creadoEn)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <Link
            to={to}
            onClick={() => setAbierto(false)}
            className="block border-t border-border p-2.5 text-center text-xs font-medium text-trust hover:underline"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}
