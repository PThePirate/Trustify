import { useEffect, useState } from "react";
import {
  Inbox, User, Calendar, MessageCircle, ChevronUp, Check, Ban,
  Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { misSolicitudesRecibidas, actualizarEstadoSolicitud } from "@/services/negocioApi";
import HiloMensajes from "@/components/mensajes/HiloMensajes";

const ESTADO_INFO = {
  enviada: { label: "Pendiente", variant: "pending" },
  en_conversacion: { label: "En conversación", variant: "trust" },
  confirmada: { label: "Confirmada por el cliente", variant: "verified" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BandejaSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState("");
  const [vista, setVista] = useState("pendientes");
  const [hiloAbiertoId, setHiloAbiertoId] = useState(null);

  function cargar() {
    misSolicitudesRecibidas().then(setSolicitudes).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function cambiarEstado(id, estado) {
    setProcesandoId(id);
    setError("");
    try {
      await actualizarEstadoSolicitud(id, estado);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  }

  const pendientes = solicitudes?.filter((s) => s.estado === "enviada") ?? [];
  const conversaciones = solicitudes?.filter((s) => s.estado !== "enviada") ?? [];
  const listaActual = vista === "pendientes" ? pendientes : conversaciones;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Mensajes</h1>
        <p className="mt-1 text-muted-foreground">
          El pago y la entrega se acuerdan directamente con el cliente, fuera de la app.
        </p>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        <button
          onClick={() => setVista("pendientes")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            vista === "pendientes" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Solicitudes pendientes{pendientes.length > 0 && ` (${pendientes.length})`}
        </button>
        <button
          onClick={() => setVista("conversaciones")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            vista === "conversaciones" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Conversaciones{conversaciones.length > 0 && ` (${conversaciones.length})`}
        </button>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}

      {solicitudes === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : listaActual.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium">
            {vista === "pendientes" ? "No tienes solicitudes nuevas por revisar" : "Todavía no tienes conversaciones abiertas"}
          </p>
          <p className="text-sm text-muted-foreground">
            {vista === "pendientes"
              ? "Cuando alguien te escriba desde tu perfil, aparecerá aquí para que la aceptes o la rechaces."
              : "Cuando aceptes una solicitud pendiente, la conversación aparece aquí."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listaActual.map((s) => {
            const info = ESTADO_INFO[s.estado] ?? { label: s.estado, variant: "outline" };
            const puedeGestionar = s.estado !== "confirmada" && s.estado !== "cancelada";
            return (
              <div key={s.id} className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <User className="size-4" /> {s.cliente.nombreCompleto}
                  </span>
                  <Badge variant={info.variant}>{info.label}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.descripcion}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Recibida el {formatearFecha(s.creadoEn)}</span>
                  {s.fechaEstimada && <span>Fecha estimada: {s.fechaEstimada}</span>}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {vista === "pendientes" ? (
                    <>
                      <Button
                        variant="verified"
                        size="sm"
                        onClick={() => cambiarEstado(s.id, "en_conversacion")}
                        disabled={procesandoId === s.id}
                      >
                        {procesandoId === s.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        Aceptar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-danger/30 text-danger hover:bg-danger/10"
                        onClick={() => cambiarEstado(s.id, "cancelada")}
                        disabled={procesandoId === s.id}
                      >
                        <Ban className="size-4" /> Rechazar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setHiloAbiertoId(hiloAbiertoId === s.id ? null : s.id)}
                      >
                        {hiloAbiertoId === s.id ? <ChevronUp className="size-4" /> : <MessageCircle className="size-4" />}
                        {hiloAbiertoId === s.id ? "Ocultar conversación" : "Ver conversación"}
                      </Button>

                      {puedeGestionar && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-danger/30 text-danger hover:bg-danger/10"
                          onClick={() => cambiarEstado(s.id, "cancelada")}
                          disabled={procesandoId === s.id}
                        >
                          <Ban className="size-4" /> No puedo atenderla
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {vista === "conversaciones" && hiloAbiertoId === s.id && (
                  <HiloMensajes solicitudId={s.id} estado={s.estado} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
