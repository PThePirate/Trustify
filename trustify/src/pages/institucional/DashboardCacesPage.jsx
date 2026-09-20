import { useEffect, useState } from "react";
import {
  GraduationCap, Sprout, Building2, BadgeCheck, Star, Receipt, Loader2, AlertCircle, ShieldAlert,
} from "lucide-react";
import { obtenerDashboardCaces } from "@/services/institucionalApi";

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

export default function DashboardCacesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDashboardCaces().then(setDatos).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!datos) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  const tasaConversion = datos.totalAlumniVerificados > 0
    ? (datos.totalConNegocioPublicado / datos.totalAlumniVerificados) * 100
    : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard de Indicadores CACES</h1>
        <p className="mt-1 text-muted-foreground">
          {datos.nombreUniversidad} — solo cuenta a los alumni que tu propia universidad ya verificó como suyos.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <TarjetaMetrica icon={GraduationCap} etiqueta="Alumni verificados" valor={datos.totalAlumniVerificados} tono="bg-trust/10 text-trust" />
        <TarjetaMetrica icon={Building2} etiqueta="Con negocio publicado" valor={datos.totalConNegocioPublicado} nota={`${tasaConversion.toFixed(0)}% de conversión`} tono="bg-verified/10 text-verified" />
        {datos.porNivel.map((n) => {
          const info = NIVEL_INFO[n.nivel] ?? { label: n.nivel, icon: Building2, tono: "bg-muted text-muted-foreground" };
          return (
            <TarjetaMetrica key={n.nivel} icon={info.icon} etiqueta={info.label} valor={n.totalNegocios} tono={info.tono} />
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="mb-1 flex items-center gap-2 font-display text-base font-bold">
            <Star className="size-4 text-trust" /> Trust Score promedio
          </h2>
          <p className="mt-2 text-3xl font-bold text-trust">{datos.trustScorePromedio.toFixed(0)}<span className="text-base font-normal text-muted-foreground">/100</span></p>
          <p className="mt-1 text-sm text-muted-foreground">De los negocios de tus egresados verificados.</p>
        </div>

        <div className="panel p-5">
          <h2 className="mb-1 flex items-center gap-2 font-display text-base font-bold">
            <Receipt className="size-4 text-trust" /> Proyección de recaudación anual
          </h2>
          <p className="mt-2 text-3xl font-bold text-trust">
            ${Number(datos.proyeccionRecaudacionAnualEstimada).toLocaleString("es-EC", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-1.5 rounded-lg bg-pending/10 px-3 py-2.5 text-xs text-pending">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" /> {datos.advertenciaProyeccion}
      </div>
    </div>
  );
}
