import { useEffect, useState } from "react";
import { ScrollText, ShieldCheck, ShieldX, Ban, Loader2 } from "lucide-react";
import { listarLogsAuditoria } from "@/services/adminApi";

const ACCION_INFO = {
  kyc_foto_aprobada: { label: "Aprobó verificación", Icon: ShieldCheck, tono: "text-verified bg-verified/10" },
  kyc_foto_rechazada: { label: "Rechazó verificación", Icon: ShieldX, tono: "text-danger bg-danger/10" },
  veto_cedula: { label: "Vetó cédula", Icon: Ban, tono: "text-danger bg-danger/10" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-EC", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    listarLogsAuditoria().then(setLogs);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Logs de auditoría</h1>
        <p className="mt-1 text-muted-foreground">
          Historial de cada acción sensible realizada por un administrador. Se
          registra automáticamente — nada de esto se puede editar ni borrar.
        </p>
      </div>

      {!logs ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando…
        </div>
      ) : logs.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <ScrollText className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Sin registros todavía</p>
        </div>
      ) : (
        <div className="panel divide-y divide-border">
          {logs.map((log) => {
            const info = ACCION_INFO[log.accion] || { label: log.accion, Icon: ScrollText, tono: "text-muted-foreground bg-muted" };
            return (
              <div key={log.id} className="flex items-start gap-3 p-4">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${info.tono}`}>
                  <info.Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{log.admin}</span>{" "}
                    <span className="text-muted-foreground">{info.label.toLowerCase()}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {log.entidad} · {log.entidadId} — {log.detalle}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatearFecha(log.creadoEn)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}