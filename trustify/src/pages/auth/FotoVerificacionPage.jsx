import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Camera, CameraOff, Check, CreditCard, RotateCcw, ScanFace, Upload, X } from "lucide-react";
import AuthLayout from "@/pages/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { subirFotoVerificacion } from "@/services/authApi";
import "./fotoVerificacion.css";

export default function FotoVerificacionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reducirMovimiento = useReducedMotion();
  const comoEmprendedor = location.state?.comoEmprendedor ?? false;
  const destino = typeof location.state?.from === "string" && location.state.from.startsWith("/") ? location.state.from : null;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const inputRef = useRef(null);
  const previewRef = useRef({});
  const [etapa, setEtapa] = useState("cedula");
  const [cara, setCara] = useState("frente");
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [iniciandoCamara, setIniciandoCamara] = useState(false);
  const [archivos, setArchivos] = useState({ frente: null, reverso: null, selfie: null });
  const [previews, setPreviews] = useState({ frente: null, reverso: null, selfie: null });
  const preview = previews[cara];
  const [enviando, setEnviando] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [recibida, setRecibida] = useState(false);
  const [error, setError] = useState("");

  function detenerCamara() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamaraActiva(false);
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    Object.values(previewRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function abrirCamara() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite abrir la cámara aquí. Usa «Elegir foto» para tomarla con tu dispositivo.");
      return;
    }
    setError("");
    setIniciandoCamara(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false, video: { facingMode: etapa === "biometria" ? "user" : "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      setCamaraActiva(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => setError("No se pudo mostrar la cámara. Prueba con «Elegir foto»."));
        }
      });
    } catch {
      setError("No pudimos abrir la cámara. Revisa el permiso del navegador o usa «Elegir foto».");
    } finally {
      setIniciandoCamara(false);
    }
  }

  function elegirFoto(foto) {
    if (!foto) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(foto.type)) {
      setError("Elige una foto JPG, PNG o WEBP.");
      return;
    }
    if (previewRef.current[cara]) URL.revokeObjectURL(previewRef.current[cara]);
    const url = URL.createObjectURL(foto);
    previewRef.current[cara] = url;
    setPreviews((prev) => ({ ...prev, [cara]: url }));
    setArchivos((prev) => ({ ...prev, [cara]: foto }));
    setError("");
    detenerCamara();
  }

  function tomarFoto() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setError("Espera a que la cámara muestre tu imagen para tomar la foto.");
      return;
    }
    const canvas = document.createElement("canvas");
    const escala = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * escala);
    canvas.height = Math.round(video.videoHeight * escala);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) { setError("No se pudo capturar la foto. Inténtalo otra vez."); return; }
      elegirFoto(new File([blob], cara === "selfie" ? "selfie.jpg" : `${cara}-cedula.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", .86);
  }

  function repetir() {
    setArchivos((prev) => ({ ...prev, [cara]: null }));
    setPreviews((prev) => ({ ...prev, [cara]: null }));
    setError("");
    if (previewRef.current[cara]) URL.revokeObjectURL(previewRef.current[cara]);
    delete previewRef.current[cara];
  }

  async function avanzarABiometria() {
    if (!archivos.frente || !archivos.reverso || enviando) return;
    setError("");
    setEnviando(true);
    try {
      await subirFotoVerificacion(archivos.frente, archivos.reverso);
      detenerCamara();
      setEtapa("biometria");
      setCara("selfie");
    } catch (err) {
      setError(err.message || "No se pudo enviar la foto. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  function revisarBiometria() {
    if (!archivos.selfie || escaneando) return;
    setEscaneando(true);
    window.setTimeout(() => {
      setEscaneando(false);
      setRecibida(true);
    }, reducirMovimiento ? 650 : 1500);
  }

  if (recibida) return <AuthLayout>
    <div className="biometry-success" role="status" aria-live="polite">
      <motion.div className="biometry-success-seal" initial={reducirMovimiento ? false : { scale: .55, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 210, damping: 17 }}>
        {!reducirMovimiento && <><motion.span className="biometry-success-ring" initial={{ scale: .6, opacity: .8 }} animate={{ scale: 1.36, opacity: 0 }} transition={{ duration: .8, delay: .18 }} /><motion.span className="biometry-success-ring" initial={{ scale: .6, opacity: .8 }} animate={{ scale: 1.65, opacity: 0 }} transition={{ duration: 1, delay: .25 }} /></>}
        <Check size={54} strokeWidth={2.8} aria-hidden="true" />
      </motion.div>
      <p className="biometry-success-step">Documento enviado</p>
      <h1>Verificación pendiente de revisión</h1>
      <p>Recibimos tu cédula (frente y reverso) y tu verificación facial. Un administrador revisará todo y te notificaremos el resultado.</p>
      <Button variant="trust" size="lg" className="mt-7 w-full" onClick={() => navigate(destino || (comoEmprendedor ? "/negocio/activar" : "/bienvenida"), { replace: true })}>
        {comoEmprendedor ? "Continuar como emprendedor" : "Continuar como cliente"}
      </Button>
    </div>
  </AuthLayout>;

  const enBiometria = etapa === "biometria";

  return <AuthLayout>
    <div className="biometry-page">
      <div className="biometry-step"><span>1</span> Datos <i /><span>2</span> Correo <i /><span className={enBiometria ? "" : "active"}>3</span> Cédula <i /><span className={enBiometria ? "active" : "future"}>4</span> Biometría</div>
      {enBiometria ? <>
        <h1>Verifica tu rostro</h1>
        <p className="biometry-lead">Alinea tu rostro dentro del óvalo, con buena luz y sin lentes oscuros. Esta foto se envía junto con tu cédula para la revisión.</p>
      </> : <>
        <h1>Fotografía tu cédula por ambos lados</h1>
        <p className="biometry-lead">Toma una foto clara del frente y otra del reverso. Los datos deben leerse completos y sin reflejos.</p>
      </>}
      {!enBiometria && <div className="kyc-sides" role="group" aria-label="Caras de la cédula">
        {["frente", "reverso"].map((lado) => <button key={lado} type="button" onClick={() => { detenerCamara(); setCara(lado); setError(""); }} className={`kyc-side ${cara === lado ? "active" : ""}`} aria-pressed={cara === lado}>
          {archivos[lado] ? <Check size={17} /> : <CreditCard size={17} />}
          {lado === "frente" ? "Frente de la cédula" : "Reverso de la cédula"}
        </button>)}
      </div>}
      <div className="biometry-stage">
        {preview ? <>
          <img src={preview} alt={enBiometria ? "Vista previa de tu rostro" : `Vista previa del ${cara} de la cédula`} className="biometry-preview" />
          {!escaneando && <button type="button" onClick={repetir} className="biometry-stage-close" aria-label="Descartar foto"><X size={18} /></button>}
          {escaneando && <div className="biometry-scan-overlay" aria-hidden="true">
            <motion.div className="biometry-scan-line" initial={{ top: "0%" }} animate={{ top: "100%" }} transition={reducirMovimiento ? { duration: 0 } : { duration: 1.4, ease: "linear" }} />
          </div>}
        </> : <>
          <video ref={videoRef} autoPlay muted playsInline className={camaraActiva ? "biometry-video active" : "biometry-video"} aria-label="Vista en vivo de la cámara" />
          {!camaraActiva && <div className="biometry-stage-empty">
            {enBiometria ? <ScanFace size={40} strokeWidth={1.5} /> : <CreditCard size={40} strokeWidth={1.5} />}
            <strong>{enBiometria ? "Tu rostro" : cara === "frente" ? "Frente de la cédula" : "Reverso de la cédula"}</strong>
            <span>La cámara solo se abre cuando tú lo indiques.</span>
          </div>}
          {camaraActiva && <div className={enBiometria ? "biometry-guide" : "kyc-card-guide"} aria-hidden="true" />}
        </>}
        <span className="biometry-stage-label">
          {escaneando ? "Verificando tu rostro…" : preview ? (enBiometria ? "Confirma que se vea tu rostro completo" : "Comprueba que los datos sean legibles") : enBiometria ? "Captura tu rostro" : `Captura el ${cara}`}
        </span>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture={enBiometria ? "user" : "environment"} onChange={event => { elegirFoto(event.target.files?.[0]); event.target.value = ""; }} className="sr-only" aria-label={enBiometria ? "Elegir foto de tu rostro" : `Elegir foto del ${cara}`} />
      {error && <div role="alert" className="biometry-error"><AlertCircle size={18} />{error}</div>}
      {preview ? <div className="biometry-actions">
        <Button variant="outline" size="lg" onClick={repetir} disabled={escaneando}><RotateCcw size={17} /> Repetir foto</Button>
        {!enBiometria && cara === "frente" && <Button variant="trust" size="lg" onClick={() => setCara("reverso")}>Fotografiar reverso</Button>}
        {enBiometria && <Button variant="trust" size="lg" onClick={revisarBiometria} disabled={escaneando}><ScanFace size={17} /> {escaneando ? "Verificando…" : "Verificar rostro"}</Button>}
      </div> : camaraActiva ? <div className="biometry-actions"><Button variant="outline" size="lg" onClick={detenerCamara}><CameraOff size={17} /> Cerrar cámara</Button><Button variant="trust" size="lg" onClick={tomarFoto}><Camera size={17} /> Tomar foto</Button></div> : <div className="biometry-actions"><Button variant="trust" size="lg" onClick={abrirCamara} disabled={iniciandoCamara}><Camera size={17} /> {iniciandoCamara ? "Abriendo…" : "Abrir cámara"}</Button><Button variant="outline" size="lg" onClick={() => inputRef.current?.click()}><Upload size={17} /> Elegir foto</Button></div>}
      {!enBiometria && <>
        <Button variant="verified" size="lg" className="mt-4 w-full" onClick={avanzarABiometria} disabled={!archivos.frente || !archivos.reverso || enviando}><Upload size={17} /> {enviando ? "Enviando cédula…" : "Continuar a verificación facial"}</Button>
        <p className="biometry-footnote">Solo el equipo administrador revisa la cédula. Las imágenes se eliminan del servidor tras aprobar o rechazar la revisión.</p>
      </>}
    </div>
  </AuthLayout>;
}
