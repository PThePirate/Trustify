import { useEffect, useState } from "react";
import {
  Check, X, Loader2, AlertCircle, Sparkles, CircleDollarSign, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listarPlanes, obtenerMiSuscripcion, cambiarPlan } from "@/services/negocioApi";

const ETIQUETAS = { basico: "Básico", pro: "Pro", elite: "Elite" };

const CARACTERISTICAS = [
  { campo: "limiteCatalogo", label: (p) => `Hasta ${p.limiteCatalogo} ítems en el catálogo` },
  { campo: "incluyeVideo", label: () => "Video de presentación" },
  { campo: "incluyeAnaliticaAvanzada", label: () => "Analítica avanzada" },
  { campo: "incluyeMultiusuario", label: () => "Multiusuario" },
  { campo: "incluyeTraduccion", label: () => "Traducción ES↔EN" },
  { campo: "incluyeCertificadoPdf", label: () => "Certificado PDF" },
  { campo: "incluyeWhatsappBusinessApi", label: () => "WhatsApp Business API" },
];

function precioDe(plan, ciclo) {
  return ciclo === "semestral" ? plan.precioSemestral : plan.precioMensual;
}

function TarjetaPlan({ plan, ciclo, esActual, onElegir }) {
  const precio = precioDe(plan, ciclo);
  const destacado = plan.nombre === "pro";
  return (
    <div className={`panel relative flex flex-col p-5 ${destacado ? "ring-2 ring-trust/40" : ""}`}>
      {destacado && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-trust px-3 py-1 text-xs font-semibold text-white">
          Más elegido
        </span>
      )}
      <h3 className="font-display text-lg font-bold">{ETIQUETAS[plan.nombre] ?? plan.nombre}</h3>
      <p className="mt-2 font-display text-3xl font-bold">
        {precio > 0 ? `$${Number(precio).toFixed(2)}` : "Gratis"}
        {precio > 0 && (
          <span className="text-sm font-normal text-muted-foreground">
            {" "}/ {ciclo === "semestral" ? "6 meses" : "mes"}
          </span>
        )}
      </p>

      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {CARACTERISTICAS.map((c) => {
          const activo = c.campo === "limiteCatalogo" ? true : plan[c.campo];
          return (
            <li key={c.campo} className="flex items-start gap-2">
              {activo ? (
                <Check className="mt-0.5 size-4 shrink-0 text-verified" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
              )}
              <span className={activo ? "text-foreground" : "text-muted-foreground/60"}>{c.label(plan)}</span>
            </li>
          );
        })}
      </ul>

      <Button
        className="mt-5"
        variant={esActual ? "outline" : "trust"}
        disabled={esActual}
        onClick={() => onElegir(plan)}
      >
        {esActual ? "Tu plan actual" : "Elegir este plan"}
      </Button>
    </div>
  );
}

function ResumenCheckout({ plan, ciclo, onConfirmar, onCancelar, procesando, error }) {
  const precio = precioDe(plan, ciclo);
  return (
    <div className="panel mx-auto max-w-md p-6">
      <button onClick={onCancelar} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver a los planes
      </button>

      <h2 className="flex items-center gap-2 font-display text-xl font-bold">
        <Sparkles className="size-5 text-trust" /> Confirmar plan {ETIQUETAS[plan.nombre] ?? plan.nombre}
      </h2>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 p-4">
        <span className="text-sm text-muted-foreground">
          Ciclo {ciclo === "semestral" ? "semestral" : "mensual"}
        </span>
        <span className="font-display text-xl font-bold">
          {precio > 0 ? `$${Number(precio).toFixed(2)}` : "Gratis"}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
        <CircleDollarSign className="mt-0.5 size-4 shrink-0" />
        CheckBiz no procesa pagos dentro de la app — es parte de nuestro núcleo intocable. Al confirmar, tu
        plan se activa de inmediato para la demo; la facturación real de la suscripción se coordina directo
        con el equipo de CheckBiz.
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}

      <Button className="mt-5 w-full" variant="trust" disabled={procesando} onClick={onConfirmar}>
        {procesando ? <Loader2 className="size-4 animate-spin" /> : "Confirmar y activar"}
      </Button>
    </div>
  );
}

export default function PlanesPage() {
  const [planes, setPlanes] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [ciclo, setCiclo] = useState("mensual");
  const [seleccion, setSeleccion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [errorCheckout, setErrorCheckout] = useState("");

  function cargar() {
    Promise.all([listarPlanes(), obtenerMiSuscripcion()])
      .then(([p, s]) => {
        setPlanes(p);
        setSuscripcion(s);
      })
      .catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function confirmar() {
    setErrorCheckout("");
    setProcesando(true);
    try {
      const res = await cambiarPlan(seleccion.nombre, ciclo);
      setSuscripcion(res);
      setSeleccion(null);
    } catch (err) {
      setErrorCheckout(err.message);
    } finally {
      setProcesando(false);
    }
  }

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!planes || !suscripcion) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  if (seleccion) {
    return (
      <ResumenCheckout
        plan={seleccion}
        ciclo={ciclo}
        onConfirmar={confirmar}
        onCancelar={() => { setSeleccion(null); setErrorCheckout(""); }}
        procesando={procesando}
        error={errorCheckout}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Suscripción y planes</h1>
          <p className="mt-1 text-muted-foreground">
            Tu plan actual es <span className="font-semibold text-foreground">{ETIQUETAS[suscripcion.plan.nombre]}</span>
            {" "}({suscripcion.totalCatalogoUsado}/{suscripcion.plan.limiteCatalogo} del catálogo usados).
            {suscripcion.venceEn && (
              <> Vence el {new Date(suscripcion.venceEn).toLocaleDateString()}.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1 self-start rounded-full border border-border bg-muted/30 p-1">
          {[
            { valor: "mensual", label: "Mensual" },
            { valor: "semestral", label: "Semestral" },
          ].map((op) => (
            <button
              key={op.valor}
              onClick={() => setCiclo(op.valor)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                ciclo === op.valor ? "bg-trust text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {suscripcion.plan.nombre !== "basico" && (
        <Badge variant="verified" className="mb-4">
          <Check className="size-3.5" /> Suscripción activa
        </Badge>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {planes.map((plan) => (
          <TarjetaPlan
            key={plan.nombre}
            plan={plan}
            ciclo={ciclo}
            esActual={plan.nombre === suscripcion.plan.nombre}
            onElegir={setSeleccion}
          />
        ))}
      </div>
    </div>
  );
}
