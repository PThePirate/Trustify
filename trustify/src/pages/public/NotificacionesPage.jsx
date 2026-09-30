import { useEffect, useState } from "react";
import { Bell, ShieldCheck, ShieldX, Flag, Store, Inbox, MessageCircle, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [filtro, setFiltro] = useState('todas');
  const [error, setError] = useState('');

  function cargar() {
    setError('');
    listarNotificaciones().then(setDatos).catch(() => setError('No pudimos cargar tus notificaciones. Inténtalo de nuevo.'));
  }
  useEffect(cargar, []);

  async function marcarUna(id) {
    try { await marcarNotificacionLeida(id); cargar(); window.dispatchEvent(new Event("checkbiz:notificaciones-actualizadas")); }
    catch { setError('No pudimos marcar esta notificación. Inténtalo de nuevo.'); }
  }

  async function marcarTodas() {
    setMarcandoTodas(true);
    try {
      await marcarTodasLeidas();
      cargar();
      window.dispatchEvent(new Event("checkbiz:notificaciones-actualizadas"));
    } catch {
      setError('No pudimos actualizar las notificaciones. Inténtalo de nuevo.');
    } finally {
      setMarcandoTodas(false);
    }
  }

  const visibles = datos?.items.filter(n => filtro === 'todas' || !n.leida) ?? [];

  return (
    <div className="client-inner-page client-notifications mx-auto max-w-5xl">
        <div className="client-page-heading mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="mb-4 inline-grid size-12 place-items-center rounded-2xl bg-pending/10 text-pending"><Bell className="size-6" /></span>
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

        {datos && <div className="mb-5 flex gap-2" role="group" aria-label="Filtrar notificaciones">{[['todas', 'Todas'], ['sin-leer', `Sin leer (${datos.noLeidas})`]].map(([id, label]) => <button key={id} type="button" aria-pressed={filtro === id} onClick={() => setFiltro(id)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filtro === id ? 'border-trust bg-trust/10 text-trust' : 'border-border bg-card text-muted-foreground hover:border-trust/40'}`}>{label}</button>)}</div>}

        {error && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm"><span>{error}</span><Button variant="outline" size="sm" onClick={cargar}>Reintentar</Button></div>}

        {!datos && !error ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
        ) : !datos ? null : visibles.length === 0 ? (
          <><div className="client-empty panel flex flex-col items-center gap-3 px-5 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-pending/10 text-pending"><Bell className="size-8" /></span>
            <p className="font-medium">{filtro === 'sin-leer' ? 'Ya leíste todas tus notificaciones' : 'Sin notificaciones todavía'}</p>
            <p className="max-w-sm text-sm text-muted-foreground">{filtro === 'sin-leer' ? 'Puedes volver a ver las anteriores en Todas.' : 'Aquí aparecerán respuestas a tus solicitudes y avisos sobre tu cuenta.'}</p>
          </div><div className="client-notice-tip"><CheckCheck className="size-5" /><div><strong>Todo al día</strong><p>Cuando un negocio responda o haya novedades en tu cuenta, aparecerán en este espacio.</p></div></div></>
        ) : (
          <div className="space-y-2">
            {visibles.map((n) => {
              const conf = ICONOS[n.tipo] || { Icon: MessageCircle, tono: "text-muted-foreground bg-muted" };
              return (
                <button
                  key={n.id}
                  onClick={() => !n.leida && marcarUna(n.id)}
                  className={`panel panel-hover flex w-full items-start gap-3 border-l-4 p-4 text-left ${!n.leida ? "border-l-red-600 bg-red-600/15 ring-1 ring-red-600/30" : "border-l-transparent bg-muted/20 opacity-65"}`}
                >
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${conf.tono}`}>
                    <conf.Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.titulo}</p>
                      {!n.leida && <span className="size-2 rounded-full bg-red-600" />}
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
  );
}
