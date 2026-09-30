import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, BadgeCheck, Sparkles } from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/authApi";
import "./login.css";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const nextErrors = {};
    if (!correo.trim()) nextErrors.correo = "Ingresa tu correo electrónico";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) nextErrors.correo = "Ingresa un correo válido";
    if (!password) nextErrors.password = "Ingresa tu contraseña";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const data = await login({ correo: correo.trim().toLowerCase(), password });
      // Si ya tiene rol emprendedor, lo llevamos directo a su panel de negocio;
      // si no, a la landing (el flujo de cliente todavía no tiene home propio).
      const destino = typeof location.state?.from === "string" && location.state.from.startsWith("/") ? location.state.from : null;
      navigate(data.usuario.kycLayer < 2 ? "/verificar-otp" : destino || (data.usuario.rolEmprendedor ? "/negocio" : "/panel"), { state: destino ? { from: destino } : undefined });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout loginVisual>
      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-form-spark" aria-hidden="true"><Sparkles className="size-5" /></div>
        <div className="login-welcome"><BadgeCheck className="size-4" /> Tu espacio de confianza</div>
        <h1 className="font-display text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-trust" />
          El acceso se determina automáticamente según tu cuenta
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.correo)}
                aria-describedby={fieldErrors.correo ? "email-error" : undefined}
                className="pl-10"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value); setFieldErrors((prev) => ({ ...prev, correo: "" })); setError(""); }}
              />
            </div>
            {fieldErrors.correo && <p id="email-error" className="mt-1.5 text-xs text-danger" role="alert">{fieldErrors.correo}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link to="/recuperar-password" className="text-xs text-trust transition-colors hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                className="px-10"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: "" })); setError(""); }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.password && <p id="password-error" className="mt-1.5 text-xs text-danger" role="alert">{fieldErrors.password}</p>}
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
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
                Ingresar al sistema <ArrowRight />
              </>
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-trust hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
