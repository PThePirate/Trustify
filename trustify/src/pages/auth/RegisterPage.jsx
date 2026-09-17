import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, Contact, Lock, ArrowRight,
  ShoppingBag, Store, Check, AlertCircle, Eye, EyeOff,
} from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registrar } from "@/services/authApi";

import { PAISES, validarRegistro } from "@/lib/registroValidation";

const ROLES = [
  { id: "comprador", icon: ShoppingBag, title: "Soy cliente", desc: "Busco y contrato servicios" },
  { id: "emprendedor", icon: Store, title: "Soy emprendedor", desc: "Quiero publicar mi negocio" },
];

export default function RegisterPage() {
  const [role, setRole] = useState("comprador");
  const [form, setForm] = useState({ nombreCompleto: "", correo: "", telefono: "", pais: "EC", cedula: "", password: "" });
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const errors = { ...validarRegistro(form), ...serverErrors };
  const visibleError = (key) => (touched[key] || submitted) && errors[key];
  const fieldProps = (key, className = "pl-10") => ({
    name: key,
    onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    "aria-invalid": Boolean(visibleError(key)),
    "aria-describedby": `${key}-help`,
    className: cn(className, visibleError(key) && "border-red-500 bg-red-500/5 focus-visible:border-red-500 focus-visible:ring-red-500/25"),
  });
  const feedback = (key, hint) => (
    <p id={`${key}-help`} aria-live="polite" className={cn("mt-1.5 text-xs", visibleError(key) ? "text-red-500" : "text-muted-foreground")}>
      {visibleError(key) || hint}
    </p>
  );

  const campo = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setTouched((prev) => ({ ...prev, [k]: true }));
    setServerErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(true);
    const invalid = validarRegistro(form);
    if (Object.keys(invalid).length || !accept) {
      if (!accept) setError("Acepta los términos para continuar.");
      e.currentTarget.querySelector(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const respuesta = await registrar({ ...form, nombreCompleto: form.nombreCompleto.trim(), aceptoTerminos: accept });
      // Independiente del rol elegido, toda cuenta nace como cliente y debe
      // completar Capa 2 (OTP) antes que nada — el rol de emprendedor se
      // activa más adelante, sobre esta misma identidad.
      navigate("/verificar-otp", { state: { comoEmprendedor: role === "emprendedor", otp: respuesta.otp } });
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta");
      const fields = Object.fromEntries((Array.isArray(err.detalles) ? err.detalles : []).map((item) => [item.campo, item.mensaje]));
      if (err.codigo === "CEDULA_INVALIDA" || err.codigo === "CEDULA_VETADA") fields.cedula = err.message;
      if (err.codigo === "YA_REGISTRADO") {
        if (err.message.includes("correo")) fields.correo = err.message;
        else if (err.message.includes("cédula")) fields.cedula = err.message;
      }
      setServerErrors(fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-1 text-xs font-medium text-trust">Paso 1 de 3 · Datos de cuenta</div>
        <h1 className="font-display text-3xl font-bold">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verificaremos tu identidad en los siguientes pasos (cédula, correo y foto).
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all",
                  active ? "border-trust/60 bg-trust/10 shadow-glow" : "border-border bg-card/40 hover:border-border/80"
                )}
              >
                {active && (
                  <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-trust text-[hsl(var(--primary-ink))]">
                    <Check className="size-3" />
                  </span>
                )}
                <r.icon className={cn("size-5", active ? "text-trust" : "text-muted-foreground")} />
                <p className="mt-2 text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            );
          })}
        </div>

        <form noValidate onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="nombre" placeholder="Nombres y apellidos" required autoComplete="name" {...fieldProps("nombreCompleto")}
                value={form.nombreCompleto} onChange={campo("nombreCompleto")} />
            </div>
            {feedback("nombreCompleto", "Hasta 80 caracteres.")}
          </div>

          <div>
            <div>
              <Label htmlFor="correo">Correo</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="correo" type="email" placeholder="tu@correo.com" required autoComplete="email" {...fieldProps("correo")}
                  value={form.correo} onChange={campo("correo")} />
              </div>
              {feedback("correo", "Hasta 80 caracteres, incluido el símbolo @.")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pais">País</Label>
              <select id="pais" value={form.pais} onChange={campo("pais")}
                {...fieldProps("pais", "h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust/30")}>
                {PAISES.map((p) => <option key={p.codigo} value={p.codigo}>{p.bandera} {p.nombre} ({p.prefijo})</option>)}
              </select>
              {feedback("pais", "Selecciona el país de tu número celular.")}
            </div>
            <div>
              <Label htmlFor="tel">Teléfono celular</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {PAISES.find((p) => p.codigo === form.pais)?.prefijo}
                </span>
                <Input id="tel" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={form.pais === "EC" ? "0991234567" : "Número celular"} required
                  {...fieldProps("telefono", "pl-16")} value={form.telefono} onChange={campo("telefono")} />
              </div>
              {feedback("telefono", "10 números, sin incluir el prefijo del país.")}
            </div>
          </div>

          <div>
            <Label htmlFor="cedula">Cédula</Label>
            <div className="relative">
              <Contact className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="cedula" inputMode="numeric" placeholder="10 dígitos" required {...fieldProps("cedula")}
                value={form.cedula} onChange={campo("cedula")} />
            </div>
            {feedback("cedula", "Ingresa tu cédula ecuatoriana de 10 dígitos, tal como aparece en tu documento.")}
          </div>

          <div>
            <Label htmlFor="pass">Contraseña</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pass" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" required autoComplete="new-password" {...fieldProps("password", "pl-10 pr-12")}
                value={form.password} onChange={campo("password")} />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword}
                className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust">
                {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            </div>
            {feedback("password", "Entre 8 y 80 caracteres.")}
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[hsl(var(--trust))]" required />
            <span>
              Acepto el{" "}
              <Link to="#" className="text-trust hover:underline">Contrato de Adhesión y los Términos y Condiciones</Link>.
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" variant="trust" size="lg" className="w-full" disabled={loading || !accept}>
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creando cuenta…
              </>
            ) : (
              <>Continuar a verificación <ArrowRight /></>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-trust hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}