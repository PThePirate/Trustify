import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { institucionalLogin } from "@/services/institucionalApi";

export default function InstitucionalLoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await institucionalLogin({ correo, password });
      navigate("/institucional");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#153C55] p-12 text-[#FFFCF6] lg:flex">
        <Logo className="text-[#FFFCF6]" />

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <Landmark className="size-3.5" /> Acceso institucional — Cámaras y universidades
          </span>
          <h1 className="mt-6 max-w-sm font-display text-3xl font-bold leading-tight">
            Panel agregado de formalización
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Vista macro para la Cámara de Impuestos y Cámaras de Negocio — solo
            conteos agregados, nunca datos personales de un negocio o usuario
            individual.
          </p>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} CheckBiz. Acceso institucional independiente.
        </p>
      </div>

      <div className="relative flex items-center justify-center px-6 py-16">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-trust/25 bg-trust/10 px-2.5 py-1 text-[11px] font-semibold text-trust">
            <Landmark className="size-3.5" /> Acceso institucional
          </div>
          <h2 className="font-display text-2xl font-bold">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con la cuenta de tu institución (universidad o cámara).
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="correo">Correo institucional</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="camara.impuestos@checkbiz.ec"
                  className="pl-10"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="px-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" variant="trust" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verificando…
                </>
              ) : (
                <>
                  Ingresar al panel <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ¿Eres cliente, emprendedor o admin?{" "}
            <Link to="/login" className="font-medium text-trust hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
