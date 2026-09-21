import { useEffect, useState } from "react";
import { CreditCard, Building2, Landmark, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { obtenerGestionSuscripciones } from "@/services/adminApi";

const PLAN_LABEL = { basico: "Básico", pro: "Pro", elite: "Elite" };
const TIPO_INFO = {
  universidad: { label: "Universidad", Icon: GraduationCap },
  camara_impuestos: { label: "Cámara de Impuestos", Icon: Landmark },
  camara_negocio: { label: "Cámara de Negocio", Icon: Building2 },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

export default function GestionSuscripcionesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerGestionSuscripciones().then(setDatos).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!datos) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  const totalNegocios = datos.porPlan.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Suscripciones y licenciamiento B2B</h1>
        <p className="mt-1 text-muted-foreground">
          Solo lectura — el cambio de plan de un negocio sigue siendo self-service desde su propio panel.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
            <CreditCard className="size-4 text-trust" /> Negocios por plan
          </h2>
          <div className="space-y-2">
            {datos.porPlan.map((p) => (
              <div key={p.plan} className="flex items-center justify-between text-sm">
                <span>{PLAN_LABEL[p.plan] ?? p.plan}</span>
                <span className="font-semibold">{p.total}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>{totalNegocios}</span>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="mb-1 font-display text-base font-bold">Ingreso mensual estimado</h2>
          <p className="mt-2 font-display text-3xl font-bold text-trust">
            ${Number(datos.ingresoMensualEstimado).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Suma de suscripciones activas — las semestrales se cuentan a 1/6 de su precio.
          </p>
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="mb-4 font-display text-base font-bold">Cuentas institucionales activas</h2>
        {datos.instituciones.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay cuentas institucionales activas.</p>
        ) : (
          <div className="divide-y divide-border">
            {datos.instituciones.map((inst) => {
              const info = TIPO_INFO[inst.tipo] ?? { label: inst.tipo, Icon: Building2 };
              return (
                <div key={inst.correo} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-trust/10 text-trust">
                      <info.Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{inst.nombreInstitucion}</p>
                      <p className="text-xs text-muted-foreground">{info.label} · {inst.correo}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">Desde {formatearFecha(inst.creadoEn)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
