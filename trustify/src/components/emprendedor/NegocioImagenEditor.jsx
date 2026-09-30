import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";
import "./negocioImagenEditor.css";

const limitar = (valor, maximo) => Math.max(-maximo, Math.min(maximo, valor));

export default function NegocioImagenEditor({ archivo, tipo, onClose, onGuardar }) {
  const portada = tipo === "portada";
  const ancho = portada ? 560 : 320;
  const alto = portada ? 160 : 320;
  const [fuente, setFuente] = useState(null);
  const [dimensiones, setDimensiones] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const imagenRef = useRef(null);
  const arrastreRef = useRef(null);

  useEffect(() => {
    const escape = (event) => { if (event.key === "Escape" && !guardando) onClose(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [guardando, onClose]);
  useEffect(() => {
    const url = URL.createObjectURL(archivo);
    setFuente(url);
    setDimensiones(null);
    setError("");
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  function medidas(escala = zoom) {
    if (!dimensiones) return { ancho, alto, maxX: 0, maxY: 0 };
    const base = Math.max(ancho / dimensiones.ancho, alto / dimensiones.alto) * escala;
    const w = dimensiones.ancho * base, h = dimensiones.alto * base;
    return { ancho: w, alto: h, maxX: (w - ancho) / 2, maxY: (h - alto) / 2 };
  }
  function cambiarZoom(valor) {
    const nuevo = Number(valor), m = medidas(nuevo);
    setZoom(nuevo);
    setPosicion((p) => ({ x: limitar(p.x, m.maxX), y: limitar(p.y, m.maxY) }));
  }
  function mover(event) {
    if (!arrastreRef.current) return;
    const m = medidas();
    const escalaPantalla = event.currentTarget.getBoundingClientRect().width / ancho;
    setPosicion({
      x: limitar(arrastreRef.current.x + (event.clientX - arrastreRef.current.clientX) / escalaPantalla, m.maxX),
      y: limitar(arrastreRef.current.y + (event.clientY - arrastreRef.current.clientY) / escalaPantalla, m.maxY),
    });
  }
  async function guardar() {
    if (!imagenRef.current || !dimensiones || guardando) return;
    setGuardando(true); setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = portada ? 1400 : 512;
      canvas.height = portada ? 400 : 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo preparar la imagen.");
      const m = medidas(), factor = canvas.width / ancho;
      ctx.drawImage(imagenRef.current, ((ancho - m.ancho) / 2 + posicion.x) * factor, ((alto - m.alto) / 2 + posicion.y) * factor, m.ancho * factor, m.alto * factor);
      const mime = archivo.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, .9));
      if (!blob) throw new Error("No se pudo preparar la imagen.");
      const nombre = `${tipo}.${mime === "image/png" ? "png" : "jpg"}`;
      await onGuardar(new File([blob], nombre, { type: mime }));
      onClose();
    } catch (err) { setError(err.message || "No se pudo guardar la imagen."); }
    finally { setGuardando(false); }
  }
  const m = medidas();
  return createPortal(
    <div className="avatar-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !guardando) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={`Encuadrar ${tipo}`} className="avatar-modal negocio-imagen-modal">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">Encuadra {portada ? "tu portada" : "tu logo"}</h2><p className="mt-1 text-sm text-muted-foreground">Arrastra la imagen y ajusta el tamaño antes de guardar.</p></div><button type="button" onClick={onClose} disabled={guardando} className="client-icon-button" aria-label="Cerrar"><X className="size-5" /></button></div>
        <div className="negocio-imagen-crop-shell"><div className={`negocio-imagen-crop ${portada ? "is-portada" : "is-logo"}`} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); arrastreRef.current = { clientX: e.clientX, clientY: e.clientY, ...posicion }; }} onPointerMove={mover} onPointerUp={() => { arrastreRef.current = null; }} onPointerCancel={() => { arrastreRef.current = null; }}>
          {fuente && <img ref={imagenRef} src={fuente} alt="Imagen que se va a guardar" draggable="false" onLoad={(e) => setDimensiones({ ancho: e.currentTarget.naturalWidth, alto: e.currentTarget.naturalHeight })} onError={() => { setDimensiones(null); setError("No se pudo abrir esta imagen. Elige otro archivo JPG o PNG."); }} style={{ width: m.ancho, height: m.alto, left: (ancho - m.ancho) / 2 + posicion.x, top: (alto - m.alto) / 2 + posicion.y }} />}
          <div className="negocio-imagen-guide" aria-hidden="true" />
        </div></div>
        <div className="avatar-zoom"><Minus className="size-4" /><input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => cambiarZoom(e.target.value)} aria-label="Tamaño de la imagen" /><Plus className="size-4" /></div>
        <div className="mt-6 flex justify-end"><button type="button" onClick={guardar} disabled={guardando || !dimensiones} className="client-extra-button">{guardando ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Guardar {tipo}</button></div>
        {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
      </div>
    </div>, document.body
  );
}
