import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Ban, Search, AlertTriangle, ShieldOff, Loader2, Check, History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vetarCedula, listarVetosRecientes } from "@/services/adminApi";

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

export default function VetoPage() {
  const [searchParams] = useSearchParams();
  const [cedula, setCedula] = useState(searchParams.get("cedula") || "");
  const [motivo, setMotivo] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);

  useEffect(() => {
    listarVetosRecientes().then((v) => {
      setHistorial(v);
      setCargandoHistorial(false);
    });
  }, []);

  const cedulaValida = /^\d{10}$/.test(cedula);

  async function confirmar() {
    setError("");
    setEnviando(true);
    try {
      const res = await vetarCedula({ cedula, motivo: motivo.trim() });
      setExito(res.veto);
      setHistorial((h) => [res.veto, ...h]);
      setCedula("");
      setMotivo("");
      setConfirmando(false);
    } catch (err) {
      setError(err.message || "No se pudo vetar la cédula");
      setConfirmando(false);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Veto por cédula</h1>
        <p className="mt-1 text-muted-foreground">
          Bloqueo permanente e irreversible. La persona no podrá volver a
          registrarse ni iniciar sesión con esa cédula.
        </p>
      </div>

      <div className="panel p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (!cedulaValida) return setError("La cédula debe tener 10 dígitos");
            if (motivo.trim().length < 5) return setError("Describe el motivo (mínimo 5 caracteres)");
            setConfirmando(true);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="cedula">Cédula a vetar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="cedula"
                inputMode="numeric"
                maxLength={10}
                placeholder="10 dígitos"
                className="pl-10"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="motivo">Motivo (obligatorio, queda registrado en auditoría)</Label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ej: Denuncia de estafa confirmada por dos usuarios distintos"
              className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-danger">
              <AlertTriangle className="size-4" /> {error}
            </p>
          )}

          <Button type="submit" variant="danger" className="w-full" disabled={!cedula || !motivo.trim()}>
            <Ban className="size-4" /> Bloquear cédula permanentemente
          </Button>
        </form>
      </div>

      {exito && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-verified/30 bg-verified/10 px-4 py-3 text-sm text-verified">
          <Check className="mt-0.5 size-4 shrink-0" />
          Cédula {exito.cedula} vetada permanentemente el {formatearFecha(exito.creadoEn)}.
        </div>
      )}

      {/* Historial reciente */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
          <History className="size-4" /> Historial reciente
        </h2>
        {cargandoHistorial ? (
          <div className="panel h-20 animate-pulse bg-muted/40" />
        ) : historial.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no se ha vetado ninguna cédula.</p>
        ) : (
          <div className="space-y-2">
            {historial.map((v) => (
              <div key={v.id} className="panel flex items-start gap-3 p-4">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
                  <ShieldOff className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">{v.cedula}</p>
                  <p className="text-sm text-muted-foreground">{v.motivo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{formatearFecha(v.creadoEn)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación — acción irreversible */}
      {confirmando && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="panel w-full max-w-sm p-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">¿Vetar esta cédula?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta acción es <strong>irreversible</strong>. La cédula{" "}
              <span className="font-mono font-semibold text-foreground">{cedula}</span> quedará
              bloqueada de forma permanente.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmando(false)} disabled={enviando}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" onClick={confirmar} disabled={enviando}>
                {enviando ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                Sí, vetar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}