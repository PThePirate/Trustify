import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Contact, Lock, ArrowRight,
  ShoppingBag, Store, Check,
} from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "comprador", icon: ShoppingBag, title: "Soy cliente", desc: "Busco y contrato servicios" },
  { id: "emprendedor", icon: Store, title: "Soy emprendedor", desc: "Quiero publicar mi negocio" },
];

export default function RegisterPage() {
  const [role, setRole] = useState("comprador");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: aquí irá el registro + KYC (Módulo 10, OTP, foto…).
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1100);
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
          Verificaremos tu identidad en los siguientes pasos (cédula, teléfono y
          foto).
        </p>

        {/* Selector de rol */}
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
                  active
                    ? "border-trust/60 bg-trust/10 shadow-glow"
                    : "border-border bg-card/40 hover:border-border/80"
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

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="nombre" placeholder="Nombres y apellidos" required className="pl-10" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="correo">Correo</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="correo" type="email" placeholder="tu@correo.com" required className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="tel">Teléfono</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="tel" type="tel" placeholder="09…" required className="pl-10" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="cedula">Cédula</Label>
            <div className="relative">
              <Contact className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="cedula"
                inputMode="numeric"
                maxLength={10}
                placeholder="10 dígitos"
                required
                className="pl-10"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Validaremos la estructura con el algoritmo Módulo 10 en vivo.
            </p>
          </div>

          <div>
            <Label htmlFor="pass">Contraseña</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pass" type="password" placeholder="Mínimo 8 caracteres" required className="pl-10" />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[hsl(var(--trust))]"
              required
            />
            <span>
              Acepto el{" "}
              <Link to="#" className="text-trust hover:underline">
                Contrato de Adhesión y los Términos y Condiciones
              </Link>
              .
            </span>
          </label>

          <Button type="submit" variant="trust" size="lg" className="w-full" disabled={loading || !accept}>
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creando cuenta…
              </>
            ) : (
              <>
                Continuar a verificación <ArrowRight />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-trust hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}