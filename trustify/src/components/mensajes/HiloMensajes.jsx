import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Lock, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarMensajes, enviarMensaje } from "@/services/solicitudApi";

/**
 * Hilo de chat de una solicitud — usado tanto en "Mensajes" del cliente
 * como en "Mensajes" del emprendedor, ya que ambos hablan con el mismo
 * endpoint (/api/solicitudes/{id}/mensajes) sin importar de qué lado
 * de la conversación esté cada quien.
 */
export default function HiloMensajes({ solicitudId, estado }) {
  const [mensajes, setMensajes] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const finRef = useRef(null);
  // El polling y el refresco tras enviar pueden solaparse; si una respuesta
  // vieja llega después de una más nueva, no debe pisarla con datos stale.
  const peticionRef = useRef(0);

  function cargar() {
    const idPeticion = ++peticionRef.current;
    listarMensajes(solicitudId)
      .then((data) => {
        if (peticionRef.current === idPeticion) setMensajes(data);
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 6000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudId]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "nearest" });
  }, [mensajes]);

  async function enviar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    setError("");
    try {
      await enviarMensaje(solicitudId, texto.trim());
      setTexto("");
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  const puedeEscribir = estado === "en_conversacion";

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/20">
      <div className="max-h-72 space-y-2 overflow-y-auto p-3">
        {mensajes === null ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Cargando conversación…
          </div>
        ) : mensajes.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Todavía no hay mensajes.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={`flex ${m.esMio ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.esMio ? "bg-trust text-white" : "border border-border bg-background"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.cuerpo}</p>
                <p className={`mt-0.5 text-[10px] ${m.esMio ? "text-white/70" : "text-muted-foreground"}`}>
                  {new Date(m.creadoEn).toLocaleString("es-EC", {
                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={finRef} />
      </div>

      <div className="border-t border-border p-3">
        {puedeEscribir ? (
          <form onSubmit={enviar} className="flex items-end gap-2">
            <textarea
              rows={1}
              placeholder="Escribe un mensaje…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="flex-1 resize-none rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" size="sm" variant="trust" disabled={enviando || !texto.trim()}>
              {enviando ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </form>
        ) : estado === "enviada" ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> Esperando que el negocio acepte tu solicitud para poder conversar.
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> Esta conversación está cerrada.
          </p>
        )}
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
            <AlertCircle className="size-3.5" /> {error}
          </p>
        )}
      </div>
    </div>
  );
}
