import { useEffect, useState } from "react";
import {
  Building2, Sprout, GraduationCap, BadgeCheck, Tags, Receipt, Loader2, AlertCircle, ShieldAlert,
} from "lucide-react";
import { obtenerDashboardB2G } from "@/services/institucionalApi";

const NIVEL_INFO = {
  semilla: { label: "Semilla", icon: Sprout, tono: "bg-pending/10 text-pending" },
  asesoria: { label: "Asesoría", icon: GraduationCap, tono: "bg-trust/10 text-trust" },
  formalizado: { label: "Formalizado", icon: BadgeCheck, tono: "bg-verified/10 text-verified" },
};

function TarjetaMetrica({ icon: Icon, etiqueta, valor, nota, tono = "bg-trust/10 text-trust" }) {
  return (
    <div className="panel p-5">
      <span className={`grid size-10 place-items-center rounded-xl ${tono}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-bold leading-none">{valor}</p>
      <p className="mt-1.5 text-sm font-medium text-foreground/80">{etiqueta}</p>
      {nota && <p className="mt-0.5 text-xs text-muted-foreground">{nota}</p>}
    </div>
  );
}

export default function DashboardB2GPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDashboardB2G().then(setDatos).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!datos) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  const maxCategoria = Math.max(1, ...datos.porCategoria.map((c) => c.totalNegocios));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Panel agregado de formalización</h1>
        <p className="mt-1 text-muted-foreground">
          Vista macro de los negocios verificados en CheckBiz — solo conteos, sin datos personales.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <TarjetaMetrica icon={Building2} etiqueta="Negocios publicados" valor={datos.totalNegociosPublicados} tono="bg-trust/10 text-trust" />
        {datos.porNivel.map((n) => {
          const info = NIVEL_INFO[n.nivel] ?? { label: n.nivel, icon: Building2, tono: "bg-muted text-muted-foreground" };
          return (
            <TarjetaMetrica
              key={n.nivel}
              icon={info.icon}
              etiqueta={info.label}
              valor={n.totalNegocios}
              tono={info.tono}
            />
          );
        })}
      </div>

      <div className="panel mb-6 p-5">
        <h2 className="mb-1 flex items-center gap-2 font-display text-base font-bold">
          <Receipt className="size-4" /> Proyección de recaudación anual estimada
        </h2>
        <p className="mt-2 text-3xl font-bold text-trust">
          ${Number(datos.proyeccionRecaudacionAnualEstimada).toLocaleString("es-EC", { minimumFractionDigits: 2 })}
        </p>
        <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-pending/10 px-3 py-2 text-xs text-pending">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" /> {datos.advertenciaProyeccion}
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
          <Tags className="size-4" /> Negocios por categoría
        </h2>
        {datos.porCategoria.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay negocios publicados.</p>
        ) : (
          <div className="space-y-3">
            {datos.porCategoria.map((c) => (
              <div key={c.categoria}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{c.categoria}</span>
                  <span className="text-muted-foreground">{c.totalNegocios}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-trust"
                    style={{ width: `${(c.totalNegocios / maxCategoria) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
