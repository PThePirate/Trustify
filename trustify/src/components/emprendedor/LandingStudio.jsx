import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Eye, ImagePlus, LayoutTemplate, LockKeyhole, Palette, Plus, Save, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BLOQUES, nuevoBloque } from "@/components/emprendedor/LandingBloques";
import LandingBloquesVista from "@/components/emprendedor/LandingBloques";
import LandingStudioFields from "./LandingStudioFields";
import { guardarLandingBloques, subirImagenLanding, subirVideoLanding, obtenerMediosPlan, listarCatalogo, resolverImagenNegocio } from "@/services/negocioApi";
import { COLORES_INICIALES, PALETAS_LANDING, leerColoresLanding, estiloColoresLanding } from "./landingColores";
import "./landingColores.css";

const PATRONES = [
  { nombre: "Presentación", descripcion: "Título, historia, beneficios y contacto", tipos: ["titulo", "texto", "lista", "contacto"] },
  { nombre: "Vitrina", descripcion: "Imagen, catálogo, confianza y conversación", tipos: ["imagen", "catalogo", "confianza", "contacto"] },
  { nombre: "Preguntas y respuestas", descripcion: "Resuelve dudas antes de conversar", tipos: ["titulo", "acordeon", "contacto"], escala: true },
  { nombre: "Historia visual", descripcion: "Galería, vídeo y servicios", tipos: ["galeria", "video", "catalogo"], escala: true },
];

export default function LandingStudio({ negocio, suscripcion, onGuardado }) {
  const [bloques, setBloques] = useState((negocio.landingBloques || []).filter(b => b.tipo !== "tema"));
  const [colores, setColores] = useState(() => leerColoresLanding(negocio.landingBloques) || COLORES_INICIALES);
  const [coloresActivados, setColoresActivados] = useState(() => Boolean(leerColoresLanding(negocio.landingBloques)));
  const [seleccion, setSeleccion] = useState(null);
  const [pestana, setPestana] = useState("Bloques");
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [catalogo, setCatalogo] = useState([]);
  const [medios, setMedios] = useState(null);
  const [sucio, setSucio] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const esEscala = Boolean(suscripcion?.plan?.incluyeAnaliticaAvanzada);
  const esEmprende = esEscala || suscripcion?.plan?.nombre === "pro";
  useEffect(() => { setBloques((negocio.landingBloques || []).filter(b => b.tipo !== "tema")); setColores(leerColoresLanding(negocio.landingBloques) || COLORES_INICIALES); setColoresActivados(Boolean(leerColoresLanding(negocio.landingBloques))); setSucio(false); }, [negocio.id]);
  useEffect(() => { listarCatalogo().then(setCatalogo).catch(() => setCatalogo([])); }, [negocio.id]);
  useEffect(() => { obtenerMediosPlan().then(setMedios).catch(() => setMedios(null)); }, [negocio.id]);
  const activo = bloques.find(b => b.id === seleccion);
  const filtrados = useMemo(() => BLOQUES.filter(b => b.nombre.toLowerCase().includes(busqueda.toLowerCase()) || b.grupo.toLowerCase().includes(busqueda.toLowerCase())), [busqueda]);

  function cambiar(next) { setBloques(next); setSucio(true); setMensaje(""); }
  function cambiarColores(next) { setColores(next); setColoresActivados(true); setSucio(true); setMensaje(""); }
  function agregar(tipo) { const nuevo = nuevoBloque(tipo); cambiar([...bloques, nuevo]); setSeleccion(nuevo.id); }
  function modificar(campo, valor) { cambiar(bloques.map(b => b.id === seleccion ? { ...b, [campo]: valor } : b)); }
  function mover(id, delta) { const next = [...bloques]; const i = next.findIndex(b => b.id === id); const j = i + delta; if (i < 0 || j < 0 || j >= next.length) return; [next[i], next[j]] = [next[j], next[i]]; cambiar(next); }
  async function guardar() { setGuardando(true); setMensaje(""); try { const n = await guardarLandingBloques(coloresActivados ? [...bloques, { id: "tema-global", tipo: "tema", ...colores }] : bloques); onGuardado(n); setSucio(false); obtenerMediosPlan().then(setMedios).catch(() => {}); setMensaje("Página guardada. Los colores y bloques ya están visibles en la landing publicada."); } catch (err) { setMensaje(err.message); } finally { setGuardando(false); } }
  async function subirImagen(e) { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; setSubiendo(true); try { const data = await subirImagenLanding(file); if (["galeria", "mosaico", "antesdespues"].includes(activo?.tipo)) modificar("items", [...activo.items, data.url].slice(0, activo.tipo === "antesdespues" ? 2 : 12)); else if (activo?.tipo === "imagen") modificar("url", data.url); else { const b = { ...nuevoBloque("imagen"), url: data.url }; cambiar([...bloques, b]); setSeleccion(b.id); } } catch (err) { setMensaje(err.message); } finally { setSubiendo(false); } }
  async function subirVideo(e) { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; setSubiendo(true); setMensaje(""); try { if (file.type !== "video/mp4" || !file.name.toLowerCase().endsWith(".mp4")) throw new Error("Sube un video MP4"); const data = await subirVideoLanding(file); if (activo?.tipo === "video") modificar("url", data.url); else { const b = { ...nuevoBloque("video"), url: data.url }; cambiar([...bloques, b]); setSeleccion(b.id); } } catch (err) { setMensaje(err.message); } finally { setSubiendo(false); } }

  return <section className="landing-studio" aria-label="Editor de la landing">
    <div className="landing-studio-top"><div><span className="landing-studio-kicker"><LayoutTemplate size={15} /> Editor de página</span><h2>Construye tu Mini Landing</h2><p>Agrega bloques, ordénalos y publica una página que hable por tu negocio.</p></div><div className="landing-studio-actions">{negocio.slug && <a href={`/negocio/publico/${negocio.slug}`} target="_blank" rel="noopener noreferrer" className="landing-studio-preview"><Eye size={16} /> Ver página <span aria-hidden="true">↗</span></a>}<button type="button" onClick={guardar} disabled={!sucio || guardando} className="landing-studio-save"><Save size={16} /> {guardando ? "Guardando…" : "Guardar página"}</button></div></div>
    {mensaje && <p className="landing-studio-message" role="status">{mensaje}</p>}
    <div className="landing-studio-grid">
      <aside className="landing-studio-library"><div className="landing-studio-tabs">{["Bloques", "Patrones", "Medios", "Colores"].map(t => <button key={t} type="button" className={pestana === t ? "active" : ""} onClick={() => setPestana(t)}>{t}</button>)}</div>
        {pestana === "Bloques" && <><label className="landing-studio-search"><Search size={16} /><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar bloques" /></label><div className="landing-studio-tools">{["Texto", "Medios", "Diseño", "Negocio"].map(grupo => { const items = filtrados.filter(b => b.grupo === grupo); return items.length ? <div key={grupo}><h3>{grupo}</h3><div className="landing-studio-toolgrid">{items.map(b => { const bloqueado = (b.plan === "Plus" && !esEscala) || (b.plan === "Básico" && !esEmprende); return <button key={b.tipo} type="button" disabled={bloqueado} onClick={() => agregar(b.tipo)} title={bloqueado ? `Disponible en Plan ${b.plan}` : `Agregar ${b.nombre}`}><span className="landing-tool-icon">{b.icono}</span><span>{b.nombre}</span>{b.plan !== "Básico" && <small>{bloqueado ? <LockKeyhole size={12} /> : b.plan}</small>}</button>; })}</div></div> : null; })}</div></>}
        {pestana === "Patrones" && <div className="landing-studio-patterns">{PATRONES.map(p => <button key={p.nombre} type="button" disabled={p.escala ? !esEscala : !esEmprende && p.tipos.some(t => BLOQUES.find(b => b.tipo === t)?.plan === "Emprende")} onClick={() => { const añadidos = p.tipos.map(nuevoBloque); cambiar([...bloques, ...añadidos]); setSeleccion(añadidos[0].id); }}><LayoutTemplate size={19} /><strong>{p.nombre}</strong><small>{p.descripcion}</small>{p.escala && <em>Plan Plus</em>}</button>)}</div>}
        {pestana === "Medios" && <div className="landing-studio-media"><ImagePlus size={35} /><strong>Imágenes de tu negocio</strong><p>Sube JPG, PNG o WEBP y colócalos en una imagen o galería. Los videos MP4 pueden durar hasta 45 segundos.</p><button type="button" onClick={() => inputRef.current?.click()} disabled={subiendo}>{subiendo ? "Subiendo…" : "Subir imagen"}</button><button type="button" onClick={() => videoRef.current?.click()} disabled={subiendo}>{subiendo ? "Subiendo…" : "Subir video MP4"}</button>{medios && <p>{medios.fotosUsadas}/{medios.fotosPermitidas} fotos · {medios.videosUsados}/{medios.videosPermitidos} videos en uso</p>}<input ref={videoRef} type="file" accept="video/mp4,.mp4" className="sr-only" onChange={subirVideo} /><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={subirImagen} /></div>}
        {pestana === "Colores" && <div className="landing-color-editor"><h3><Palette size={17} /> Colores generales</h3><p>Elige una combinación o ajusta cada color. Verás el resultado antes de guardar.</p><div className="landing-color-palettes">{PALETAS_LANDING.map(paleta => <button key={paleta.nombre} type="button" onClick={() => cambiarColores(paleta.colores)}><span style={{ background: paleta.colores.colorFondo, color: paleta.colores.colorAcento }}>●<i style={{ background: paleta.colores.colorTitulo }} /></span>{paleta.nombre}</button>)}</div>{[["colorFondo", "Fondo"], ["colorTitulo", "Títulos"], ["colorTexto", "Texto"], ["colorAcento", "Acentos"]].map(([clave, nombre]) => <label key={clave}>{nombre}<input type="color" value={colores[clave]} onChange={e => cambiarColores({ ...colores, [clave]: e.target.value })} /><code>{colores[clave]}</code></label>)}</div>}
      </aside>
      <div className="landing-studio-canvas"><div className="landing-studio-canvasbar"><span>Vista de la página</span><span>{bloques.length} bloques {sucio && "· Cambios sin guardar"}</span></div><div className="landing-studio-page landing-colors-preview" style={estiloColoresLanding(coloresActivados ? colores : null)}><header><span>CheckBiz / {negocio.nombreComercial}</span><strong>{negocio.nombreComercial}</strong><p>{negocio.slogan || negocio.descripcionCorta || "Tu negocio, tu historia, tus clientes."}</p></header>{bloques.length ? bloques.map((b, i) => <div key={b.id} className={`landing-studio-block ${seleccion === b.id ? "selected" : ""}`} onClick={() => setSeleccion(b.id)}><div className="landing-studio-blockbar"><span>{BLOQUES.find(item => item.tipo === b.tipo)?.nombre}</span><div><button type="button" onClick={e => { e.stopPropagation(); mover(b.id, -1); }} disabled={i === 0} aria-label="Subir bloque"><ArrowUp size={14} /></button><button type="button" onClick={e => { e.stopPropagation(); mover(b.id, 1); }} disabled={i === bloques.length - 1} aria-label="Bajar bloque"><ArrowDown size={14} /></button><button type="button" onClick={e => { e.stopPropagation(); cambiar(bloques.filter(x => x.id !== b.id)); if (seleccion === b.id) setSeleccion(null); }} aria-label="Eliminar bloque"><Trash2 size={14} /></button></div></div><LandingBloquesVista bloques={[b]} negocio={{...negocio,catalogo}} editor /></div>) : <div className="landing-studio-base-preview"><div className="landing-studio-base-cover" style={negocio.fotoPortadaUrl ? { backgroundImage: `url(${resolverImagenNegocio(negocio.fotoPortadaUrl)})` } : undefined} /><div className="landing-studio-base-body"><div className="landing-studio-base-identity">{negocio.logoUrl && <img src={resolverImagenNegocio(negocio.logoUrl)} alt="" />}<div><strong>{negocio.nombreComercial}</strong><small>{negocio.categoria?.nombre}{negocio.ciudad ? ` · ${negocio.ciudad}` : ""}</small></div></div><h2>{negocio.slogan || negocio.nombreComercial}</h2><p>{negocio.descripcionCorta || "Tu descripción aparecerá aquí cuando la guardes."}</p><span className="landing-studio-base-cta">Contáctenos</span><div className="landing-studio-base-note"><LayoutTemplate size={17} /><span>Esta es la base de tu página publicada. Añade bloques si quieres mostrar más contenido.</span></div></div></div>}<button type="button" className="landing-studio-add" onClick={() => agregar("texto")}><Plus size={16} /> Añadir bloque</button></div></div>
      <aside className="landing-studio-settings"><div className="landing-studio-settinghead"><h3>{activo ? `Editar ${BLOQUES.find(b => b.tipo === activo.tipo)?.nombre}` : "Ajustes de página"}</h3><p>{activo ? "Los cambios aparecen al instante en el lienzo." : "Selecciona un bloque para editar su contenido."}</p></div>{activo ? <LandingStudioFields activo={activo} modificar={modificar} inputRef={inputRef} videoRef={videoRef} /> : <div className="landing-studio-plan"><Check size={18} /><strong>Plan {esEscala ? "Plus" : "Básico"}</strong><p>{esEscala ? "Tienes todos los bloques disponibles." : "Incluye los bloques comerciales esenciales. Los bloques avanzados están en Plus."}</p>{!esEscala && <Link to="/negocio/planes">Comparar herramientas por plan</Link>}</div>}</aside>
    </div>
  </section>;
}





