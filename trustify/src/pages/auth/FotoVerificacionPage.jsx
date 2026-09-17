import { useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, AlertCircle, ShieldCheck, X } from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { subirFotoVerificacion } from "@/services/authApi";

export default function FotoVerificacionPage() {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const comoEmprendedor = location.state?.comoEmprendedor ?? false;

  function elegirArchivo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function enviar() {
    if (!archivo) return;
    setError("");
    setLoading(true);
    try {
      await subirFotoVerificacion(archivo);
      setEnviado(true);
    } catch (err) {
      setError(err.message || "No se pudo subir la foto");
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <AuthLayout>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-verified/10 text-verified">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Foto recibida</h1>
          <p className="mt-2 text-muted-foreground">
            Tu identidad está en revisión — te avisaremos cuando se apruebe.
            Mientras tanto, ya puedes seguir usando tu cuenta.
          </p>

          {comoEmprendedor ? (
            <Button variant="trust" size="lg" className="mt-6 w-full" onClick={() => navigate("/negocio/activar")}>
              Continuar a activar mi negocio
            </Button>
          ) : (
            <Button variant="trust" size="lg" className="mt-6 w-full" onClick={() => navigate("/")}>
              Ir al inicio
            </Button>
          )}
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-1 text-xs font-medium text-trust">Paso 3 de 3 · Capa 3</div>
        <h1 className="font-display text-3xl font-bold">Foto con tu cédula</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sostén tu cédula junto a tu rostro, que ambos se vean con claridad.
        </p>

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={elegirArchivo} className="hidden" />

        {preview ? (
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-border">
            <img src={preview} alt="Vista previa" className="h-64 w-full object-cover" />
            <button
              onClick={() => { setArchivo(null); setPreview(null); }}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-6 flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-trust/40 hover:text-trust"
          >
            <Camera className="size-10" />
            <span className="text-sm font-medium">Toca para elegir o tomar una foto</span>
            <span className="text-xs">JPG, PNG o WEBP</span>
          </button>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}

        <Button variant="trust" size="lg" className="mt-6 w-full" disabled={!archivo || loading} onClick={enviar}>
          {loading ? (
            <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Subiendo…</>
          ) : (
            <><Upload className="size-4" /> Enviar foto</>
          )}
        </Button>

        <Link
          to={comoEmprendedor ? "/negocio/activar" : "/"}
          className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Hacerlo más tarde
        </Link>
      </motion.div>
    </AuthLayout>
  );
}