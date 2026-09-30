import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { ArrowRight, Bookmark, Check, ChevronRight, GraduationCap, Search, ShieldCheck, SlidersHorizontal, Sparkles, Store, X, Palette, Code2, Stethoscope, Box, Scale, Wrench, Tag, Star, MoreHorizontal, Share2, Flag, Loader2 } from "lucide-react";
import "./catalogoNegocios.css";
import ArrowRail from "@/components/ui/ArrowRail";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { buscarNegocios, listarCategoriasDisponibles, listarCiudadesDisponibles, resolverImagenNegocio, obtenerNegocioPublico } from "@/services/negocioApi";
import { reportarNegocio } from "@/services/denunciaApi";
import { isLoggedIn } from "@/services/authApi";
import { misVerificacionesAlumni } from "@/services/alumniApi";
import { alternarGuardado, obtenerGuardadosSlugs, suscribirEspacio } from "@/services/clienteEspacioLocal";
import MiniLandingFirstView from "@/components/public/MiniLandingFirstView";

const ICONOS = { palette: Palette, code: Code2, stethoscope: Stethoscope, box: Box, scale: Scale, sparkles: Sparkles, "graduation-cap": GraduationCap, wrench: Wrench };
const TONOS = ["catalog-tone-trust", "catalog-tone-green", "catalog-tone-clay", "catalog-tone-gold"];
function FotoNegocio({ negocio, className = "" }) {
  return negocio.fotoPortadaUrl
    ? <img src={resolverImagenNegocio(negocio.fotoPortadaUrl)} alt="" loading="lazy" className={className} />
    : <div className={`catalog-poster-fallback ${className}`}><span className="catalog-poster-ring" /><Store className="catalog-poster-icon size-14" /><span className="catalog-poster-label">Descubre el talento detrás de</span><span className="catalog-poster-name max-w-[85%] text-center font-display text-xl font-bold">{negocio.nombreComercial}</span><span className="catalog-poster-bottom">CheckBiz · Perfil de negocio</span></div>;
}
function TarjetaNegocio({ negocio, indice, favorito, onFavorito, onPreview }) {
  const capas = negocio.capasVerificacion?.filter(c => c.cumplida) || [];
  return <article className={`catalog-card group relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card ${TONOS[indice % TONOS.length]}`}>
    <button type="button" onClick={() => onPreview(negocio)} aria-label={`Vista previa de ${negocio.nombreComercial}`} className="relative block aspect-[4/5] w-full overflow-hidden text-left">
      <FotoNegocio negocio={negocio} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.035]" />
      <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-background/95 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">Trust Score {negocio.trustScore}/100</span>
      <span className="catalog-card-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/65 to-transparent p-4 pt-16 text-left text-white">
        <span className="block text-xs font-semibold text-white/80">Verificaciones visibles</span>
        <span className="mt-1 block text-xs">{capas.length ? capas.map(c => c.capa).join(" · ") : "Consulta el perfil"}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold">Vista previa <ArrowRight className="size-3" /></span>
      </span>
    </button>
    <div className="p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background text-xs font-bold text-trust">{negocio.logoUrl ? <img src={resolverImagenNegocio(negocio.logoUrl)} alt="" loading="lazy" className="size-full object-cover" /> : negocio.nombreComercial.slice(0, 2).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><button type="button" onClick={() => onPreview(negocio)} className="block w-full truncate text-left text-sm font-bold hover:text-trust">{negocio.nombreComercial}</button><p className="truncate text-xs text-muted-foreground">{negocio.categoria?.nombre || "Negocio"}{negocio.ciudad ? ` · ${negocio.ciudad}` : ""}</p></div>
        <button type="button" onClick={() => onFavorito(negocio.slug)} aria-label={favorito ? `Quitar ${negocio.nombreComercial} de guardados` : `Guardar ${negocio.nombreComercial}`} aria-pressed={favorito} className={`grid size-9 shrink-0 place-items-center rounded-full border border-border transition-colors hover:border-action hover:text-action ${favorito ? "bg-action/10 text-action" : "text-muted-foreground"}`}><Bookmark className={`size-4 ${favorito ? "fill-current" : ""}`} /></button>
      </div>
      <div className="mt-3 flex items-center justify-end text-xs"><button type="button" onClick={() => onPreview(negocio)} className="font-semibold text-trust hover:underline">Ver más</button></div>
    </div>
  </article>;
}
function Carrusel({ titulo, descripcion, items, favoritos, onFavorito, onPreview, empty }) {
  return <section className="catalog-section" aria-label={titulo}>
    <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold sm:text-2xl">{titulo}</h2>{descripcion && <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>}</div></div>
    {items.length ? <ArrowRail label={titulo} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">{items.map((n, i) => <div key={n.slug} className="w-[218px] shrink-0 snap-start sm:w-[240px]"><TarjetaNegocio negocio={n} indice={i} favorito={favoritos.includes(n.slug)} onFavorito={onFavorito} onPreview={onPreview} /></div>)}</ArrowRail> : empty}
  </section>;
}
function VistaPrevia({ negocio, negocios, onClose, onPreview, favorito, onFavorito }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(negocio);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [reportando, setReportando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [errorReporte, setErrorReporte] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [reporteEnviado, setReporteEnviado] = useState(false);
  const [mensajeCompartir, setMensajeCompartir] = useState("");
  useEffect(() => { const dialog = ref.current; if (dialog && !dialog.open) dialog.showModal(); }, []);
  useEffect(() => {
    let activo = true;
    setDetalle(negocio);
    setCargando(true);
    setMenuAbierto(false);
    setReportando(false);
    setReporteEnviado(false);
    setMensajeCompartir("");
    if (ref.current) ref.current.scrollTop = 0;
    obtenerNegocioPublico(negocio.slug).then(data => { if (activo) setDetalle(data); }).catch(() => {}).finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [negocio]);
  const categoriaId = detalle.categoria?.id ?? detalle.categoriaId;
  const similares = categoriaId == null ? [] : (negocios || []).filter(n => n.slug !== negocio.slug && (n.categoria?.id ?? n.categoriaId) === categoriaId).slice(0, 8);
  const descripcion = (detalle.descripcionCorta || detalle.descripcion || "").slice(0, 500);
  const propietario = detalle.emprendedorNombre || detalle.usuarioEmprendedor?.nombre || detalle.propietarioNombre;
  async function compartir() {
    const url = `${window.location.origin}/negocio/publico/${negocio.slug}`;
    setMenuAbierto(false);
    try {
      if (navigator.share) await navigator.share({ title: negocio.nombreComercial, url });
      else { await navigator.clipboard.writeText(url); setMensajeCompartir("Enlace copiado"); }
    } catch (err) { if (err.name !== "AbortError") setMensajeCompartir("No se pudo compartir el enlace"); }
  }
  async function enviarReporte(e) {
    e.preventDefault();
    if (!isLoggedIn()) { navigate("/login"); return; }
    setErrorReporte("");
    setEnviandoReporte(true);
    try { await reportarNegocio({ negocioSlug: negocio.slug, motivo: motivo.trim() }); setReporteEnviado(true); setReportando(false); setMotivo(""); }
    catch (err) { setErrorReporte(err.message || "No se pudo enviar el reporte"); }
    finally { setEnviandoReporte(false); }
  }
  return <dialog ref={ref} onClose={onClose} onClick={e => { if (e.target === ref.current) ref.current.close(); }} aria-label={`Vista previa de ${negocio.nombreComercial}`} className="catalog-dialog w-[min(1120px,calc(100vw-24px))] max-h-[min(92vh,960px)] overflow-y-auto rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl">
    <button type="button" onClick={() => ref.current?.close()} aria-label="Cerrar vista previa" className="sticky top-3 z-30 ml-auto mr-3 mt-3 grid size-10 place-items-center rounded-full border border-border bg-card shadow-lg hover:bg-muted"><X className="size-5" /></button>
    <div className="grid gap-6 px-5 pb-7 pt-1 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-8">
      <div className="min-w-0">
        <MiniLandingFirstView slug={detalle.slug} nombre={detalle.nombreComercial} />
        {detalle.catalogo?.length > 0 && <div className="mt-3 flex gap-2 overflow-x-auto pb-2">{detalle.catalogo.filter(item => item.fotoUrl).slice(0, 5).map(item => <img key={item.id} src={resolverImagenNegocio(item.fotoUrl)} alt={item.nombre} className="size-20 shrink-0 rounded-xl border border-border object-cover" />)}</div>}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">{detalle.insignias?.some(i => i.nombre === "Emprendedor Verificado") && <span className="rounded-full bg-verified/10 px-3 py-1 text-xs font-bold text-verified">Verificado</span>}<span className="rounded-full bg-trust/10 px-3 py-1 text-xs font-bold text-trust">Trust Score {detalle.trustScore}/100</span>{cargando && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Cargando detalles" />}</div>
        <h2 className="mt-5 font-display text-2xl font-bold sm:text-3xl">{detalle.nombreComercial}</h2>
        {detalle.slogan && <p className="mt-2 text-lg font-medium text-trust">{detalle.slogan}</p>}
        <p className="mt-2 text-sm text-muted-foreground">{detalle.categoria?.nombre || "Negocio"}{detalle.ciudad ? ` · ${detalle.ciudad}` : ""}</p>
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{descripcion || "Este negocio aún no ha añadido una descripción."}</p>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3"><div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-trust/10 font-bold text-trust">{detalle.logoUrl ? <img src={resolverImagenNegocio(detalle.logoUrl)} alt="" className="size-full object-cover" /> : detalle.nombreComercial.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{propietario || detalle.nombreComercial}</p><p className="text-xs text-muted-foreground">Emprendedor en CheckBiz</p></div><button type="button" onClick={() => onFavorito(negocio.slug)} aria-pressed={favorito} className="rounded-xl border border-border px-3 py-2 text-sm font-bold hover:border-trust hover:text-trust">{favorito ? "Siguiendo" : "Seguir"}</button></div>
        <div className="mt-5 flex items-center gap-2"><Button asChild className="min-w-0 flex-1"><Link to={`/negocio/publico/${negocio.slug}`}>Ver Mini Landing <ArrowRight className="size-4" /></Link></Button><Link to="/mis-solicitudes" title="Dar una reseña tras confirmar un servicio" aria-label="Dar una reseña" className="grid size-10 shrink-0 place-items-center rounded-xl border border-border hover:border-pending hover:text-pending"><Star className="size-5" /></Link><div className="relative"><button type="button" onClick={() => setMenuAbierto(v => !v)} aria-label="Más acciones" aria-expanded={menuAbierto} className="grid size-10 place-items-center rounded-xl border border-border hover:bg-muted"><MoreHorizontal className="size-5" /></button>{menuAbierto && <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl"><button type="button" onClick={compartir} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"><Share2 className="size-4" /> Compartir</button><button type="button" onClick={() => { setMenuAbierto(false); setReportando(true); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"><Flag className="size-4" /> Reportar</button></div>}</div></div>
        <p className="mt-2 text-xs text-muted-foreground">Las reseñas se publican después de confirmar un servicio recibido.</p>
        {mensajeCompartir && <p role="status" className="mt-2 text-xs text-trust">{mensajeCompartir}</p>}
        {reporteEnviado && <p role="status" className="mt-2 text-xs text-verified">Reporte enviado para revisión.</p>}
        {reportando && <form onSubmit={enviarReporte} className="mt-4 space-y-3 rounded-2xl border border-border bg-background p-4"><label htmlFor="motivo-preview" className="block text-sm font-bold">¿Qué deseas reportar?</label><textarea id="motivo-preview" required minLength={10} maxLength={1000} value={motivo} onChange={e => setMotivo(e.target.value)} className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Describe el problema con este negocio" />{errorReporte && <p role="alert" className="text-xs text-danger">{errorReporte}</p>}<div className="flex gap-2"><Button type="submit" disabled={enviandoReporte}>{enviandoReporte ? "Enviando…" : "Enviar reporte"}</Button><Button type="button" variant="outline" onClick={() => setReportando(false)}>Cancelar</Button></div></form>}
        {detalle.capasVerificacion?.length > 0 && <div className="mt-6"><h3 className="text-sm font-bold">Identidad y verificación</h3><div className="mt-2 flex flex-wrap gap-2">{detalle.capasVerificacion.filter(c => c.cumplida).map(c => <span key={c.capa} className="inline-flex items-center gap-1 rounded-full border border-verified/25 bg-verified/10 px-2.5 py-1 text-xs text-verified"><Check className="size-3" />{c.capa}</span>)}</div></div>}
      </div>
    </div>
    <section className="border-t border-border bg-background/50 px-5 py-7 sm:px-8"><h3 className="font-display text-xl font-bold">Más opciones</h3><p className="mt-1 text-sm text-muted-foreground">Más negocios de {detalle.categoria?.nombre || "esta categoría"} para comparar.</p>{similares.length > 0 ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{similares.map(n => <button key={n.slug} type="button" onClick={() => onPreview(n)} className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-transform hover:-translate-y-1 hover:shadow-lg"><div className="aspect-[4/3] overflow-hidden"><FotoNegocio negocio={n} className="size-full object-cover transition-transform group-hover:scale-105" /></div><div className="p-3"><p className="truncate text-sm font-bold">{n.nombreComercial}</p><p className="mt-1 text-xs text-muted-foreground">Trust Score {n.trustScore}/100</p></div></button>)}</div> : <p className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">Por ahora no hay otros negocios publicados en esta categoría.</p>}</section>
  </dialog>;
}
export default function CatalogoNegociosPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const { dentroClienteShell = false } = useOutletContext() || {};
  const [textoEntrada, setTextoEntrada] = useState(params.get("texto") || "");
  const [negocios, setNegocios] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [alumniIds, setAlumniIds] = useState([]);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [favoritos, setFavoritos] = useState(obtenerGuardadosSlugs);
  const [recarga, setRecarga] = useState(0);
  const esResultados = pathname.endsWith("/resultados");
  const texto = params.get("texto") || "";
  const categoriaId = params.get("categoriaId") || "";
  const ciudad = params.get("ciudad") || "";
  const universidadId = params.get("universidadId") || "";
  const soloCiudad = Boolean(ciudad && !texto && !categoriaId && !universidadId && !esResultados);
  useEffect(() => { listarCategoriasDisponibles().then(setCategorias).catch(() => {}); listarCiudadesDisponibles().then(setCiudades).catch(() => {}); if (isLoggedIn()) misVerificacionesAlumni().then(lista => setAlumniIds(lista.filter(v => v.estado === "verificado").map(v => v.universidad.id))).catch(() => {}); }, []);
  useEffect(() => suscribirEspacio(() => setFavoritos(obtenerGuardadosSlugs())), []);
  useEffect(() => { setTextoEntrada(texto); }, [texto]);
  useEffect(() => { let activo = true; setError(""); buscarNegocios({ texto: texto || undefined, categoriaId: categoriaId || undefined, ciudad: ciudad || undefined }).then(lista => { if (activo) setNegocios(lista); }).catch(() => { if (activo) setError("No pudimos cargar los negocios. Revisa la conexión y vuelve a intentar."); }); return () => { activo = false; }; }, [texto, categoriaId, ciudad, recarga]);
  const filtrados = useMemo(() => universidadId ? (negocios || []).filter(n => n.universidadesAlumni?.some(u => String(u.id) === universidadId)) : (negocios || []), [negocios, universidadId]);
  function cambiarFiltro(clave, valor) { const p = new URLSearchParams(params); if (valor) p.set(clave, valor); else p.delete(clave); setParams(p); }
  function buscar(e) { e.preventDefault(); const p = new URLSearchParams(params); if (textoEntrada.trim()) p.set("texto", textoEntrada.trim()); else p.delete("texto"); setParams(p); }
  function toggleFavorito(slug) { if (!isLoggedIn()) { navigate("/login"); return; } alternarGuardado(slug, (negocios || []).find(n => n.slug === slug) || preview); }
  const guardados = (negocios || []).filter(n => favoritos.includes(n.slug));
  const recientes = [...(negocios || [])].sort((a,b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0));
  const alumni = (negocios || []).filter(n => n.universidadesAlumni?.some(u => alumniIds.includes(u.id)));
  const hayFiltros = Boolean(texto || categoriaId || ciudad || universidadId);
  const mensajeVacio = <div className="catalog-empty rounded-2xl border border-dashed border-border bg-card p-7 text-sm text-muted-foreground"><Store className="size-9 text-trust"/><div><p className="font-semibold text-foreground">Un espacio para descubrir nuevos negocios</p><p className="mt-1">Todavía no hay negocios en esta sección. Explora otras categorías o vuelve más adelante.</p></div></div>;
  return <div className="client-explore min-h-screen bg-background">
    {!dentroClienteShell && <header className="flex h-16 items-center justify-between border-b border-border px-6"><Link to="/"><Logo /></Link><ThemeToggle /></header>}
    <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-5 sm:px-6">
      <section className="catalog-hero relative isolate overflow-hidden rounded-[28px] border border-trust/15 px-5 py-10 text-center sm:px-9 sm:py-12">
        <div className="catalog-world" aria-hidden="true">
          <span className="catalog-glow catalog-glow-one"/><span className="catalog-glow catalog-glow-two"/>
          <svg viewBox="0 0 1300 500" preserveAspectRatio="none"><path d="M-50 380 Q200 60 480 160 T1350 70"/><path d="M-50 60 Q300 450 700 310 T1350 420"/></svg>
          {[Store, Palette, Code2, GraduationCap, Wrench, Sparkles].map((Icon,i)=><span key={i} className={`catalog-orbit-object catalog-object-${i}`}><Icon/></span>)}
          <span className="catalog-world-ring"/>
          {Array.from({length:12},(_,i)=><i key={i} style={{left:`${(i*29+7)%94}%`,top:`${(i*23+12)%84}%`,animationDelay:`-${i*.5}s`}}/>)}
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-trust/25 bg-background/80 px-3 py-1.5 text-xs font-semibold text-trust"><Sparkles className="size-4" /> Explora negocios en CheckBiz</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">¿Qué servicio buscas hoy?</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">Descubre talento de tu comunidad: explora, conoce el negocio y conversa directamente con quien lo ofrece.</p>
        <form onSubmit={buscar} className="mx-auto mt-7 flex max-w-2xl items-center rounded-2xl border border-border bg-card p-1.5 shadow-lg shadow-trust/10 focus-within:ring-2 focus-within:ring-ring"><Search className="ml-3 size-5 shrink-0 text-trust" /><input aria-label="Buscar negocios o servicios" placeholder="Negocio o servicio…" value={textoEntrada} onChange={e => setTextoEntrada(e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground" /><Button type="submit" className="shrink-0">Buscar</Button></form>
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2" aria-label="Filtros de negocios">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <label className="sr-only" htmlFor="catalog-categoria">Categoría</label><select id="catalog-categoria" value={categoriaId} onChange={e => cambiarFiltro("categoriaId", e.target.value)} className="catalog-filter"><option value="">Categoría</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>
          <label className="sr-only" htmlFor="catalog-ciudad">Ciudad</label><select id="catalog-ciudad" value={ciudad} onChange={e => cambiarFiltro("ciudad", e.target.value)} className="catalog-filter"><option value="">Ciudad</option>{ciudades.map(c => <option key={c} value={c}>{c}</option>)}</select>
          {alumniIds.length > 0 && <><label className="sr-only" htmlFor="catalog-universidad">Universidad Alumni</label><select id="catalog-universidad" value={universidadId} onChange={e => cambiarFiltro("universidadId", e.target.value)} className="catalog-filter"><option value="">Universidad / Alumni</option>{[...new Map((negocios || []).flatMap(n => n.universidadesAlumni || []).filter(u => alumniIds.includes(u.id)).map(u => [u.id,u])).values()].map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></>}
          {hayFiltros && <button type="button" onClick={() => { setParams({}); setTextoEntrada(""); }} className="inline-flex items-center gap-1 px-2 text-xs font-semibold text-trust hover:underline"><X className="size-3.5" /> Limpiar</button>}
        </div>
        <div className="catalog-hero-benefits"><span><Search/> Explora sin cuenta</span><span><Store/> Conoce el negocio</span><span><GraduationCap/> Encuentra tu comunidad</span></div>
      </section>
        {categorias.length > 0 && <section className="catalog-section"><div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold sm:text-2xl">Explora por categoría</h2><p className="mt-1 text-sm text-muted-foreground">Una buena idea puede empezar aquí.</p></div></div><ArrowRail label="Categorías de negocios" className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">{categorias.map((c,i) => { const Icon = ICONOS[c.icono] || Tag; return <button key={c.id} type="button" onClick={() => cambiarFiltro("categoriaId", String(c.id) === categoriaId ? "" : String(c.id))} aria-pressed={String(c.id) === categoriaId} className={`catalog-category ${TONOS[i % TONOS.length]} ${String(c.id) === categoriaId ? "catalog-category-selected" : ""} flex h-32 w-40 shrink-0 snap-start flex-col justify-between rounded-2xl border border-border p-4 text-left sm:w-44`}><Icon className="size-8" /><span className="flex items-center justify-between gap-2 text-sm font-bold">{c.nombre}<ChevronRight className="size-4 shrink-0" /></span></button>; })}</ArrowRail></section>}
      {error ? <div role="alert" className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-5 text-sm"><span>{error}</span><Button variant="outline" size="sm" onClick={() => setRecarga(n => n + 1)}>Reintentar</Button></div> : negocios === null ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Cargando negocios">{[0,1,2,3].map(i => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />)}</div> : <>

        {esResultados || (hayFiltros && !soloCiudad) ? <section className="catalog-section"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold sm:text-2xl">Resultados para explorar</h2><p className="mt-1 text-sm text-muted-foreground">{filtrados.length} negocio{filtrados.length === 1 ? "" : "s"} encontrado{filtrados.length === 1 ? "" : "s"}</p></div><Link to="/buscar" className="text-sm font-semibold text-trust hover:underline">Ver catálogo completo</Link></div>{filtrados.length ? <div className="catalog-results-grid grid gap-4">{filtrados.map((n,i) => <TarjetaNegocio key={n.slug} negocio={n} indice={i} favorito={favoritos.includes(n.slug)} onFavorito={toggleFavorito} onPreview={setPreview} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"><p className="font-bold">No encontramos negocios con esos filtros</p><p className="mt-1 text-sm text-muted-foreground">Prueba otra categoría o ciudad.</p><Button variant="outline" size="sm" className="mt-4" onClick={() => setParams({})}>Quitar filtros</Button></div>}</section> : <>
          {!soloCiudad && <Carrusel titulo="Descubre negocios" descripcion="Perfiles publicados que puedes conocer y comparar." items={negocios.slice(0, 12)} favoritos={favoritos} onFavorito={toggleFavorito} onPreview={setPreview} empty={mensajeVacio} />}
          {ciudad && <Carrusel titulo={`Recomendados en ${ciudad}`} descripcion="Negocios de la ciudad que elegiste, ordenados por Trust Score." items={negocios.filter(n => n.ciudad === ciudad)} favoritos={favoritos} onFavorito={toggleFavorito} onPreview={setPreview} empty={mensajeVacio} />}
          <Carrusel titulo="Nuevos emprendedores" descripcion="Perfiles recientes, ordenados por fecha de creación." items={recientes.slice(0, 12)} favoritos={favoritos} onFavorito={toggleFavorito} onPreview={setPreview} empty={mensajeVacio} />
          {alumniIds.length > 0 && <Carrusel titulo="Alumni de tu universidad" descripcion="Emprendedores verificados por una universidad vinculada a tu cuenta." items={alumni} favoritos={favoritos} onFavorito={toggleFavorito} onPreview={setPreview} empty={mensajeVacio} />}
          {!soloCiudad && <Carrusel titulo="Tus guardados" descripcion="Negocios que guardaste en este navegador para volver después." items={guardados} favoritos={favoritos} onFavorito={toggleFavorito} onPreview={setPreview} empty={<div className="rounded-2xl border border-dashed border-border bg-card p-6"><Bookmark className="mb-3 size-6 text-action" /><p className="font-bold">Aún no guardas negocios</p><p className="mt-1 text-sm text-muted-foreground">Pulsa el marcador de una tarjeta para tenerla a mano aquí.</p></div>} />}
        </>}
      </>}
    </div>
    <aside className="catalog-discovery-note"><span className="catalog-note-icon"><Sparkles/></span><div><h2>Tu próxima idea puede empezar con una conversación</h2><p>Revisa el perfil, guarda lo que te interese y acuerda los detalles directamente con el negocio.</p></div><Link to="/como-funciona">Cómo funciona <ArrowRight size={16}/></Link></aside>
    {preview && <VistaPrevia negocio={preview} negocios={negocios} onClose={() => setPreview(null)} onPreview={setPreview} favorito={favoritos.includes(preview.slug)} onFavorito={toggleFavorito} />}
  </div>;
}
