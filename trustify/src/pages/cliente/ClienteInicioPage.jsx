import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, FileText, Bell, ShieldCheck, Star, ArrowRight, Store, Loader2, Sparkles, CheckCircle2, Compass, Palette, Wrench, Code2, GraduationCap, MessageCircle, BadgeCheck, ChevronRight, CalendarDays, Bookmark, Award, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { obtenerPerfil, leerPerfilSesion, listarNotificaciones } from "@/services/authApi";
import { misSolicitudes } from "@/services/solicitudApi";
import { buscarNegocios, listarCategoriasDisponibles, resolverImagenNegocio } from "@/services/negocioApi";
import { leerEspacio, suscribirEspacio } from "@/services/clienteEspacioLocal";

const ICONOS_CATEGORIA = { palette: Palette, wrench: Wrench, code: Code2, "graduation-cap": GraduationCap };

function TarjetaAcceso({ to, icon: Icon, titulo, valor, nota, tono }) {
  return (
    <Link to={to} className="client-stat panel panel-hover flex items-center gap-3 p-4">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tono}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{titulo}</p>
        <p className="font-display text-lg font-bold leading-tight">{valor}</p>
        {nota && <p className="text-xs text-muted-foreground">{nota}</p>}
      </div>
    </Link>
  );
}

export default function ClienteInicioPage() {
  const [usuario, setUsuario] = useState(leerPerfilSesion);
  const [solicitudesActivas, setSolicitudesActivas] = useState(null);
  const [noLeidas, setNoLeidas] = useState(null);
  const [destacados, setDestacados] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [errores, setErrores] = useState([]);
  const [texto, setTexto] = useState("");
  const [pendientesResena, setPendientesResena] = useState(null);
  const [espacio, setEspacio] = useState(leerEspacio);
  const navigate = useNavigate();

  function cargar() {
    setErrores([]);
    const fallo = (seccion) => setErrores(actual => [...actual, seccion]);
    obtenerPerfil().then(setUsuario).catch(() => fallo('tu perfil'));
    misSolicitudes()
      .then((lista) => { setSolicitudesActivas(lista.filter((s) => s.estado !== "confirmada" && s.estado !== "cancelada").length); setPendientesResena(lista.filter(s => s.estado === 'confirmada' && !s.resena).length); })
      .catch(() => fallo('tus solicitudes'));
    listarNotificaciones().then((d) => setNoLeidas(d.noLeidas)).catch(() => fallo('tus notificaciones'));
    buscarNegocios({}).then((lista) => setDestacados(lista.slice(0, 4))).catch(() => fallo('los negocios'));
    listarCategoriasDisponibles().then(setCategorias).catch(() => {});
  }
  useEffect(cargar, []);
  useEffect(() => suscribirEspacio(() => setEspacio(leerEspacio())), []);

  const capasCumplidas = usuario
    ? [usuario.kycLayer >= 1, usuario.kycLayer >= 2, usuario.fotoVerificacionEstado === "aprobada", usuario.senescytSriEstado === "verificado"].filter(Boolean).length
    : 0;
  const ahora = new Date();
  const hoyLocal = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0,10);
  const avisosHoy = espacio.recordatorios.filter(r => !r.completado && r.fecha <= hoyLocal).length;

  return (
    <div className="client-home mx-auto max-w-[1320px]">
      <section className="client-home-hero" aria-labelledby="client-home-title">
        <div className="client-home-copy">
          <span className="client-home-kicker"><Sparkles className="size-4" /> Bienvenido a tu espacio</span>
          <h1 id="client-home-title" className="font-display">Hola{usuario ? `, ${usuario.nombreCompleto.split(" ")[0]}` : ""}. <span>Las buenas conexiones empiezan aquí.</span></h1>
          <p>Descubre talento local, compara perfiles verificados y encuentra a quien puede hacer realidad tu próxima idea.</p>
          <form className="client-home-search" onSubmit={e => { e.preventDefault(); navigate(`/buscar/resultados?${new URLSearchParams({ texto: texto.trim() })}`); }}>
            <label className="relative min-w-0 flex-1"><span className="sr-only">Buscar negocios</span><Search className="absolute left-4 top-4 size-5 text-trust" /><Input className="h-[52px] border-0 bg-transparent pl-12 shadow-none" placeholder="¿Qué servicio buscas hoy?" value={texto} onChange={e => setTexto(e.target.value)} /></label>
            <Button type="submit" size="lg">Explorar<ArrowRight /></Button>
          </form>
          <Link to="/buscar" className="client-home-link inline-flex items-center gap-2 text-sm font-semibold">Ver todos los negocios<ArrowRight className="size-4" /></Link>
        </div>
        <div className="client-home-art" aria-hidden="true">
          <div className="client-home-orbit orbit-one" /><div className="client-home-orbit orbit-two" />
          <div className="client-home-art-card art-card-main"><Store size={42} /><span>Tu próxima gran idea</span><strong>está más cerca de lo que imaginas.</strong></div>
          <div className="client-home-art-card art-card-verify"><ShieldCheck size={23} /><span>Perfiles verificados</span></div>
          <div className="client-home-art-card art-card-connect"><Sparkles size={21} /><span>Conexiones reales</span></div>
          <div className="client-home-spark spark-one" /><div className="client-home-spark spark-two" />
        </div>
      </section>
      {avisosHoy > 0 && <Link to="/recordatorios" className="client-due-banner"><CalendarDays className="size-5" /><span><strong>{avisosHoy} recordatorio{avisosHoy > 1 ? "s" : ""} por revisar</strong><small>Consulta tu agenda y marca los servicios completados.</small></span><ArrowRight className="size-5" /></Link>}
      {errores.length > 0 && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm"><p>No pudimos cargar {errores.join(', ')}.</p><Button variant="outline" size="sm" onClick={cargar}>Reintentar</Button></div>}

      {/* Accesos rápidos con datos reales */}
      <div className="client-stat-grid mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TarjetaAcceso
          to="/mis-solicitudes"
          icon={FileText}
          titulo="Solicitudes activas"
          valor={solicitudesActivas === null ? errores.includes('tus solicitudes') ? 'No disponible' : "…" : solicitudesActivas}
          nota="Ver, confirmar y reseñar"
          tono="bg-trust/10 text-trust"
        />
        <TarjetaAcceso
          to="/notificaciones"
          icon={Bell}
          titulo="Notificaciones"
          valor={noLeidas === null ? errores.includes('tus notificaciones') ? 'No disponible' : "…" : noLeidas > 0 ? `${noLeidas} sin leer` : "Al día"}
          nota="Respuestas y avisos"
          tono="bg-pending/10 text-pending"
        />
        <TarjetaAcceso
          to="/perfil"
          icon={ShieldCheck}
          titulo="Identidad verificada"
          valor={usuario ? `${capasCumplidas} de 4 capas` : errores.includes('tu perfil') ? 'No disponible' : "…"}
          nota="Cédula, correo, foto, SENESCYT/SRI"
          tono="bg-verified/10 text-verified"
        />
      </div>

      {categorias.length > 0 && <section className="client-home-categories" aria-labelledby="client-categories-title">
        <div className="client-section-heading mb-4 flex items-center justify-between"><div><span className="client-section-icon"><Sparkles className="size-5" /></span><h2 id="client-categories-title" className="font-display text-xl font-bold">Explora lo que te inspira</h2><p>Empieza por una categoría y descubre posibilidades.</p></div><Link to="/buscar" className="text-sm font-semibold text-trust">Ver todas <ArrowRight className="ml-1 inline size-4" /></Link></div>
        <div className="client-home-category-rail">{categorias.slice(0, 8).map((categoria, indice) => { const Icon = ICONOS_CATEGORIA[categoria.icono] || Compass; return <Link key={categoria.id} to={`/buscar/resultados?categoriaId=${encodeURIComponent(categoria.id)}`} className={`client-home-category client-home-category-${indice % 4}`}><span className="client-home-category-icon"><Icon className="size-6" /></span><strong>{categoria.nombre}</strong><ChevronRight className="size-4" /></Link>; })}</div>
      </section>}

      {/* Explorar negocios */}
      <div className="client-section-heading mb-4 flex items-center justify-between">
        <div><span className="client-section-icon"><Compass className="size-5" /></span><h2 className="font-display text-xl font-bold">Descubre negocios</h2><p>Ideas, servicios y personas para tu siguiente proyecto.</p></div>
        <Link to="/buscar" className="flex items-center gap-1 text-sm font-medium text-trust hover:underline">
          Explorar todos <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {errores.includes('los negocios') && destacados === null ? <p className="panel p-6 text-sm text-muted-foreground">El catálogo no está disponible en este momento. Usa Reintentar para volver a cargarlo.</p> : destacados === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : destacados.length === 0 ? (
        <div className="client-empty panel flex flex-col items-center gap-3 px-5 py-9 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-trust/10 text-trust"><Store className="size-7" /></span>
          <p className="font-medium">Todavía no hay negocios publicados</p>
          <p className="max-w-md text-sm text-muted-foreground">Mientras llegan nuevos negocios, conoce las categorías y prepara tu perfil para tu primera solicitud.</p>
          <Button variant="outline" size="sm" asChild><Link to="/buscar">Ver categorías<ArrowRight /></Link></Button>
        </div>
      ) : (
        <div className="client-feature-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((n, index) => (
            <Link key={n.slug} to={`/negocio/publico/${n.slug}`} className={`client-feature-card panel panel-hover client-feature-tone-${index % 4}`}>
              <div className="client-feature-visual">{n.fotoPortadaUrl && <img src={resolverImagenNegocio(n.fotoPortadaUrl)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}<span className="client-feature-arc" />{!n.fotoPortadaUrl && <><Store className="client-feature-store" /><span className="client-feature-initials">{n.nombreComercial.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span></>}<span className="client-feature-score"><ShieldCheck className="size-3.5" /> {n.trustScore}/100</span></div>
              <div className="client-feature-info"><div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-trust/10 font-display text-sm font-bold text-trust">
                {n.logoUrl ? (
                  <img src={resolverImagenNegocio(n.logoUrl)} alt="" className="size-full object-cover" />
                ) : (
                  n.nombreComercial.split(" ").map((p) => p[0]).slice(0, 2).join("")
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{n.nombreComercial}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><ShieldCheck className="size-3 text-verified" /> Trust Score: {n.trustScore}</span>
                  {n.categoria && <span className="truncate">{n.categoria.nombre}</span>}
                </div>
              </div>
              </div><div className="client-feature-footer"><span>Ver perfil <ArrowRight className="size-3.5" /></span></div>
            </Link>
          ))}
        </div>
      )}

      <section className="client-trust-story" aria-labelledby="client-trust-title"><div className="client-trust-story-head"><span><BadgeCheck className="size-6" /></span><div><h2 id="client-trust-title" className="font-display text-xl font-bold">Elige con más confianza</h2><p>Cada perfil reúne señales que puedes revisar antes de contactar.</p></div></div><div className="client-trust-points"><div><ShieldCheck className="size-5" /><strong>Verifica</strong><p>Consulta las capas de identidad visibles.</p></div><div><Star className="size-5" /><strong>Compara</strong><p>Revisa el Trust Score y la información del negocio.</p></div><div><MessageCircle className="size-5" /><strong>Conversa</strong><p>Envía una solicitud y acuerda los detalles.</p></div></div><Link to="/buscar" className="client-trust-cta">Conocer negocios <ArrowRight className="size-4" /></Link></section>

      <section className="client-next-grid mt-9 grid gap-5 md:grid-cols-2" aria-label="Próximos pasos">
        <div className="client-next-card client-next-green"><CheckCircle2 className="mb-4 size-8" /><h2 className="text-xl font-bold">Tu cuenta, lista para conectar</h2><p className="mt-2 text-sm">Revisa tus datos y el estado de tus verificaciones antes de contactar a un negocio.</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" to="/perfil">Revisar mi cuenta<ArrowRight className="size-4" /></Link></div>
        <div className="client-next-card client-next-copper"><Star className="mb-4 size-8" /><h2 className="text-xl font-bold">{pendientesResena > 0 ? `${pendientesResena} reseña${pendientesResena > 1 ? 's' : ''} por compartir` : 'Tu experiencia ayuda a elegir'}</h2><p className="mt-2 text-sm">{pendientesResena > 0 ? 'Ya confirmaste la entrega. Comparte cómo te fue con otros clientes.' : 'Después de recibir y confirmar tu servicio, podrás dejar una reseña desde tus solicitudes.'}</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" to={pendientesResena > 0 ? '/mis-solicitudes' : '/ayuda'}>{pendientesResena > 0 ? 'Escribir una reseña' : 'Cómo funcionan las solicitudes'}<ArrowRight className="size-4" /></Link></div>
      </section>
      <section className="client-home-tools" aria-label="Organiza tu experiencia"><h2 className="font-display text-xl font-bold">Tu espacio, a tu manera</h2><p>Vuelve a lo que te importa y ten tus decisiones a mano.</p><div className="client-home-tool-grid"><Link to="/mi-red"><Bookmark className="size-6" /><strong>Mi red</strong><span>Negocios guardados</span></Link><Link to="/historial"><Award className="size-6" /><strong>Historial</strong><span>Trabajos y reseñas</span></Link><Link to="/recordatorios"><CalendarDays className="size-6" /><strong>Mi agenda</strong><span>Recordatorios</span></Link><Link to="/seguridad"><ShieldAlert className="size-6" /><strong>Seguridad</strong><span>Verificaciones y reportes</span></Link></div></section>
    </div>
  );
}
