import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, MessageCircle, Play, Star, Store } from "lucide-react";
import { resolverImagenNegocio } from "@/services/negocioApi";
import "@/business.css";
import LandingBloquesExtra from "./LandingBloquesExtra";
import "./landingBloquesExtra.css";

const REDES_SOCIALES = [
  { host: "www.tiktok.com", nombre: "TikTok" },
  { host: "www.facebook.com", nombre: "Facebook" },
  { host: "www.instagram.com", nombre: "Instagram" },
];

function redSocial(url) {
  try {
    const enlace = new URL(url);
    if (enlace.protocol !== "https:") return null;
    const red = REDES_SOCIALES.find(item => item.host === enlace.hostname);
    return red ? { ...red, url: enlace.href } : null;
  } catch { return null; }
}

export const BLOQUES = [
  { tipo: "titulo", nombre: "Título", grupo: "Texto", plan: "Básico", icono: "H" },
  { tipo: "texto", nombre: "Párrafo", grupo: "Texto", plan: "Básico", icono: "¶" },
  { tipo: "lista", nombre: "Lista de beneficios", grupo: "Texto", plan: "Básico", icono: "☷" },
  { tipo: "cita", nombre: "Cita destacada", grupo: "Texto", plan: "Básico", icono: "❞" },
  { tipo: "imagen", nombre: "Imagen", grupo: "Medios", plan: "Básico", icono: "▧" },
  { tipo: "separador", nombre: "Separador", grupo: "Diseño", plan: "Básico", icono: "━" },
  { tipo: "espaciador", nombre: "Espacio", grupo: "Diseño", plan: "Básico", icono: "↕" },
  { tipo: "catalogo", nombre: "Catálogo", grupo: "Negocio", plan: "Básico", icono: "▦" },
  { tipo: "confianza", nombre: "Verificación", grupo: "Negocio", plan: "Básico", icono: "✦" },
  { tipo: "resenas", nombre: "Reseñas", grupo: "Negocio", plan: "Básico", icono: "★" },
  { tipo: "contacto", nombre: "Contáctenos", grupo: "Negocio", plan: "Básico", icono: "✉" },
  { tipo: "galeria", nombre: "Galería", grupo: "Medios", plan: "Plus", icono: "▤" },
  { tipo: "video", nombre: "Vídeo", grupo: "Medios", plan: "Básico", icono: "▶" },
  { tipo: "columnas", nombre: "Dos columnas", grupo: "Diseño", plan: "Plus", icono: "◫" },
  { tipo: "acordeon", nombre: "Preguntas frecuentes", grupo: "Diseño", plan: "Plus", icono: "⌄" },
  { tipo: "pestanas", nombre: "Pestañas", grupo: "Diseño", plan: "Plus", icono: "▣" },
  { tipo: "subtitulo", nombre: "Subtítulo", grupo: "Texto", plan: "Básico", icono: "h" },
  { tipo: "destacado", nombre: "Mensaje destacado", grupo: "Texto", plan: "Básico", icono: "✧" },
  { tipo: "pasos", nombre: "Pasos de compra", grupo: "Negocio", plan: "Básico", icono: "①" },
  { tipo: "servicios", nombre: "Servicios", grupo: "Negocio", plan: "Básico", icono: "▤" },
  { tipo: "horario", nombre: "Horarios", grupo: "Negocio", plan: "Básico", icono: "◷" },
  { tipo: "ubicacion", nombre: "Ubicación", grupo: "Negocio", plan: "Básico", icono: "⌖" },
  { tipo: "precios", nombre: "Precios de referencia", grupo: "Negocio", plan: "Básico", icono: "$" },
  { tipo: "garantias", nombre: "Compromisos", grupo: "Negocio", plan: "Básico", icono: "✓" },
  { tipo: "equipo", nombre: "Equipo", grupo: "Negocio", plan: "Básico", icono: "♧" },
  { tipo: "aviso", nombre: "Aviso importante", grupo: "Texto", plan: "Básico", icono: "!" },
  { tipo: "comparativa", nombre: "Comparativa", grupo: "Negocio", plan: "Plus", icono: "⇄" },
  { tipo: "cronologia", nombre: "Nuestra historia", grupo: "Negocio", plan: "Plus", icono: "◉" },
  { tipo: "indicadores", nombre: "Cifras destacadas", grupo: "Negocio", plan: "Plus", icono: "▥" },
  { tipo: "mosaico", nombre: "Mosaico de fotos", grupo: "Medios", plan: "Plus", icono: "▦" },
  { tipo: "antesdespues", nombre: "Antes y después", grupo: "Medios", plan: "Plus", icono: "◧" },
  { tipo: "ficha", nombre: "Ficha detallada", grupo: "Negocio", plan: "Plus", icono: "▣" },
  { tipo: "proceso", nombre: "Proceso de trabajo", grupo: "Negocio", plan: "Plus", icono: "➜" },
  { tipo: "recursos", nombre: "Enlaces útiles", grupo: "Negocio", plan: "Plus", icono: "↗" },
  { tipo: "testimonio", nombre: "Testimonio", grupo: "Negocio", plan: "Plus", icono: "❝" },
  { tipo: "agenda", nombre: "Reservar cita", grupo: "Negocio", plan: "Plus", icono: "▦" },
];

export function nuevoBloque(tipo) {
  const nombres = { titulo: "Un título que invite a descubrirte", texto: "Cuenta qué haces y cómo ayudas a tus clientes.", lista: "Diseño a tu medida\nAtención personalizada\nEntrega acordada contigo", cita: "Una buena idea merece un buen comienzo.", columnas: "Qué hacemos\nCómo trabajamos", acordeon: "¿Cómo solicito una cotización?\n¿Qué información necesitas para empezar?", pestanas: "Servicios\nNuestro proceso", subtitulo: "Una frase que presenta esta parte de tu negocio.", destacado: "Explica aquí lo que te distingue.", pasos: "Cuéntanos qué necesitas\nRecibe una propuesta\nAcordamos la entrega", servicios: "Servicio principal\nServicio complementario", horario: "Lunes a viernes · 09:00–18:00\nSábados · Con cita", ubicacion: "Indica tu dirección o zona de atención.", precios: "Servicio principal\nServicio complementario", garantias: "Atención directa\nCondiciones claras", equipo: "Nombre de la persona\nOtro integrante", aviso: "Comparte una información importante para tus clientes.", comparativa: "Opción A\nOpción B", cronologia: "Cómo empezamos\nDónde estamos hoy", indicadores: "Proyectos realizados\nAños de experiencia", ficha: "Materiales\nEntrega\nCobertura", proceso: "Consulta\nPropuesta\nEntrega", recursos: "Nuestro catálogo\nMás información", testimonio: "Escribe aquí una opinión real y autorizada.", agenda: "Indica cómo se coordinan las citas." };
  return { id: crypto.randomUUID(), tipo, titulo: tipo === "titulo" ? nombres.titulo : "", texto: nombres[tipo] || "", url: "", items: [], tono: "claro" };
}

function enlaceVideo(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    if (["youtube.com", "www.youtube.com", "youtu.be"].includes(u.hostname)) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") || u.pathname.split("/").pop();
      return /^[\w-]{11}$/.test(id || "") ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (["vimeo.com", "www.vimeo.com"].includes(u.hostname)) {
      const id = u.pathname.slice(1);
      return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch { /* Enlace incompleto en el editor. */ }
  return null;
}

export default function LandingBloquesVista({ bloques = [], negocio = {}, onContact, editor = false }) {
  return <div className={`landing-blocks ${editor ? "is-editor" : ""}`}>
    {bloques.filter(b => b.tipo !== "tema").map(b => <section key={b.id} className={`landing-block landing-block-${b.tipo} landing-tone-${b.tono}`}>
      {b.tipo === "titulo" && <h2>{b.titulo || "Nuevo título"}</h2>}
      {b.tipo === "texto" && <p className="landing-block-copy">{b.texto || "Escribe aquí tu historia…"}</p>}
      {b.tipo === "lista" && <ul className="landing-block-list">{(b.texto || "Primer beneficio\nSegundo beneficio").split("\n").filter(Boolean).map((item, i) => <li key={i}><BadgeCheck size={17} /> {item}</li>)}</ul>}
      {b.tipo === "cita" && <blockquote>“{b.texto || "Una frase que represente tu trabajo"}”</blockquote>}
      {b.tipo === "separador" && <hr />}
      {b.tipo === "espaciador" && <div className="landing-spacer" />}
      {b.tipo === "imagen" && (b.url ? <img className="landing-block-image" src={resolverImagenNegocio(b.url)} alt={b.titulo || "Imagen del negocio"} /> : <div className="landing-block-placeholder">Sube una imagen para esta sección</div>)}
      {b.tipo === "galeria" && <div className="landing-gallery">{(b.items.length ? b.items : ["", "", ""]).map((url, i) => url ? <img key={i} src={resolverImagenNegocio(url)} alt={`${b.titulo || "Galería"} ${i + 1}`} /> : <div key={i} className="landing-block-placeholder">Imagen {i + 1}</div>)}</div>}
      {b.tipo === "video" && (b.url?.startsWith("/api/negocios/videos/") ? <div className="landing-video"><video src={resolverImagenNegocio(b.url)} controls preload="metadata" title={b.titulo || "Vídeo del negocio"} /></div> : enlaceVideo(b.url) ? <div className="landing-video"><iframe src={enlaceVideo(b.url)} title={b.titulo || "Vídeo del negocio"} allowFullScreen loading="lazy" /></div> : <div className="landing-block-placeholder"><Play size={24} /> Sube un video MP4 de hasta 45 segundos</div>)}
      {b.tipo === "columnas" && <div className="landing-columns">{(b.texto || "Primera columna\nSegunda columna").split("\n").slice(0, 2).map((item, i) => <div key={i}><strong>{item}</strong><p>{b.items[i] || "Describe aquí esta parte de tu negocio."}</p></div>)}</div>}
      {b.tipo === "acordeon" && <div className="landing-accordion">{(b.texto || "Pregunta frecuente").split("\n").filter(Boolean).map((item, i) => <details key={i}><summary>{item}</summary><p>{b.items[i] || "Escribe una respuesta útil para tus clientes."}</p></details>)}</div>}
      {b.tipo === "pestanas" && <div className="landing-tabs">{(b.texto || "Sección").split("\n").filter(Boolean).map((item, i) => <details key={i} open={i === 0 ? true : undefined}><summary>{item}</summary><p>{b.items[i] || "Cuenta más sobre este tema."}</p></details>)}</div>}
      {b.tipo === "catalogo" && <div><div className="landing-block-heading"><Store size={20} /><h2>{b.titulo || "Productos y servicios"}</h2></div><div className="landing-catalog">{negocio.catalogo?.length ? negocio.catalogo.filter(item => item.activo !== false).slice(0, editor ? 3 : undefined).map(item => <article key={item.id}>{item.fotoUrl && <img src={resolverImagenNegocio(item.fotoUrl)} alt={item.nombre} loading="lazy" />}<strong>{item.nombre}</strong><span>{item.precioReferencial != null ? `$${Number(item.precioReferencial).toFixed(2)}` : "Consultar precio"}</span></article>) : <p>Pronto encontrarás aquí los productos y servicios.</p>}</div>{editor && <Link to="/negocio/catalogo" className="landing-block-link">Administrar catálogo <ArrowRight size={14} /></Link>}</div>}
      {b.tipo === "confianza" && <div className="landing-trust"><BadgeCheck size={28} /><div><strong>{b.titulo || "Un negocio con identidad verificada"}</strong><p>Trust Score {negocio.trustScore || 0}/100 · Conoce las señales de confianza de este perfil.</p></div></div>}
      {b.tipo === "resenas" && <div><div className="landing-block-heading"><Star size={20} /><h2>{b.titulo || "Lo que dicen nuestros clientes"}</h2></div><p className="landing-block-copy">{negocio.totalResenas ? `${negocio.totalResenas} reseñas auditadas · ${Number(negocio.promedioResenas || 0).toFixed(1)} de 5 estrellas` : "Las reseñas auditadas aparecerán después de trabajos confirmados."}</p></div>}
      {b.tipo === "contacto" && <div className="landing-contact"><div><h2>{b.titulo || "Hablemos de tu proyecto"}</h2><p>{b.texto || "Cuéntanos qué necesitas en el chat de CheckBiz."}</p>{b.items?.map(redSocial).filter(Boolean).length > 0 && <div className="landing-contact-socials">{b.items.map(redSocial).filter(Boolean).map(red => <a key={red.url} href={red.url} target="_blank" rel="noopener noreferrer">{red.nombre} <ArrowRight size={14} /></a>)}</div>}</div>{editor ? <span className="landing-contact-button"><MessageCircle size={17} /> Contáctenos</span> : <button type="button" onClick={onContact} className="landing-contact-button"><MessageCircle size={17} /> Contáctenos</button>}</div>}
      <LandingBloquesExtra bloque={b} editor={editor} />
    </section>)}
  </div>;
}

