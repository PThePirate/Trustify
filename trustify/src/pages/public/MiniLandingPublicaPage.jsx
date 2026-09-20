import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin, Star, ShieldCheck, MessageCircle, FileText, Package,
  Loader2, ShieldAlert, CheckCircle2, XCircle, Store, Home, AlertCircle, X, Flag, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import { obtenerNegocioPublico } from "@/services/negocioApi";
import { crearSolicitud } from "@/services/solicitudApi";
import { reportarNegocio } from "@/services/denunciaApi";
import { isLoggedIn } from "@/services/authApi";

const NIVEL_LABEL = { semilla: "Semilla", asesoria: "En asesoría", formalizado: "Formalizado" };

function formatearPrecio(p) {
  return p === null || p === undefined ? "Precio a consultar" : `$${Number(p).toFixed(2)}`;
}

function urlWhatsApp(numero, mensaje) {
  const limpio = numero.replace(/\D/g, "");
  return `https://wa.me/593${limpio.replace(/^0/, "")}?text=${encodeURIComponent(mensaje)}`;
}

export default function MiniLandingPublicaPage() {
  const { slug } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [fechaEstimada, setFechaEstimada] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorSolicitud, setErrorSolicitud] = useState("");
  const [exitoSolicitud, setExitoSolicitud] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState("");
  const [exitoReporte, setExitoReporte] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNegocio(null);
    setError("");
    obtenerNegocioPublico(slug)
      .then(setNegocio)
      .catch((err) => setError(err.message));
  }, [slug]);

  function abrirSolicitud() {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setErrorSolicitud("");
    setMostrarForm(true);
  }

  async function enviarSolicitud(e) {
    e.preventDefault();
    setErrorSolicitud("");
    setEnviando(true);
    try {
      await crearSolicitud({
        negocioSlug: slug,
        descripcion,
        fechaEstimada: fechaEstimada || null,
      });
      setMostrarForm(false);
      setExitoSolicitud(true);
      setDescripcion("");
      setFechaEstimada("");
    } catch (err) {
      setErrorSolicitud(err.message || "No se pudo enviar la solicitud");
    } finally {
      setEnviando(false);
    }
  }

  function abrirReporte() {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setErrorReporte("");
    setMostrarReporte(true);
  }

  async function enviarReporte(e) {
    e.preventDefault();
    setErrorReporte("");
    setEnviandoReporte(true);
    try {
      await reportarNegocio({ negocioSlug: slug, motivo: motivoReporte });
      setMostrarReporte(false);
      setExitoReporte(true);
      setMotivoReporte("");
    } catch (err) {
      setErrorReporte(err.message || "No se pudo enviar el reporte");
    } finally {
      setEnviandoReporte(false);
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <ShieldAlert className="size-10 text-muted-foreground/50" />
        <h1 className="font-display text-xl font-bold">No encontramos este negocio</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
        <Link to="/">
          <Button variant="outline"><Home className="size-4" /> Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  if (!negocio) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="size-5 animate-spin" /> Cargando…
      </div>
    );
  }

  const iniciales = negocio.nombreComercial.split(" ").map((p) => p[0]).slice(0, 2).join("");
  // El sello "Emprendedor Verificado" es una afirmación de confianza — solo
  // se muestra si de verdad cumplió las 4 capas visibles, nunca por defecto.
  const emprendedorVerificado = negocio.capasVerificacion.every((c) => c.cumplida);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-3">
          {isLoggedIn() && (
            <>
              <NotificationBell />
              <Link to="/perfil" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <User className="size-4" /> Mi perfil
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Portada */}
      <div
        className="relative h-48 sm:h-64"
        style={{
          background: negocio.fotoPortadaUrl
            ? `url(${negocio.fotoPortadaUrl}) center/cover`
            : "linear-gradient(120deg, hsl(var(--trust)/0.25), hsl(var(--verified)/0.2))",
        }}
      />

      <div className="mx-auto max-w-3xl px-6">
        {/* Identidad */}
        <div className="-mt-12 flex items-end gap-4">
          <div className="grid size-24 shrink-0 place-items-center rounded-2xl border-4 border-background bg-trust/10 font-display text-2xl font-bold text-trust shadow-lg">
            {negocio.logoUrl ? (
              <img src={negocio.logoUrl} alt={negocio.nombreComercial} className="size-full rounded-2xl object-cover" />
            ) : iniciales}
          </div>
          <div className="mb-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{negocio.nombreComercial}</h1>
              {emprendedorVerificado && (
                <Badge variant="verified"><ShieldCheck className="size-3" /> Emprendedor Verificado</Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {negocio.categoria && <span>{negocio.categoria.nombre}</span>}
              {negocio.ciudad && (
                <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {negocio.ciudad}</span>
              )}
              <Badge variant="outline">{NIVEL_LABEL[negocio.nivelFormalizacion] ?? negocio.nivelFormalizacion}</Badge>
            </div>
          </div>
        </div>

        {negocio.descripcionCorta && (
          <p className="mt-4 text-muted-foreground">{negocio.descripcionCorta}</p>
        )}

        {/* Botones de acción */}
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={urlWhatsApp(negocio.whatsapp, `Hola, vi tu perfil de ${negocio.nombreComercial} en CheckBiz`)}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="verified" size="lg">
              <MessageCircle className="size-4" /> Contactar por WhatsApp
            </Button>
          </a>
          <Button variant="outline" size="lg" onClick={abrirSolicitud}>
            <FileText className="size-4" /> Iniciar Solicitud de Pedido
          </Button>
          <button
            onClick={abrirReporte}
            className="flex items-center gap-1.5 self-center text-sm text-muted-foreground hover:text-danger"
          >
            <Flag className="size-3.5" /> Reportar
          </button>
        </div>
        {exitoSolicitud && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-verified/30 bg-verified/10 px-3 py-2.5 text-sm text-verified">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>
              Solicitud enviada. El pago y la entrega se acuerdan directamente con el prestador, fuera de la app.{" "}
              <Link to="/mis-solicitudes" className="font-medium underline">Ver mis solicitudes</Link>
            </span>
          </div>
        )}
        {exitoReporte && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-pending/30 bg-pending/10 px-3 py-2.5 text-sm text-pending">
            <Flag className="mt-0.5 size-4 shrink-0" />
            Reporte enviado. Nuestro equipo lo va a revisar.
          </div>
        )}

        {/* Modal — nueva solicitud */}
        {mostrarForm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
            <div className="panel w-full max-w-md p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Solicitar a {negocio.nombreComercial}</h3>
                <button onClick={() => setMostrarForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <form onSubmit={enviarSolicitud} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">¿Qué necesitas?</label>
                  <textarea
                    required
                    rows={3}
                    minLength={5}
                    placeholder="Describe lo que necesitas…"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Fecha estimada (opcional)</label>
                  <input
                    type="date"
                    value={fechaEstimada}
                    onChange={(e) => setFechaEstimada(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  El pago y la entrega se acuerdan directamente con el prestador, fuera de la app.
                </p>
                {errorSolicitud && (
                  <p className="flex items-center gap-1.5 text-sm text-danger">
                    <AlertCircle className="size-4" /> {errorSolicitud}
                  </p>
                )}
                <Button type="submit" variant="trust" className="w-full" disabled={enviando}>
                  {enviando ? <Loader2 className="size-4 animate-spin" /> : "Enviar solicitud"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Modal — reportar negocio */}
        {mostrarReporte && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
            <div className="panel w-full max-w-md p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                  <Flag className="size-4 text-danger" /> Reportar {negocio.nombreComercial}
                </h3>
                <button onClick={() => setMostrarReporte(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <form onSubmit={enviarReporte} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">¿Qué pasó?</label>
                  <textarea
                    required
                    rows={4}
                    minLength={10}
                    placeholder="Cuéntanos con detalle qué ocurrió…"
                    value={motivoReporte}
                    onChange={(e) => setMotivoReporte(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tu reporte queda asociado a tu identidad verificada y lo revisa el equipo de CheckBiz — nunca es anónimo.
                </p>
                {errorReporte && (
                  <p className="flex items-center gap-1.5 text-sm text-danger">
                    <AlertCircle className="size-4" /> {errorReporte}
                  </p>
                )}
                <Button type="submit" variant="danger" className="w-full" disabled={enviandoReporte}>
                  {enviandoReporte ? <Loader2 className="size-4 animate-spin" /> : "Enviar reporte"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Trust Score + capas de verificación */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="panel p-5">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Star className="size-4 text-pending" /> Trust Score
            </p>
            <p className="mt-1 font-display text-4xl font-bold">{negocio.trustScore}<span className="text-lg text-muted-foreground">/100</span></p>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculado a partir de su verificación, reseñas y antigüedad en CheckBiz.
            </p>
          </div>
          <div className="panel p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-trust" /> Identidad verificada
            </p>
            <div className="space-y-1.5">
              {negocio.capasVerificacion.map((c) => (
                <div key={c.capa} className="flex items-center gap-2 text-sm">
                  {c.cumplida ? (
                    <CheckCircle2 className="size-4 text-verified" />
                  ) : (
                    <XCircle className="size-4 text-muted-foreground/40" />
                  )}
                  <span className={c.cumplida ? "" : "text-muted-foreground/60"}>{c.capa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Catálogo */}
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Package className="size-5" /> Catálogo
          </h2>
          {negocio.catalogo.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este negocio todavía no publicó su catálogo.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {negocio.catalogo.map((item) => (
                <div key={item.id} className="panel flex items-center justify-between p-4">
                  <span className="font-medium">{item.nombre}</span>
                  <span className="text-sm text-muted-foreground">{formatearPrecio(item.precioReferencial)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reseñas */}
        <div className="my-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Star className="size-5" /> Reseñas auditadas
          </h2>
          {negocio.totalResenas === 0 ? (
            <div className="panel flex flex-col items-center gap-1 py-10 text-center">
              <Store className="size-7 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Todavía no hay reseñas. Solo se habilitan de clientes con una solicitud confirmada.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="panel p-5">
                <p className="font-display text-2xl font-bold">{negocio.promedioResenas.toFixed(1)} ★</p>
                <p className="text-sm text-muted-foreground">{negocio.totalResenas} reseñas</p>
              </div>
              {negocio.resenas.map((r) => (
                <div key={r.id} className="panel p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.clienteNombre}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`size-3.5 ${n <= r.estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                  {r.comentario && <p className="mt-1.5 text-sm text-muted-foreground">{r.comentario}</p>}
                  {r.respuestaNegocio && (
                    <div className="mt-3 rounded-lg bg-trust/10 p-3 text-sm">
                      <p className="mb-0.5 text-xs font-semibold text-trust">Respuesta de {negocio.nombreComercial}</p>
                      {r.respuestaNegocio}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}