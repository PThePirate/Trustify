import { useEffect, useState } from "react";
import {
  ShieldCheck, Clock, Check, X, AlertCircle, User, Mail, CreditCard,
  Calendar, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listarFotos, decidirFoto, obtenerFotoVerificacionUrl } from "@/services/adminApi";

const TABS = [
  { value: "en_revision", label: "En revisión", icon: Clock },
  { value: "aprobada", label: "Aprobadas", icon: ShieldCheck },
  { value: "rechazada", label: "Rechazadas", icon: X },
];

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-EC", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/** Modal simple de rechazo: pide el motivo (obligatorio en el backend). */
function ModalRechazo({ abierto, onCancelar, onConfirmar, enviando }) {
  const [motivo, setMotivo] = useState("");
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="panel w-full max-w-md p-6">
        <h3 className="font-display text-lg font-bold">Rechazar verificación</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          El usuario verá este motivo y podrá volver a intentarlo.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Ej: La foto no muestra la cédula con claridad"
          className="mt-4 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => motivo.trim() && onConfirmar(motivo.trim())}
            disabled={!motivo.trim() || enviando}
          >
            {enviando ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Rechazar verificación
          </Button>
        </div>
      </div>
    </div>
  );
}

function MiniaturaFoto({ id }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    let cancelado = false;
    setError(false);
    obtenerFotoVerificacionUrl(id)
      .then((u) => {
        if (cancelado) {
          URL.revokeObjectURL(u);
          return;
        }
        objectUrl = u;
        setUrl(u);
      })
      .catch(() => !cancelado && setError(true));
    return () => {
      cancelado = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-danger/30 bg-danger/10 text-danger sm:size-24">
        <AlertCircle className="size-6" />
      </div>
    );
  }

  if (!url) {
    return <div className="size-20 shrink-0 animate-pulse rounded-xl bg-muted/40 sm:size-24" />;
  }

  return (
    <img
      src={url}
      alt="Selfie con cédula"
      className="size-20 shrink-0 rounded-xl border border-border object-cover sm:size-24"
    />
  );
}

function TarjetaVerificacion({ item, onAprobar, onRechazar, procesando }) {
  const { usuario } = item;
  return (
    <div className="panel panel-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <MiniaturaFoto id={item.id} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-bold">{usuario.nombreCompleto}</h3>
          {item.estado === "en_revision" && <Badge variant="pending">En revisión</Badge>}
          {item.estado === "aprobada" && <Badge variant="verified">Aprobada</Badge>}
          {item.estado === "rechazada" && <Badge variant="outline" className="border-danger/30 text-danger">Rechazada</Badge>}
        </div>

        <div className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="flex items-center gap-1.5">
            <CreditCard className="size-3.5" /> {usuario.cedula}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="size-3.5" /> {usuario.correo}
          </span>
          <span className="flex items-center gap-1.5 sm:col-span-2">
            <Calendar className="size-3.5" /> Foto subida el {formatearFecha(item.creadoEn)}
          </span>
        </div>

        {item.estado === "rechazada" && item.motivoRechazo && (
          <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {item.motivoRechazo}
          </p>
        )}
      </div>

      {item.estado === "en_revision" && (
        <div className="flex shrink-0 gap-2">
          <Button variant="verified" size="sm" onClick={() => onAprobar(item.id)} disabled={procesando}>
            {procesando ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Aprobar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-danger/40 text-danger hover:bg-danger/10"
            onClick={() => onRechazar(item.id)}
            disabled={procesando}
          >
            <X className="size-4" /> Rechazar
          </Button>
        </div>
      )}
    </div>
  );
}

export default function KycQueuePage() {
  const [tab, setTab] = useState("en_revision");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [modalId, setModalId] = useState(null);
  const [toast, setToast] = useState(null);

  async function cargar() {
    setCargando(true);
    const res = await listarFotos(tab);
    setItems(res.items);
    setTotal(res.total);
    setCargando(false);
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function mostrarToast(texto, tipo = "verified") {
    setToast({ texto, tipo });
    setTimeout(() => setToast(null), 3200);
  }

  async function aprobar(id) {
    setProcesandoId(id);
    try {
      await decidirFoto(id, { estado: "aprobada" });
      mostrarToast("Verificación aprobada. El usuario subió a Capa 3.");
      cargar();
    } catch (err) {
      mostrarToast(err.message, "danger");
    } finally {
      setProcesandoId(null);
    }
  }

  async function confirmarRechazo(motivo) {
    setProcesandoId(modalId);
    try {
      await decidirFoto(modalId, { estado: "rechazada", motivoRechazo: motivo });
      mostrarToast("Verificación rechazada. Se notificó al usuario.", "danger");
      setModalId(null);
      cargar();
    } catch (err) {
      mostrarToast(err.message, "danger");
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Verificación de identidad</h1>
        <p className="mt-1 text-muted-foreground">
          Capa 3 del esquema de identidad — selfie con cédula. Aprueba o rechaza cada solicitud.
        </p>
      </div>

      {/* Tabs de estado */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-trust text-trust"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel h-28 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <ShieldCheck className="size-8 text-muted-foreground/50" />
          <p className="font-medium">No hay verificaciones aquí</p>
          <p className="text-sm text-muted-foreground">Cuando lleguen solicitudes nuevas, aparecerán en esta lista.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <TarjetaVerificacion
              key={item.id}
              item={item}
              onAprobar={aprobar}
              onRechazar={setModalId}
              procesando={procesandoId === item.id}
            />
          ))}
        </div>
      )}

      <ModalRechazo
        abierto={!!modalId}
        onCancelar={() => setModalId(null)}
        onConfirmar={confirmarRechazo}
        enviando={procesandoId === modalId}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
            toast.tipo === "danger"
              ? "border-danger/30 bg-card text-danger"
              : "border-verified/30 bg-card text-verified"
          }`}
        >
          {toast.tipo === "danger" ? <X className="size-4" /> : <Check className="size-4" />}
          {toast.texto}
        </div>
      )}
    </div>
  );
}