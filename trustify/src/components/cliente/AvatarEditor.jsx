import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Check, ImagePlus, Loader2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { listarFotosPerfilRecientes, obtenerFotoPerfilRecienteUrl, subirFotoPerfil } from "@/services/authApi";

const LADO = 320;
const limitar = (valor, maximo) => Math.max(-maximo, Math.min(maximo, valor));

export default function AvatarEditor({ onClose, onActualizado }) {
  const inputRef = useRef(null);
  const imagenRef = useRef(null);
  const arrastreRef = useRef(null);
  const temporalRef = useRef(null);
  const cerrarRef = useRef(onClose);
  cerrarRef.current = onClose;
  const [recientes, setRecientes] = useState([]);
  const [fuente, setFuente] = useState(null);
  const [dimensiones, setDimensiones] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const urls = [];
    listarFotosPerfilRecientes().then(async lista => {
      const items = await Promise.all(lista.slice(0, 6).map(async foto => {
        try { const url = await obtenerFotoPerfilRecienteUrl(foto.id); urls.push(url); return { ...foto, url }; }
        catch { return null; }
      }));
      if (activo) setRecientes(items.filter(Boolean));
    }).catch(() => {});
    const escape = e => { if (e.key === "Escape") cerrarRef.current(); };
    window.addEventListener("keydown", escape);
    return () => { activo = false; urls.forEach(url => URL.revokeObjectURL(url)); window.removeEventListener("keydown", escape); if (temporalRef.current) URL.revokeObjectURL(temporalRef.current); };
  }, []);

  function seleccionar(url) { setError(""); setDimensiones(null); setZoom(1); setPosicion({ x: 0, y: 0 }); setFuente(url); }
  function archivoElegido(e) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type) || archivo.size > 5 * 1024 * 1024) { setError("Elige una imagen JPG, PNG o WEBP de hasta 5 MB."); return; }
    if (temporalRef.current) URL.revokeObjectURL(temporalRef.current);
    temporalRef.current = URL.createObjectURL(archivo);
    seleccionar(temporalRef.current);
  }
  function medidas(escala = zoom) {
    if (!dimensiones) return { ancho: LADO, alto: LADO, maxX: 0, maxY: 0 };
    const base = Math.max(LADO / dimensiones.ancho, LADO / dimensiones.alto) * escala;
    const ancho = dimensiones.ancho * base, alto = dimensiones.alto * base;
    return { ancho, alto, maxX: (ancho - LADO) / 2, maxY: (alto - LADO) / 2 };
  }
  function cambiarZoom(valor) { const nuevo = Number(valor); const m = medidas(nuevo); setZoom(nuevo); setPosicion(p => ({ x: limitar(p.x, m.maxX), y: limitar(p.y, m.maxY) })); }
  function mover(e) {
    if (!arrastreRef.current) return;
    const m = medidas();
    const escalaPantalla = e.currentTarget.getBoundingClientRect().width / LADO;
    setPosicion({ x: limitar(arrastreRef.current.x + (e.clientX - arrastreRef.current.clientX) / escalaPantalla, m.maxX), y: limitar(arrastreRef.current.y + (e.clientY - arrastreRef.current.clientY) / escalaPantalla, m.maxY) });
  }
  async function guardar() {
    const imagen = imagenRef.current;
    if (!imagen || !dimensiones) return;
    setGuardando(true); setError("");
    try {
      const lienzo = document.createElement("canvas"); lienzo.width = 512; lienzo.height = 512;
      const ctx = lienzo.getContext("2d");
      const m = medidas(); const factor = 512 / LADO;
      ctx.drawImage(imagen, ((LADO - m.ancho) / 2 + posicion.x) * factor, ((LADO - m.alto) / 2 + posicion.y) * factor, m.ancho * factor, m.alto * factor);
      const blob = await new Promise(resolve => lienzo.toBlob(resolve, "image/jpeg", .9));
      if (!blob) throw new Error("No se pudo preparar la imagen. Inténtalo de nuevo.");
      const actualizado = await subirFotoPerfil(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      onActualizado(actualizado);
      onClose();
    } catch (e) { setError(e.message); } finally { setGuardando(false); }
  }
  const m = medidas();
  return createPortal(<div className="avatar-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-label={fuente ? "Encuadrar foto de perfil" : "Seleccionar foto de perfil"} className="avatar-modal">
      <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">{fuente ? "Encuadra tu foto" : "Elige tu imagen"}</h2><p className="mt-1 text-sm text-muted-foreground">{fuente ? "Arrastra para centrarla y ajusta el tamaño." : "Sube una imagen o vuelve a usar una de tus seis fotos recientes."}</p></div><button type="button" onClick={onClose} className="client-icon-button" aria-label="Cerrar"><X className="size-5" /></button></div>
      {!fuente ? <>
        <button type="button" className="avatar-upload-choice" onClick={() => inputRef.current?.click()}><ImagePlus className="size-10" /><strong>Subir imagen</strong><span>JPG, PNG o WEBP · hasta 5 MB</span></button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={archivoElegido} />
        <h3 className="mt-7 font-display font-bold">Fotos recientes</h3>
        {recientes.length ? <div className="avatar-recents">{recientes.map(foto => <button type="button" key={foto.id} onClick={() => seleccionar(foto.url)} aria-label="Elegir foto reciente"><img src={foto.url} alt="" /></button>)}</div> : <p className="mt-3 text-sm text-muted-foreground">Tus fotos anteriores aparecerán aquí después de subirlas.</p>}
      </> : <>
        <div className="avatar-crop-shell"><div className="avatar-crop" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); arrastreRef.current = { clientX: e.clientX, clientY: e.clientY, ...posicion }; }} onPointerMove={mover} onPointerUp={() => { arrastreRef.current = null; }} onPointerCancel={() => { arrastreRef.current = null; }}>
          <img ref={imagenRef} src={fuente} alt="Imagen que se va a recortar" draggable="false" onLoad={e => setDimensiones({ ancho: e.currentTarget.naturalWidth, alto: e.currentTarget.naturalHeight })} style={{ width: m.ancho, height: m.alto, left: (LADO - m.ancho) / 2 + posicion.x, top: (LADO - m.alto) / 2 + posicion.y }} />
          <div className="avatar-crop-guide" aria-hidden="true" />
        </div></div>
        <div className="avatar-zoom"><Minus className="size-4" /><input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e => cambiarZoom(e.target.value)} aria-label="Tamaño de la foto" /><Plus className="size-4" /></div>
        <div className="mt-6 flex flex-wrap justify-between gap-3"><button type="button" onClick={() => seleccionar(null)} className="client-extra-link"><RotateCcw className="size-4" /> Elegir otra</button><button type="button" onClick={guardar} disabled={guardando || !dimensiones} className="client-extra-button">{guardando ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Guardar foto</button></div>
      </>}
      {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  </div>, document.body);
}
