import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Loader2, Send, Lock, Clock, AlertCircle, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarMensajes, enviarMensaje } from "@/services/solicitudApi";
import { imagenPerfilPublico } from "@/services/perfilPublicoApi";
import TarjetaPerfilChat from "@/components/mensajes/TarjetaPerfilChat";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

function TextoMensaje({ texto }) {
  return <p className="whitespace-pre-wrap break-words">{texto.split(/(https?:\/\/[^\s]+)/g).map((parte, i) => /^https?:\/\//.test(parte) ? <a key={i} href={parte} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">{parte}</a> : parte)}</p>;
}

/**
 * Hilo de chat de una solicitud — usado tanto en "Mensajes" del cliente
 * como en "Mensajes" del emprendedor, ya que ambos hablan con el mismo
 * endpoint (/api/solicitudes/{id}/mensajes) sin importar de qué lado
 * de la conversación esté cada quien.
 */
export default function HiloMensajes({ solicitudId, estado, respuestasRapidas = false, amplio = false, avatarNegocioUrl = null, esVistaNegocio = false }) {
  const [mensajes, setMensajes] = useState(null);
  const [texto, setTexto] = useState("");
  const [emojisAbiertos, setEmojisAbiertos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [primerMensajeEnviado, setPrimerMensajeEnviado] = useState(false);
  const [error, setError] = useState("");
  const [perfilAbiertoId, setPerfilAbiertoId] = useState(null);
  const [perfilContexto, setPerfilContexto] = useState(null);
  const finRef = useRef(null);
  const textareaRef = useRef(null);
  const formRef = useRef(null);
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

  useLayoutEffect(() => {
    const campo = textareaRef.current;
    if (!campo) return;
    campo.style.height = "auto";
    campo.style.height = `${Math.min(campo.scrollHeight, 200)}px`;
    campo.style.overflowY = campo.scrollHeight > 200 ? "auto" : "hidden";
  }, [texto]);

  async function enviar(e) {
    e.preventDefault();
    if (enviando || !texto.trim()) return;
    setEnviando(true);
    setError("");
    try {
      await enviarMensaje(solicitudId, texto.trim());
      setPrimerMensajeEnviado(true);
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
    <div className={`mt-3 overflow-hidden rounded-xl border border-border bg-muted/10 ${amplio ? "flex h-[min(70vh,650px)] min-h-[450px] flex-col" : ""}`}>
      <div className={`space-y-2 overflow-y-auto p-3 sm:p-4 ${amplio ? "min-h-0 flex-1" : "max-h-72"}`}>
        {mensajes === null ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Cargando conversación…
          </div>
        ) : mensajes.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Todavía no hay mensajes.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={`group flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50 ${m.esMio ? "bg-trust/5" : ""}`}>
              <button type="button" onClick={() => { setPerfilContexto(m.esMio === esVistaNegocio ? "emprendedor" : "cliente"); setPerfilAbiertoId(m.autor.id); }} aria-label={`Ver perfil de ${m.autor.nombreUsuario || m.autor.nombreCompleto}`} className={`grid size-9 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold hover:ring-2 hover:ring-trust ${m.esMio ? "bg-trust/20 text-trust" : "bg-muted text-foreground"}`}>{avatarNegocioUrl && m.esMio === esVistaNegocio ? <img src={avatarNegocioUrl} alt="" className="size-full object-cover" /> : m.autor.tieneFoto ? <img src={imagenPerfilPublico(m.autor.id, "foto")} alt="" className="size-full object-cover" /> : m.autor.nombreCompleto.slice(0, 2).toUpperCase()}</button>
              <div
                className="min-w-0 flex-1 text-sm"
              >
                <p className="mb-1 flex flex-wrap items-baseline gap-2"><button type="button" onClick={() => { setPerfilContexto(m.esMio === esVistaNegocio ? "emprendedor" : "cliente"); setPerfilAbiertoId(m.autor.id); }} className={`font-bold hover:underline ${m.esMio ? "text-trust" : "text-foreground"}`}>{m.autor.nombreUsuario || m.autor.nombreCompleto}</button><span className="text-[10px] text-muted-foreground">
                  {new Date(m.creadoEn).toLocaleString("es-EC", {
                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </span></p>
                <TextoMensaje texto={m.cuerpo} />
              </div>
            </div>
          ))
        )}
        <div ref={finRef} />
      </div>
      {perfilAbiertoId && <TarjetaPerfilChat usuarioId={perfilAbiertoId} contexto={perfilContexto} onClose={() => setPerfilAbiertoId(null)} />}
      {emojisAbiertos && <div className="fixed inset-0 z-[90] flex items-end justify-end bg-black/35 p-3 sm:p-8" onMouseDown={e => { if (e.target === e.currentTarget) setEmojisAbiertos(false); }}><div role="dialog" aria-label="Elegir emoji" className="w-full max-w-[400px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl"><Suspense fallback={<p className="p-5 text-sm text-muted-foreground">Cargando emojis…</p>}><EmojiPicker onEmojiClick={(dato) => { setTexto(t => `${t}${dato.emoji}`); setEmojisAbiertos(false); textareaRef.current?.focus(); }} emojiStyle="google" theme="auto" searchPlaceHolder="Buscar emoji" lazyLoadEmojis width="100%" height={420} previewConfig={{ showPreview: false }} /></Suspense></div></div>}

      <div className="border-t border-border p-3">
        {puedeEscribir ? (
          <>
          {respuestasRapidas && mensajes !== null && !primerMensajeEnviado && !mensajes.some(m => m.esMio) && <div className="mb-3 flex flex-wrap gap-2">{["¡Gracias por contactarnos! Cuéntame más sobre lo que necesitas.", "Con gusto puedo enviarte una cotización.", "¿Qué fecha te vendría bien para coordinar el servicio?"].map((mensaje) => <button type="button" key={mensaje} onClick={() => setTexto(mensaje)} className="rounded-full border border-trust/30 bg-trust/10 px-3 py-1.5 text-left text-xs text-trust transition-colors hover:bg-trust/20">{mensaje}</button>)}</div>}
          <form ref={formRef} onSubmit={enviar} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Escribe un mensaje…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); formRef.current?.requestSubmit(); } }}
              maxLength={1000}
              className="min-h-10 min-w-0 flex-1 resize-none rounded-lg border border-input bg-background p-2.5 text-sm leading-5 outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => setEmojisAbiertos(v => !v)} aria-label="Elegir emoji" aria-expanded={emojisAbiertos} className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:text-trust"><Smile className="size-4" /></button>
            <Button type="submit" size="sm" variant="trust" disabled={enviando || !texto.trim()}>
              {enviando ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </form>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Solo texto, emojis y enlaces. No se admiten imágenes, GIF ni archivos.</p>
          </>
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

