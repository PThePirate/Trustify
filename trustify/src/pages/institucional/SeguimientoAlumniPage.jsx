import { useEffect, useState } from "react";
import { Users, Check, X, Clock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listarAlumniSeguimiento, decidirAlumni } from "@/services/institucionalApi";

const ESTADO_INFO = {
  pendiente: { label: "Pendiente", variant: "pending" },
  verificado: { label: "Verificado", variant: "verified" },
  rechazado: { label: "Rechazado", variant: "outline" },
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SeguimientoAlumniPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  function cargar() {
    listarAlumniSeguimiento().then(setItems).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function decidir(id, estado) {
    setProcesandoId(id);
    setError("");
    try {
      await decidirAlumni(id, estado);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Seguimiento de Alumni / Graduados</h1>
        <p className="mt-1 text-muted-foreground">
          Solicitudes de personas que dicen ser tus egresados — confírmalas contra tu propio registro.
        </p>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
      )}

      {items === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Users className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no hay solicitudes de verificación</p>
          <p className="text-sm text-muted-foreground">Aparecerán aquí cuando un egresado las envíe desde su perfil.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const info = ESTADO_INFO[item.estado] ?? { label: item.estado, variant: "outline" };
            return (
              <div key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{item.nombreAlumni}</p>
                  <p className="text-xs text-muted-foreground">Solicitado el {formatearFecha(item.creadoEn)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={info.variant}>
                    {item.estado === "pendiente" && <Clock className="size-3.5" />} {info.label}
                  </Badge>
                  {item.estado === "pendiente" && (
                    <>
                      <Button
                        size="sm" variant="verified"
                        disabled={procesandoId === item.id}
                        onClick={() => decidir(item.id, "verificado")}
                      >
                        {procesandoId === item.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        Verificar
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="border-danger/30 text-danger hover:bg-danger/10"
                        disabled={procesandoId === item.id}
                        onClick={() => decidir(item.id, "rechazado")}
                      >
                        <X className="size-4" /> Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
