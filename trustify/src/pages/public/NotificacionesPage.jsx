import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ShieldCheck, ShieldX, Flag, Store, Inbox, MessageCircle, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { listarNotificaciones, marcarNotificacionLeida, marcarTodasLeidas } from "@/services/authApi";

const ICONOS = {
  kyc_aprobado: { Icon: ShieldCheck, tono: "text-verified bg-verified/10" },
  kyc_rechazado: { Icon: ShieldX, tono: "text-danger bg-danger/10" },
  denuncia: { Icon: Flag, tono: "text-pending bg-pending/10" },
  negocio: { Icon: Store, tono: "text-trust bg-trust/10" },
  solicitud: { Icon: Inbox, tono: "text-trust bg-trust/10" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-EC", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function NotificacionesPage() {
  const [datos, setDatos] = useState(null);
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  function cargar() {
    listarNotificaciones().then(setDatos);
  }
  useEffect(cargar, []);

  async function marcarUna(id) {
    await marcarNotificacionLeida(id);
    cargar();
  }

  async function marcarTodas() {
    setMarcandoTodas(true);
    try {
      await marcarTodasLeidas();
      cargar();
    } finally {
      setMarcandoTodas(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Notificaciones</h1>
            {datos && (
              <p className="mt-1 text-muted-foreground">
                {datos.noLeidas > 0 ? `${datos.noLeidas} sin leer` : "Todo al día"}
              </p>
            )}
          </div>
          {datos && datos.noLeidas > 0 && (
            <Button variant="outline" size="sm" onClick={marcarTodas} disabled={marcandoTodas}>
              {marcandoTodas ? <Loader2 className="size-4 animate-spin" /> : <CheckCheck className="size-4" />}
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {!datos ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
        ) : datos.items.length === 0 ? (
          <div className="panel flex flex-col items-center gap-2 py-16 text-center">
            <Bell className="size-8 text-muted-foreground/50" />
            <p className="font-medium">Sin notificaciones todavía</p>
          </div>
        ) : (
          <div className="space-y-2">
            {datos.items.map((n) => {
              const conf = ICONOS[n.tipo] || { Icon: MessageCircle, tono: "text-muted-foreground bg-muted" };
              return (
                <button
                  key={n.id}
                  onClick={() => !n.leida && marcarUna(n.id)}
                  className={`panel flex w-full items-start gap-3 p-4 text-left ${!n.leida ? "border-trust/30 bg-trust/5" : ""}`}
                >
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${conf.tono}`}>
                    <conf.Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.titulo}</p>
                      {!n.leida && <span className="size-2 rounded-full bg-trust" />}
                    </div>
                    {n.mensaje && <p className="mt-0.5 text-sm text-muted-foreground">{n.mensaje}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{formatearFecha(n.creadoEn)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}