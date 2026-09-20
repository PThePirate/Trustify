import { useEffect, useState } from "react";
import {
  Sprout, GraduationCap, BadgeCheck, Check, Circle, Loader2, AlertCircle,
  Calculator, Mail, ShieldAlert, Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { obtenerFormalizacion, marcarRimpeRegistrado, simularRimpe } from "@/services/negocioApi";

const NIVELES = [
  { nivel: "semilla", label: "Semilla", icon: Sprout },
  { nivel: "asesoria", label: "Asesoría", icon: GraduationCap },
  { nivel: "formalizado", label: "Formalizado", icon: BadgeCheck },
];

function Escalera({ nivelActual }) {
  const indiceActual = NIVELES.findIndex((n) => n.nivel === nivelActual);
  return (
    <div className="mb-8 flex items-center">
      {NIVELES.map((n, i) => {
        const alcanzado = i <= indiceActual;
        return (
          <div key={n.nivel} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`grid size-12 place-items-center rounded-full border-2 transition-colors ${
                  alcanzado ? "border-verified bg-verified/10 text-verified" : "border-border text-muted-foreground/40"
                }`}
              >
                <n.icon className="size-5" />
              </div>
              <span className={`text-xs font-semibold ${alcanzado ? "text-foreground" : "text-muted-foreground/60"}`}>
                {n.label}
              </span>
            </div>
            {i < NIVELES.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 rounded ${i < indiceActual ? "bg-verified" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TarjetaNivel({ nivel, requisitos, completo, esActual, onToggleManual, procesando }) {
  const info = NIVELES.find((n) => n.nivel === nivel);
  return (
    <div className={`panel p-5 ${esActual ? "ring-2 ring-trust/40" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold">
          <info.icon className="size-4" /> {info.label}
        </h3>
        {completo ? (
          <Badge variant="verified"><Check className="size-3.5" /> Completo</Badge>
        ) : esActual ? (
          <Badge variant="pending">Nivel actual</Badge>
        ) : null}
      </div>
      <ul className="space-y-2.5">
        {requisitos.map((r) => (
          <li key={r.requisito} className="flex items-start gap-2.5 text-sm">
            {r.manual ? (
              <button
                onClick={() => onToggleManual(!r.completado)}
                disabled={procesando}
                className="mt-0.5 shrink-0 disabled:opacity-50"
                title={r.completado ? "Marcar como pendiente" : "Marcar como hecho"}
              >
                {r.completado ? (
                  <BadgeCheck className="size-4 text-verified" />
                ) : (
                  <Circle className="size-4 text-muted-foreground/50 hover:text-trust" />
                )}
              </button>
            ) : r.completado ? (
              <Check className="mt-0.5 size-4 shrink-0 text-verified" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
            )}
            <span className={r.completado ? "text-foreground" : "text-muted-foreground"}>
              {r.requisito}
              {r.manual && <span className="ml-1.5 text-xs text-muted-foreground/70">(lo marcas tú)</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SimuladorRimpe() {
  const [ingresos, setIngresos] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function calcular(e) {
    e.preventDefault();
    if (!ingresos) return;
    setError("");
    setCargando(true);
    try {
      const res = await simularRimpe(Number(ingresos));
      setResultado(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="panel p-5">
      <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold">
        <Calculator className="size-4" /> Simulador RIMPE
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Estima en qué categoría RIMPE calificarías según tus ingresos anuales.
      </p>

      <form onSubmit={calcular} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={ingresos}
            onChange={(e) => setIngresos(e.target.value)}
            placeholder="Ingresos anuales estimados"
            className="h-11 w-full rounded-lg border border-input bg-background pl-6 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button type="submit" variant="trust" disabled={cargando || !ingresos}>
          {cargando ? <Loader2 className="size-4 animate-spin" /> : "Calcular"}
        </Button>
      </form>

      {error && <p className="mt-3 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>}

      {resultado && (
        <div className="mt-4 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-trust" />
            <span className="font-display font-bold">{resultado.categoria}</span>
          </div>
          {resultado.cuotaAnualEstimada != null && (
            <p className="mt-1 text-2xl font-bold text-trust">
              ${Number(resultado.cuotaAnualEstimada).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ año</span>
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{resultado.mensaje}</p>
          <p className="mt-1 text-sm">
            {resultado.requiereFacturaElectronica
              ? "Debes emitir factura electrónica."
              : "No necesitas factura electrónica — con nota de venta basta."}
          </p>
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-pending/10 px-3 py-2 text-xs text-pending">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" /> {resultado.advertencia}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormalizacionPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  function cargar() {
    obtenerFormalizacion().then(setDatos).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function toggleRimpe(completado) {
    setProcesando(true);
    try {
      const res = await marcarRimpeRegistrado(completado);
      setDatos(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!datos) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Ruta de Formalización</h1>
        <p className="mt-1 text-muted-foreground">
          Cada requisito se verifica solo, con tus datos reales — nunca lo marcas tú, salvo tu registro ante el SRI.
        </p>
      </div>

      <Escalera nivelActual={datos.nivelActual} />

      <div className="space-y-4">
        {datos.niveles.map((n) => (
          <TarjetaNivel
            key={n.nivel}
            nivel={n.nivel}
            requisitos={n.requisitos}
            completo={n.completo}
            esActual={n.nivel === datos.nivelActual}
            onToggleManual={toggleRimpe}
            procesando={procesando}
          />
        ))}
      </div>

      <div className="mt-6">
        <SimuladorRimpe />
      </div>

      <div className="panel mt-4 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display font-bold">¿Necesitas ayuda para formalizarte?</h3>
          <p className="text-sm text-muted-foreground">Conecta con el Consultorio Contable Universitario.</p>
        </div>
        <Button variant="outline" asChild>
          <a href="mailto:consultorio.contable@checkbiz.ec?subject=Quiero%20asesor%C3%ADa%20para%20formalizarme">
            <Mail className="size-4" /> Conectar ahora
          </a>
        </Button>
      </div>
    </div>
  );
}
