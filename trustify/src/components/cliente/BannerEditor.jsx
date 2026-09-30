import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ImagePlus, Loader2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { obtenerBannerPerfilUrl, subirBannerPerfil } from "@/services/authApi";

const ANCHO = 560;
const ALTO = 160;
const limitar = (valor, maximo) => Math.max(-maximo, Math.min(maximo, valor));

export default function BannerEditor({ bannerUrl, onClose, onActualizado }) {
  const inputRef = useRef(null);
  const imagenRef = useRef(null);
  const arrastreRef = useRef(null);
  const temporalRef = useRef(null);
  const [fuente, setFuente] = useState(null);
  const [dimensiones, setDimensiones] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const escape = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("keydown", escape); if (temporalRef.current) URL.revokeObjectURL(temporalRef.current); };
  }, [onClose]);

  function seleccionar(url) { setError(""); setDimensiones(null); setZoom(1); setPosicion({ x: 0, y: 0 }); setFuente(url); }
  async function editarActual() {
    try {
      const url = await obtenerBannerPerfilUrl();
      if (!url) throw new Error("No se pudo cargar el banner actual.");
      if (temporalRef.current) URL.revokeObjectURL(temporalRef.current);
      temporalRef.current = url;
      seleccionar(url);
    } catch (err) { setError(err.message || "No se pudo cargar el banner actual."); }
  }
  function archivoElegido(event) {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;
    if (!["image/jpeg", "image/png"].includes(archivo.type) || archivo.size > 5 * 1024 * 1024) { setError("Elige una imagen JPG o PNG de hasta 5 MB."); return; }
    if (temporalRef.current) URL.revokeObjectURL(temporalRef.current);
    temporalRef.current = URL.createObjectURL(archivo);
    seleccionar(temporalRef.current);
  }
  function medidas(escala = zoom) {
    if (!dimensiones) return { ancho: ANCHO, alto: ALTO, maxX: 0, maxY: 0 };
    const base = Math.max(ANCHO / dimensiones.ancho, ALTO / dimensiones.alto) * escala;
    const ancho = dimensiones.ancho * base, alto = dimensiones.alto * base;
    return { ancho, alto, maxX: (ancho - ANCHO) / 2, maxY: (alto - ALTO) / 2 };
  }
  function cambiarZoom(valor) {
    const nuevo = Number(valor), m = medidas(nuevo);
    setZoom(nuevo);
    setPosicion(p => ({ x: limitar(p.x, m.maxX), y: limitar(p.y, m.maxY) }));
  }
  function mover(event) {
    if (!arrastreRef.current) return;
    const m = medidas();
    const escala = event.currentTarget.getBoundingClientRect().width / ANCHO;
    setPosicion({ x: limitar(arrastreRef.current.x + (event.clientX - arrastreRef.current.clientX) / escala, m.maxX), y: limitar(arrastreRef.current.y + (event.clientY - arrastreRef.current.clientY) / escala, m.maxY) });
  }
  async function guardar() {
    if (!imagenRef.current || !dimensiones) return;
    setGuardando(true); setError("");
    try {
      const lienzo = document.createElement("canvas"); lienzo.width = 1400; lienzo.height = 400;
      const ctx = lienzo.getContext("2d");
      if (!ctx) throw new Error("No se pudo preparar el banner.");
      const m = medidas(), factor = lienzo.width / ANCHO;
      ctx.drawImage(imagenRef.current, ((ANCHO - m.ancho) / 2 + posicion.x) * factor, ((ALTO - m.alto) / 2 + posicion.y) * factor, m.ancho * factor, m.alto * factor);
      const blob = await new Promise(resolve => lienzo.toBlob(resolve, "image/jpeg", .9));
      if (!blob) throw new Error("No se pudo preparar el banner.");
      const actualizado = await subirBannerPerfil(new File([blob], "banner.jpg", { type: "image/jpeg" }));
      onActualizado(actualizado);
      onClose();
    } catch (e) { setError(e.message); } finally { setGuardando(false); }
  }
  const m = medidas();
  return createPortal(<div className="avatar-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-label="Editar banner" className="avatar-modal banner-modal">
      <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">{fuente ? "Encuadra tu banner" : "Editar banner"}</h2><p className="mt-1 text-sm text-muted-foreground">{fuente ? "Arrastra la imagen y ajusta el tamaño antes de guardar." : "Sube una foto JPG o PNG y elige qué parte se verá en tu perfil."}</p></div><button type="button" onClick={onClose} className="client-icon-button" aria-label="Cerrar"><X className="size-5" /></button></div>
      {!fuente ? <><button type="button" className="avatar-upload-choice" onClick={() => inputRef.current?.click()}><ImagePlus className="size-10" /><strong>Subir imagen</strong><span>JPG o PNG · hasta 5 MB</span></button><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="sr-only" onChange={archivoElegido} />{bannerUrl && <button type="button" className="client-extra-link mt-4" onClick={editarActual}>Editar banner actual</button>}</> : <><div className="avatar-crop-shell banner-crop-shell"><div className="banner-crop" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); arrastreRef.current = { clientX: e.clientX, clientY: e.clientY, ...posicion }; }} onPointerMove={mover} onPointerUp={() => { arrastreRef.current = null; }} onPointerCancel={() => { arrastreRef.current = null; }}><img ref={imagenRef} src={fuente} alt="Vista previa del banner" draggable="false" onLoad={e => setDimensiones({ ancho: e.currentTarget.naturalWidth, alto: e.currentTarget.naturalHeight })} style={{ width: m.ancho, height: m.alto, left: (ANCHO - m.ancho) / 2 + posicion.x, top: (ALTO - m.alto) / 2 + posicion.y }} /><div className="banner-crop-guide" aria-hidden="true" /></div></div><div className="avatar-zoom"><Minus className="size-4" /><input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e => cambiarZoom(e.target.value)} aria-label="Tamaño del banner" /><Plus className="size-4" /></div><div className="mt-6 flex flex-wrap justify-between gap-3"><button type="button" onClick={() => seleccionar(null)} className="client-extra-link"><RotateCcw className="size-4" /> Elegir otra</button><button type="button" onClick={guardar} disabled={guardando || !dimensiones} className="client-extra-button">{guardando ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Guardar banner</button></div></>}
      {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  </div>, document.body);
}
