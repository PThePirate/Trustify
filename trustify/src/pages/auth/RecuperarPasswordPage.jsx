import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recuperarPassword, restablecerPassword } from "@/services/authApi";

/** B12 — recuperar contraseña sin sesión: pedir código por correo, luego canjearlo por una contraseña nueva. */
export default function RecuperarPasswordPage() {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigoDev, setCodigoDev] = useState(null);
  const navigate = useNavigate();

  async function pedirCodigo(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await recuperarPassword(correo);
      setCodigoDev(res.otp?.codigoDev ?? null);
      setPaso(2);
    } catch (err) {
      setError(err.message || "No se pudo procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  async function restablecer(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await restablecerPassword(correo, codigo, passwordNueva);
      navigate("/login", { state: { passwordRestablecida: true } });
    } catch (err) {
      setError(err.message || "No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold">Recupera tu contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paso === 1
            ? "Ingresa tu correo — si existe una cuenta, te enviamos un código."
            : "Ingresa el código que recibiste y tu nueva contraseña."}
        </p>

        {paso === 1 ? (
          <form onSubmit={pedirCodigo} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="correo">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="correo" type="email" required className="pl-10" placeholder="tu@correo.com"
                  value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
              </div>
            )}

            <Button type="submit" variant="trust" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Enviando…</>
              ) : (
                <>Enviar código <ArrowRight /></>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={restablecer} className="mt-8 space-y-5">
            {codigoDev && (
              <p className="rounded-lg border border-pending/30 bg-pending/10 px-3 py-2 text-xs text-pending">
                Modo desarrollo — código: <span className="font-mono font-bold">{codigoDev}</span>
              </p>
            )}

            <div>
              <Label htmlFor="codigo">Código de 6 dígitos</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="codigo" inputMode="numeric" maxLength={6} required className="pl-10 tracking-widest"
                  value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>

            <div>
              <Label htmlFor="passwordNueva">Nueva contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="passwordNueva" type="password" required minLength={8} className="pl-10" placeholder="Al menos 8 caracteres"
                  value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
              </div>
            )}

            <Button type="submit" variant="trust" size="lg" className="w-full" disabled={loading || codigo.length !== 6}>
              {loading ? (
                <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Restableciendo…</>
              ) : (
                <><CheckCircle2 className="size-4" /> Restablecer contraseña</>
              )}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-trust hover:underline">Volver a iniciar sesión</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
