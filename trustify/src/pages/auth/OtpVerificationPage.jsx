import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, RotateCw } from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { enviarOtp, verificarOtp } from "@/services/authApi";

export default function OtpVerificationPage() {
  const location = useLocation();
  const [digitos, setDigitos] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [error, setError] = useState("");
  const [codigoDev, setCodigoDev] = useState(location.state?.otp?.codigoDev ?? null);
  const envioEnCurso = useRef(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const comoEmprendedor = location.state?.comoEmprendedor ?? false;

  // El registro ya envía el código. Abrir o recargar esta pantalla no debe
  // generar otro ni invalidar el que el usuario recibió por correo.

  function onCambiar(i, valor) {
    if (!/^\d?$/.test(valor)) return;
    const copia = [...digitos];
    copia[i] = valor;
    setDigitos(copia);
    if (valor && i < 5) inputs.current[i + 1]?.focus();
  }

  function onBorrar(i, e) {
    if (e.key === "Backspace" && !digitos[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function onPegar(i, e) {
    e.preventDefault();
    const codigo = e.clipboardData.getData("text").replace(/\s/g, "");
    if (!/^\d{1,6}$/.test(codigo)) return;

    // Un código completo reemplaza las seis casillas desde el principio.
    // Un fragmento se inserta a partir de la casilla seleccionada.
    const inicio = codigo.length === 6 ? 0 : i;
    const nuevos = codigo.slice(0, 6 - inicio).split("");
    setDigitos((actuales) => {
      const copia = [...actuales];
      nuevos.forEach((digito, offset) => { copia[inicio + offset] = digito; });
      return copia;
    });
    setError("");
    inputs.current[Math.min(inicio + nuevos.length, 5)]?.focus();
  }

  async function confirmar(e) {
    e.preventDefault();
    const codigo = digitos.join("");
    if (codigo.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      await verificarOtp(codigo);
      navigate(comoEmprendedor ? "/verificar-foto" : "/bienvenida", { state: { comoEmprendedor } });
    } catch (err) {
      setError(err.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  }

  async function reenviar() {
    if (envioEnCurso.current) return;
    envioEnCurso.current = true;
    setReenviando(true);
    setError("");
    try {
      const res = await enviarOtp();
      setCodigoDev(res.otp?.codigoDev ?? null);
      setDigitos(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      envioEnCurso.current = false;
      setReenviando(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-1 text-xs font-medium text-trust">Paso 2 de 3 · Capa 2</div>
        <h1 className="font-display text-3xl font-bold">Verifica tu correo</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-trust" />
          Ingresa el código de 6 dígitos que recibiste por correo. Si no lo tienes o caducó, pulsa «Reenviar código».
        </p>

        {codigoDev && (
          <p className="mt-3 rounded-lg border border-pending/30 bg-pending/10 px-3 py-2 text-xs text-pending">
            Modo desarrollo — código: <span className="font-mono font-bold">{codigoDev}</span>
          </p>
        )}

        <form onSubmit={confirmar} className="mt-8">
          <div className="flex justify-between gap-2">
            {digitos.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                value={d}
                onChange={(e) => onCambiar(i, e.target.value)}
                onKeyDown={(e) => onBorrar(i, e)}
                onPaste={(e) => onPegar(i, e)}
                aria-label={`Dígito ${i + 1} del código`}
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 rounded-xl border border-input bg-background text-center font-display text-2xl font-bold outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" variant="trust" size="lg" className="mt-6 w-full" disabled={loading || digitos.join("").length !== 6}>
            {loading ? (
              <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Verificando…</>
            ) : "Confirmar código"}
          </Button>
        </form>

        <button
          onClick={reenviar}
          disabled={reenviando}
          className="mt-5 flex w-full items-center justify-center gap-1.5 text-sm text-trust hover:underline disabled:opacity-50"
        >
          <RotateCw className={`size-3.5 ${reenviando ? "animate-spin" : ""}`} /> Reenviar código
        </button>
      </motion.div>
    </AuthLayout>
  );
}
