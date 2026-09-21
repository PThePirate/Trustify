import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, ShieldAlert, FileCheck2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { activarEmprendedor } from "@/services/authApi";

export default function ActivarEmprendedorPage() {
  const [acepto, setAcepto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function activar() {
    setError("");
    setLoading(true);
    try {
      await activarEmprendedor();
      navigate("/negocio/bienvenida");
    } catch (err) {
      setError(err.message || "No se pudo activar tu perfil de emprendedor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-verified/10 text-verified">
          <Store className="size-8" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Activa tu perfil de emprendedor</h1>
        <p className="mt-2 text-muted-foreground">
          Un último paso antes de crear tu Mini Landing Page verificada.
        </p>

        <div className="mt-8 w-full space-y-3 text-left">
          <div className="panel flex items-start gap-3 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-trust" />
            <div>
              <p className="font-medium">Cruce SENESCYT / SRI</p>
              <p className="text-sm text-muted-foreground">
                Capa 4 — confirmamos actividad real registrada a tu nombre.
              </p>
            </div>
          </div>
          <div className="panel flex items-start gap-3 p-4">
            <FileCheck2 className="mt-0.5 size-5 shrink-0 text-trust" />
            <div>
              <p className="font-medium">
                <a href="/contrato#verificacion-identidad" target="_blank" rel="noopener noreferrer" className="text-trust hover:underline">
                  Contrato de Adhesión de Emprendedor
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Firma digital con validez legal — se registra tu IP y la fecha/hora exactas.
              </p>
            </div>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-left text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[hsl(var(--trust))]"
          />
          <span>
            Acepto el Contrato de Adhesión de Emprendedor y autorizo el cruce con bases públicas
            (SENESCYT/SRI) para verificar mi actividad.
          </span>
        </label>

        {error && (
          <div className="mt-4 flex w-full items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-left text-sm text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}

        <Button
          variant="trust"
          size="lg"
          className="mt-6 w-full"
          disabled={!acepto || loading}
          onClick={activar}
        >
          {loading ? (
            <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Activando…</>
          ) : (
            <><CheckCircle2 className="size-4" /> Activar mi perfil de emprendedor</>
          )}
        </Button>

        <Link to="/" className="mt-4 text-sm text-muted-foreground hover:text-foreground">
          Hacerlo más tarde
        </Link>
      </div>
    </div>
  );
}