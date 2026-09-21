import { useEffect, useState } from "react";
import {
  Building2, Sprout, GraduationCap, BadgeCheck, Tags, Receipt, Loader2, AlertCircle, ShieldAlert,
  MapPin, Download, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { obtenerDashboardB2G, obtenerDashboardDetalleB2G } from "@/services/institucionalApi";

// D4 — reporte descargable. Solo arma un CSV con los mismos conteos
// agregados que ya se muestran en pantalla; no agrega ni infiere datos.
function descargarReporteCsv(datos, detalle) {
  const filas = [
    ["Métrica", "Valor"],
    ["Negocios publicados", datos.totalNegociosPublicados],
    ...datos.porNivel.map((n) => [`Nivel: ${n.nivel}`, n.totalNegocios]),
    ["Proyección de recaudación anual estimada (USD)", datos.proyeccionRecaudacionAnualEstimada],
    [],
    ["Categoría", "Negocios"],
    ...datos.porCategoria.map((c) => [c.categoria, c.totalNegocios]),
    [],
    ["Ciudad", "Negocios"],
    ...(detalle?.porCiudad ?? []).map((c) => [c.ciudad, c.totalNegocios]),
  ];
  const csv = filas.map((fila) => fila.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `checkbiz-reporte-b2g-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDashboardB2G().then(setDatos).catch((err) => setError(err.message));
    obtenerDashboardDetalleB2G().then(setDetalle).catch(() => {});
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
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Panel agregado de formalización</h1>
          <p className="mt-1 text-muted-foreground">
            Vista macro de los negocios verificados en CheckBiz — solo conteos, sin datos personales.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => descargarReporteCsv(datos, detalle)}>
          <Download className="size-4" /> Descargar reporte (CSV)
        </Button>
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

      {detalle && (
        <div className="panel mt-6 p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
            <MapPin className="size-4" /> Negocios por ciudad (detalle)
          </h2>
          {detalle.porCiudad.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay negocios publicados.</p>
          ) : (
            <div className="space-y-3">
              {detalle.porCiudad.map((c) => {
                const max = Math.max(1, ...detalle.porCiudad.map((x) => x.totalNegocios));
                return (
                  <div key={c.ciudad}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{c.ciudad}</span>
                      <span className="text-muted-foreground">{c.totalNegocios}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full rounded-full bg-verified"
                        style={{ width: `${(c.totalNegocios / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 flex items-start gap-1.5 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" /> {detalle.notaAnonimato}
          </div>
        </div>
      )}
    </div>
  );
}
