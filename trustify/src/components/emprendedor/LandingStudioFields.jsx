const SIN_TITULO = new Set(["texto", "lista", "cita", "columnas", "acordeon", "pestanas", "separador", "espaciador", "subtitulo"]);
const CON_TEXTO = new Set(["texto", "lista", "cita", "contacto", "columnas", "acordeon", "pestanas", "subtitulo", "destacado", "pasos", "servicios", "horario", "ubicacion", "precios", "garantias", "equipo", "aviso", "comparativa", "cronologia", "indicadores", "ficha", "proceso", "recursos", "testimonio", "agenda"]);
const POR_LINEAS = new Set(["lista", "columnas", "acordeon", "pestanas", "pasos", "servicios", "horario", "precios", "garantias", "equipo", "comparativa", "cronologia", "indicadores", "ficha", "proceso", "recursos"]);
const CON_ITEMS = new Set(["galeria", "columnas", "acordeon", "pestanas", "pasos", "servicios", "precios", "equipo", "comparativa", "cronologia", "indicadores", "mosaico", "antesdespues", "ficha", "proceso", "recursos", "contacto"]);
const IMAGENES_MULTIPLES = new Set(["galeria", "mosaico", "antesdespues"]);

function etiquetaItems(tipo) {
  if (IMAGENES_MULTIPLES.has(tipo)) return "Imágenes, una URL por línea";
  if (tipo === "indicadores") return "Cifras, una por cada indicador";
  if (tipo === "precios") return "Precios, uno por cada servicio";
  if (tipo === "recursos") return "Enlaces HTTPS, uno por cada recurso";
  if (tipo === "contacto") return "Redes sociales (TikTok, Facebook o Instagram), una URL HTTPS por línea";
  return "Detalles, uno por cada línea anterior";
}

export default function LandingStudioFields({ activo, modificar, inputRef, videoRef }) {
  const tipo = activo.tipo;
  return <div className="landing-studio-fields">
    {!SIN_TITULO.has(tipo) && <label>{tipo === "testimonio" ? "Autor del testimonio" : "Título"}<input maxLength={160} value={activo.titulo} onChange={e => modificar("titulo", e.target.value)} placeholder={tipo === "testimonio" ? "Nombre autorizado" : "Título de la sección"} /></label>}
    {CON_TEXTO.has(tipo) && <label>{POR_LINEAS.has(tipo) ? "Una línea por elemento" : tipo === "testimonio" ? "Opinión real del cliente" : "Texto"}<textarea rows={6} maxLength={1500} value={activo.texto} onChange={e => modificar("texto", e.target.value)} /></label>}
    {["imagen", "video", "ubicacion", "agenda"].includes(tipo) && <label>{tipo === "video" ? "Video MP4" : tipo === "imagen" ? "Imagen" : tipo === "agenda" ? "Enlace HTTPS de la agenda" : "Enlace HTTPS del mapa"}<input value={activo.url} readOnly={tipo === "video"} onChange={e => modificar("url", e.target.value)} placeholder={tipo === "video" ? "Sube un archivo MP4" : "https://…"} />{tipo === "imagen" && <button type="button" className="landing-studio-upload" onClick={() => inputRef.current?.click()}>Subir imagen</button>}{tipo === "video" && <button type="button" className="landing-studio-upload" onClick={() => videoRef.current?.click()}>Subir video MP4 (máx. 45 s)</button>}</label>}
    {CON_ITEMS.has(tipo) && <label>{etiquetaItems(tipo)}<textarea rows={5} value={activo.items.join("\n")} onChange={e => modificar("items", e.target.value.split("\n").slice(0, 12))} />{IMAGENES_MULTIPLES.has(tipo) && <button type="button" className="landing-studio-upload" onClick={() => inputRef.current?.click()}>Añadir imagen</button>}</label>}
    <label>Estilo<select value={activo.tono} onChange={e => modificar("tono", e.target.value)}><option value="claro">Claro</option><option value="tinte">Acento de marca</option><option value="oscuro">Oscuro</option></select></label>
  </div>;
}
