import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flag, User, Calendar, CreditCard, Archive, Ban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarDenuncias, resolverDenuncia } from "@/services/adminApi";

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ComplaintsPage() {
  const [denuncias, setDenuncias] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);

  function cargar() {
    listarDenuncias("abierta").then(setDenuncias);
  }
  useEffect(cargar, []);

  async function archivar(id) {
    setProcesandoId(id);
    await resolverDenuncia(id, "archivar");
    cargar();
    setProcesandoId(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Denuncias</h1>
        <p className="mt-1 text-muted-foreground">
          Reportes de clientes sobre negocios o usuarios sospechosos. Si la
          denuncia procede, vetar la cédula la bloquea permanentemente.
        </p>
      </div>

      {!denuncias ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando…
        </div>
      ) : denuncias.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Flag className="size-8 text-muted-foreground/50" />
          <p className="font-medium">No hay denuncias abiertas</p>
          <p className="text-sm text-muted-foreground">Cuando un cliente reporte algo, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {denuncias.map((d) => (
            <div key={d.id} className="panel p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="size-3.5" /> Reportado por {d.reportante.nombreCompleto}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {formatearFecha(d.creadoEn)}</span>
              </div>
              <p className="mt-2 text-sm">{d.motivo}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CreditCard className="size-3.5" /> Cédula reportada: <span className="font-mono">{d.cedulaReportada}</span>
              </p>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => archivar(d.id)}
                  disabled={procesandoId === d.id}
                >
                  {procesandoId === d.id ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
                  Archivar
                </Button>
                <Link to={`/admin/veto?cedula=${d.cedulaReportada}`}>
                  <Button variant="danger" size="sm">
                    <Ban className="size-4" /> Ir a vetar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}