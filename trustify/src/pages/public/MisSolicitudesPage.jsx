import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText, Loader2, CheckCircle2, Star, AlertCircle, Home,
  Calendar, Store, MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { misSolicitudes, confirmarSolicitud, dejarResena } from "@/services/solicitudApi";

const ESTADO_INFO = {
  enviada: { label: "Enviada", variant: "pending" },
  en_conversacion: { label: "En conversación", variant: "trust" },
  confirmada: { label: "Confirmada", variant: "verified" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

function FormularioResena({ solicitudId, onListo }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await dejarResena(solicitudId, { estrellas, comentario: comentario || undefined });
      onListo();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-3 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium">Deja tu reseña auditada</p>
      <p className="text-xs text-muted-foreground">
        Solo puedes reseñar porque confirmaste una solicitud real — por eso tus reseñas son confiables.
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setEstrellas(n)}>
            <Star className={`size-6 ${n <= estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="¿Cómo te fue? (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}
      <Button type="submit" variant="trust" size="sm" disabled={enviando}>
        {enviando ? <Loader2 className="size-4 animate-spin" /> : "Publicar reseña"}
      </Button>
    </form>
  );
}

export default function MisSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    misSolicitudes().then(setSolicitudes).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function confirmar(id) {
    setConfirmandoId(id);
    setError("");
    try {
      await confirmarSolicitud(id);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Mis solicitudes</h1>
          <p className="mt-1 text-muted-foreground">
            El pago y la entrega se acuerdan directamente con el prestador, fuera de la app.
          </p>
        </div>

        {error && (
          <p className="mb-4 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
        )}

        {solicitudes === null ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
        ) : solicitudes.length === 0 ? (
          <div className="panel flex flex-col items-center gap-2 py-16 text-center">
            <FileText className="size-8 text-muted-foreground/50" />
            <p className="font-medium">Todavía no has hecho ninguna solicitud</p>
            <Link to="/buscar" className="mt-2">
              <Button variant="trust" size="sm"><Home className="size-4" /> Buscar negocios</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((s) => {
              const info = ESTADO_INFO[s.estado] ?? { label: s.estado, variant: "outline" };
              return (
                <div key={s.id} className="panel p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link to={`/negocio/publico/${s.negocio.slug}`} className="flex items-center gap-1.5 font-semibold hover:text-trust">
                      <Store className="size-4" /> {s.negocio.nombreComercial}
                    </Link>
                    <Badge variant={info.variant}>{info.label}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.descripcion}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Enviada el {formatearFecha(s.creadoEn)}</span>
                    {s.fechaEstimada && <span>Fecha estimada: {s.fechaEstimada}</span>}
                  </div>

                  {s.estado !== "confirmada" && s.estado !== "cancelada" && (
                    <Button
                      variant="verified"
                      size="sm"
                      className="mt-3"
                      onClick={() => confirmar(s.id)}
                      disabled={confirmandoId === s.id}
                    >
                      {confirmandoId === s.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      Confirmar que recibí el producto/servicio
                    </Button>
                  )}

                  {s.estado === "confirmada" && !s.resena && (
                    <FormularioResena solicitudId={s.id} onListo={cargar} />
                  )}

                  {s.resena && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/30 p-3">
                      <MessageSquareText className="mt-0.5 size-4 shrink-0 text-verified" />
                      <div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`size-3.5 ${n <= s.resena.estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                        {s.resena.comentario && <p className="mt-1 text-sm text-muted-foreground">{s.resena.comentario}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}