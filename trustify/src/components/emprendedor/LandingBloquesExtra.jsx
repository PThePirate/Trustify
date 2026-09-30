import { BadgeCheck, CalendarDays, Clock3, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { resolverImagenNegocio } from "@/services/negocioApi";

const lineas = (valor) => (valor || "").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12);
const enlaceSeguro = (valor) => /^https:\/\//i.test(valor || "") ? valor : null;

export default function LandingBloquesExtra({ bloque: b, editor }) {
  const filas = lineas(b.texto);
  const titulo = b.titulo?.trim();
  const pares = filas.map((nombre, i) => ({ nombre, detalle: b.items?.[i]?.trim() || "" }));
  const encabezado = (texto) => <h2 className="landing-extra-title">{titulo || texto}</h2>;

  switch (b.tipo) {
    case "subtitulo": return <h3 className="landing-extra-subtitle">{b.texto || "Un subtítulo para tu historia"}</h3>;
    case "destacado": return <div className="landing-extra-highlight"><Sparkles size={24} /> <div>{encabezado("Lo que nos distingue")}<p>{b.texto}</p></div></div>;
    case "pasos":
    case "proceso": return <div>{encabezado(b.tipo === "pasos" ? "Así puedes comprar" : "Así trabajamos")}<ol className="landing-extra-steps">{pares.map(({ nombre, detalle }, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{nombre}</strong>{detalle && <p>{detalle}</p>}</div></li>)}</ol></div>;
    case "servicios": return <div>{encabezado("Nuestros servicios")}<div className="landing-extra-grid">{pares.map(({ nombre, detalle }, i) => <article key={i}><span className="landing-extra-mark">✦</span><strong>{nombre}</strong>{detalle && <p>{detalle}</p>}</article>)}</div></div>;
    case "horario": return <div>{encabezado("Horarios de atención")}<div className="landing-extra-rows">{filas.map((fila, i) => <div key={i}><Clock3 size={18} /><span>{fila}</span></div>)}</div></div>;
    case "ubicacion": return <div className="landing-extra-highlight"><MapPin size={24} /><div>{encabezado("Dónde encontrarnos")}<p>{b.texto}</p>{enlaceSeguro(b.url) && <a href={b.url} target="_blank" rel="noopener noreferrer">Abrir ubicación <ExternalLink size={15} /></a>}</div></div>;
    case "precios": return <div>{encabezado("Precios de referencia")}<div className="landing-extra-rows">{pares.map(({ nombre, detalle }, i) => <div key={i}><strong>{nombre}</strong><span>{detalle || "Consultar precio"}</span></div>)}</div><small>Confirma el precio final directamente con el negocio.</small></div>;
    case "garantias": return <div>{encabezado("Nuestros compromisos")}<div className="landing-extra-grid">{filas.map((fila, i) => <article key={i}><BadgeCheck size={21} /><strong>{fila}</strong></article>)}</div></div>;
    case "equipo": return <div>{encabezado("Conoce al equipo")}<div className="landing-extra-grid">{pares.map(({ nombre, detalle }, i) => <article key={i}><span className="landing-extra-avatar">{nombre.slice(0, 1).toUpperCase()}</span><strong>{nombre}</strong>{detalle && <p>{detalle}</p>}</article>)}</div></div>;
    case "aviso": return <div className="landing-extra-notice"><strong>{titulo || "Información importante"}</strong><p>{b.texto}</p></div>;
    case "comparativa": return <div>{encabezado("Compara opciones")}<div className="landing-extra-grid">{pares.map(({ nombre, detalle }, i) => <article key={i}><strong>{nombre}</strong>{detalle && <p>{detalle}</p>}</article>)}</div></div>;
    case "cronologia": return <div>{encabezado("Nuestra historia")}<div className="landing-extra-timeline">{pares.map(({ nombre, detalle }, i) => <div key={i}><span /><strong>{nombre}</strong>{detalle && <p>{detalle}</p>}</div>)}</div></div>;
    case "indicadores": return <div>{encabezado("Nuestro trabajo en cifras")}<div className="landing-extra-grid landing-extra-stats">{pares.map(({ nombre, detalle }, i) => <article key={i}><strong>{detalle || "—"}</strong><p>{nombre}</p></article>)}</div></div>;
    case "mosaico": return <div>{encabezado("Imágenes de nuestro trabajo")}<div className="landing-extra-mosaic">{(b.items?.length ? b.items : ["", "", ""]).map((url, i) => url ? <img key={i} src={resolverImagenNegocio(url)} alt={`${titulo || "Trabajo"} ${i + 1}`} /> : editor ? <span key={i}>Añade una foto</span> : null)}</div></div>;
    case "antesdespues": return <div>{encabezado("Antes y después")}<div className="landing-extra-before-after">{[0, 1].map((i) => <div key={i}><span>{i ? "Después" : "Antes"}</span>{b.items?.[i] ? <img src={resolverImagenNegocio(b.items[i])} alt={`${i ? "Después" : "Antes"}: ${titulo || "proyecto"}`} /> : editor ? <p>Añade una foto</p> : null}</div>)}</div></div>;
    case "ficha": return <div>{encabezado("Ficha del servicio")}<dl className="landing-extra-facts">{pares.map(({ nombre, detalle }, i) => <div key={i}><dt>{nombre}</dt><dd>{detalle || "Por confirmar"}</dd></div>)}</dl></div>;
    case "recursos": return <div>{encabezado("Enlaces útiles")}<div className="landing-extra-rows">{pares.map(({ nombre, detalle }, i) => enlaceSeguro(detalle) ? <a key={i} href={detalle} target="_blank" rel="noopener noreferrer">{nombre}<ExternalLink size={16} /></a> : editor ? <div key={i}>{nombre} · añade un enlace HTTPS</div> : null)}</div></div>;
    case "testimonio": return <figure className="landing-extra-testimonial"><blockquote>“{b.texto || "Añade aquí una opinión real"}”</blockquote>{titulo && <figcaption>— {titulo}</figcaption>}</figure>;
    case "agenda": return <div className="landing-extra-highlight"><CalendarDays size={25} /><div>{encabezado("Agenda una cita")}<p>{b.texto}</p>{enlaceSeguro(b.url) ? <a href={b.url} target="_blank" rel="noopener noreferrer">Abrir agenda <ExternalLink size={15} /></a> : editor ? <small>Añade el enlace HTTPS de tu agenda.</small> : null}</div></div>;
    default: return null;
  }
}
