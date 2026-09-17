import { useEffect, useState } from "react";
import {
  Inbox, User, Calendar, MessageCircle, MessageSquareDot, Ban,
  Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { misSolicitudesRecibidas, actualizarEstadoSolicitud } from "@/services/negocioApi";

const ESTADO_INFO = {
  enviada: { label: "Nueva", variant: "pending" },
  en_conversacion: { label: "En conversación", variant: "trust" },
  confirmada: { label: "Confirmada por el cliente", variant: "verified" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

function urlWhatsApp(telefono, mensaje) {
  // telefono ya viene completo en formato E.164 sin '+' (ej. "593991234567")
  // desde Usuario.telefono — antes esto forzaba siempre el prefijo de
  // Ecuador (593), lo que rompía con cualquier otro país del selector.
  const limpio = (telefono || "").replace(/\D/g, "");
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}

export default function BandejaSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Solicitudes recibidas</h1>
        <p className="mt-1 text-muted-foreground">
          El pago y la entrega se acuerdan directamente con el cliente, fuera de la app.
        </p>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}

      {solicitudes === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : solicitudes.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no has recibido solicitudes</p>
          <p className="text-sm text-muted-foreground">Cuando alguien te escriba desde tu perfil, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => {
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
                  <a
                    href={urlWhatsApp(s.cliente.telefono, `Hola ${s.cliente.nombreCompleto}, te escribo por tu solicitud en CheckBiz`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="verified" size="sm">
                      <MessageCircle className="size-4" /> Contactar por WhatsApp
                    </Button>
                  </a>

                  {puedeGestionar && s.estado === "enviada" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(s.id, "en_conversacion")}
                      disabled={procesandoId === s.id}
                    >
                      {procesandoId === s.id ? <Loader2 className="size-4 animate-spin" /> : <MessageSquareDot className="size-4" />}
                      Marcar "en conversación"
                    </Button>
                  )}

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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}