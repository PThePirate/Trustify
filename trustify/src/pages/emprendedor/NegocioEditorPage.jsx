import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store, MapPin, Tag, FileText, Globe, ShieldCheck, Star,
  Loader2, AlertCircle, CheckCircle2, ExternalLink, Rocket, EyeOff, Video, Sparkles,
  BadgeCheck, GraduationCap, Languages, Image as ImageIcon, Upload, Users, UserPlus, Trash2, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import LandingStudio from "@/components/emprendedor/LandingStudio";
import NegocioImagenEditor from "@/components/emprendedor/NegocioImagenEditor";
import PlanesPage from "./PlanesPage";
import {
  obtenerMiNegocio, crearNegocio, actualizarNegocio,
  cambiarPublicacion, listarCategoriasDisponibles, obtenerMiSuscripcion,
  subirLogo, subirPortada, subirVideoLanding, resolverImagenNegocio,
  listarColaboradores, invitarColaborador, eliminarColaborador,
} from "@/services/negocioApi";

const VACIO = { nombreComercial: "", categoriaId: "", slogan: "", descripcionCorta: "", ciudad: "", whatsapp: "", videoPresentacionUrl: "" };
const ICONO_INSIGNIA = { "badge-check": BadgeCheck, "graduation-cap": GraduationCap, "shield-check": ShieldCheck, languages: Languages };

function SubidaImagen({ label, aspecto, url, subiendo, onSeleccionar, onEditarActual, error }) {
  const inputRef = useRef(null);
  return (
    <div>
      <Label>{label}</Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/20 hover:border-trust ${aspecto}`}
      >
        {url ? (
          <img src={resolverImagenNegocio(url)} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <ImageIcon className="size-6" />
            <span className="text-xs">JPG o PNG</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
          {subiendo ? <Loader2 className="size-5 animate-spin" /> : <span className="flex items-center gap-1.5 text-sm font-medium"><Upload className="size-4" /> {url ? "Cambiar" : "Subir"}</span>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.png"
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onSeleccionar(file);
          }}
        />
      </div>
      {url && <button type="button" onClick={onEditarActual} disabled={subiendo} className="mt-2 text-sm font-semibold text-trust hover:underline">Reencuadrar {label.toLowerCase()} actual</button>}
      {error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

/** B9.1 (Elite) — multiusuario: solo el dueño la ve; un colaborador no puede invitar ni quitar a nadie. */
function EquipoPanel() {
  const [colaboradores, setColaboradores] = useState(null);
  const [correo, setCorreo] = useState("");
  const [invitando, setInvitando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarColaboradores().then(setColaboradores).catch((err) => setError(err.message));
  }, []);

  async function invitar(e) {
    e.preventDefault();
    if (!correo.trim()) return;
    setError("");
    setInvitando(true);
    try {
      setColaboradores(await invitarColaborador(correo.trim()));
      setCorreo("");
    } catch (err) {
      setError(err.message || "No se pudo invitar a esa persona");
    } finally {
      setInvitando(false);
    }
  }

  async function quitar(usuarioId) {
    if (!confirm("¿Quitar a esta persona de tu equipo?")) return;
    setError("");
    try {
      setColaboradores(await eliminarColaborador(usuarioId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="panel mt-6 space-y-4 p-6">
      <div>
        <h2 className="flex items-center gap-2 font-display text-base font-bold">
          <Users className="size-4" /> Equipo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Invita a alguien más a administrar este negocio (editar el perfil, el catálogo y responder
          solicitudes). No puede cambiar el plan, invitar a otros ni eliminar la cuenta.
        </p>
      </div>

      <form onSubmit={invitar} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="correoColaborador">Correo de la persona (ya debe tener cuenta en CheckBiz)</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="correoColaborador" type="email" placeholder="persona@correo.com" className="pl-10"
              value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </div>
        </div>
        <Button type="submit" variant="trust" disabled={invitando || !correo.trim()}>
          {invitando ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />} Invitar
        </Button>
      </form>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
        </div>
      )}

      {colaboradores === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : colaboradores.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía nadie más administra este negocio.</p>
      ) : (
        <div className="space-y-2">
          {colaboradores.map((c) => (
            <div key={c.usuarioId} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{c.nombreCompleto}</p>
                <p className="text-xs text-muted-foreground">{c.correo}</p>
              </div>
              <button onClick={() => quitar(c.usuarioId)} className="grid size-8 place-items-center rounded-lg text-danger hover:bg-danger/10" title="Quitar">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NegocioEditorPage() {
  const [negocio, setNegocio] = useState(null);
  const [existe, setExiste] = useState(null); // null = cargando, false = no tiene, true = sí tiene
  const [categorias, setCategorias] = useState([]);
  const [suscripcion, setSuscripcion] = useState(null);
  const [comprobandoPlan, setComprobandoPlan] = useState(true);
  const [errorPlan, setErrorPlan] = useState("");
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  const [subiendoVideo, setSubiendoVideo] = useState(false);
  const [errorLogo, setErrorLogo] = useState("");
  const [errorPortada, setErrorPortada] = useState("");
  const [imagenPendiente, setImagenPendiente] = useState(null);

  useEffect(() => {
    listarCategoriasDisponibles().then(setCategorias);
    obtenerMiSuscripcion().then(s => { setSuscripcion(s); cargar(); }).catch(e => setErrorPlan(e.message)).finally(() => setComprobandoPlan(false));
  }, []);

  async function cargar() {
    try {
      const n = await obtenerMiNegocio();
      setNegocio(n);
      setForm({
        nombreComercial: n.nombreComercial,
        categoriaId: n.categoria?.id ?? "",
        descripcionCorta: n.descripcionCorta ?? "",
        slogan: n.slogan ?? "",
        ciudad: n.ciudad ?? "",
        whatsapp: n.whatsapp,
        videoPresentacionUrl: n.videoPresentacionUrl ?? "",
      });
      setExiste(true);
    } catch (err) {
      setExiste(false); // SIN_NEGOCIO — todavía no ha creado uno
    }
  }

  const campo = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function guardar(e) {
    e.preventDefault();
    setError("");
    setExito("");
    setGuardando(true);
    try {
      const datos = { ...form, categoriaId: form.categoriaId ? Number(form.categoriaId) : null };
      const n = existe ? await actualizarNegocio(datos) : await crearNegocio(datos);
      setNegocio(n);
      setExiste(true);
      setExito(existe ? "Cambios guardados" : "¡Tu negocio fue creado! Ahora puedes publicarlo.");
    } catch (err) {
      setError(err.message || "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function subirArchivoLogo(file) {
    setErrorLogo("");
    setSubiendoLogo(true);
    try {
      setNegocio(await subirLogo(file));
    } catch (err) {
      setErrorLogo(err.message || "No se pudo subir el logo");
      throw err;
    } finally {
      setSubiendoLogo(false);
    }
  }

  async function subirArchivoPortada(file) {
    setErrorPortada("");
    setSubiendoPortada(true);
    try {
      setNegocio(await subirPortada(file));
    } catch (err) {
      setErrorPortada(err.message || "No se pudo subir la portada");
      throw err;
    } finally {
      setSubiendoPortada(false);
    }
  }

  async function elegirVideo(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(""); setSubiendoVideo(true);
    try {
      const { url } = await subirVideoLanding(file);
      setForm((actual) => ({ ...actual, videoPresentacionUrl: url }));
      setExito("Video subido. Guarda los cambios para publicarlo.");
    } catch (err) { setError(err.message || "No se pudo subir el video"); }
    finally { setSubiendoVideo(false); }
  }

  function prepararImagen(file, tipo) {
    const setErrorImagen = tipo === "logo" ? setErrorLogo : setErrorPortada;
    setErrorImagen("");
    if (!/\.(jpg|png)$/i.test(file.name) || !["image/jpeg", "image/png"].includes(file.type)) {
      setErrorImagen("Solo se permiten imágenes en .jpg y .png");
      return;
    }
    setImagenPendiente({ archivo: file, tipo });
  }

  async function editarImagenActual(tipo) {
    const url = tipo === "logo" ? negocio.logoUrl : negocio.fotoPortadaUrl;
    const setErrorImagen = tipo === "logo" ? setErrorLogo : setErrorPortada;
    if (!url) return;
    setErrorImagen("");
    try {
      const res = await fetch(resolverImagenNegocio(url));
      if (!res.ok) throw new Error("No se pudo cargar la imagen actual.");
      const blob = await res.blob();
      const mime = blob.type === "image/png" ? "image/png" : "image/jpeg";
      prepararImagen(new File([blob], `${tipo}-actual.${mime === "image/png" ? "png" : "jpg"}`, { type: mime }), tipo);
    } catch (err) {
      setErrorImagen(err.message || "No se pudo cargar la imagen actual.");
    }
  }

  async function alternarPublicacion() {
    setPublicando(true);
    setError("");
    try {
      const n = await cambiarPublicacion(negocio.estadoPublicacion !== "publicado");
      setNegocio(n);
    } catch (err) {
      setError(err.message);
    } finally {
      setPublicando(false);
    }
  }

  if (errorPlan) return <div role="alert" className="business-surface p-6"><p className="text-danger">{errorPlan}</p><Button onClick={() => window.location.reload()}>Reintentar</Button></div>;
  if (comprobandoPlan) return <p>Comprobando tu suscripción…</p>;
  if (!suscripcion || !["pro", "elite"].includes(suscripcion.plan.nombre) || suscripcion.estado !== "activa" || !suscripcion.venceEn || new Date(suscripcion.venceEn) <= new Date()) return <PlanesPage primeraLanding onActivated={() => window.location.reload()} />;
  if (existe === null) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  return (
    <div className="business-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {existe ? "Mi Mini Landing Page" : "Crea tu Mini Landing Page"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {existe
              ? "El perfil público que tus clientes verán cuando te busquen en CheckBiz."
              : "Completa lo básico — puedes editar todo después."}
          </p>
        </div>
        {existe && (
          <Badge variant={negocio.estadoPublicacion === "publicado" ? "verified" : "outline"}>
            {negocio.estadoPublicacion === "publicado" ? "Publicado" : "Borrador"}
          </Badge>
        )}
      </div>

      {existe && (
        <div className="panel mb-6 grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3.5" /> Trust Score</p>
            <p className="mt-1 font-display text-xl font-bold">{negocio.trustScore}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> Sello Verificado</p>
            <p className="mt-1 text-sm font-semibold">{negocio.insignias?.some(i => i.nombre === "Emprendedor Verificado") ? "Otorgado" : "Pendiente"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Tag className="size-3.5" /> Catálogo</p>
            <p className="mt-1 font-display text-xl font-bold">{negocio.totalCatalogo}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Globe className="size-3.5" /> Enlace</p>
            <a
              href={`/negocio/publico/${negocio.slug}?vista=negocio`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-1 text-sm font-medium text-trust hover:underline"
            >
              Ver perfil <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}

      {existe && negocio.insignias.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {negocio.insignias.map((ins) => {
            const Icon = ICONO_INSIGNIA[ins.icono] ?? BadgeCheck;
            return (
              <Badge key={ins.nombre} variant="verified" title={ins.descripcion ?? undefined}>
                <Icon className="size-3" /> {ins.nombre}
              </Badge>
            );
          })}
        </div>
      )}

      {existe && <LandingStudio negocio={negocio} suscripcion={suscripcion} onGuardado={setNegocio} />}

      <h2 className="mb-4 mt-8 font-display text-xl font-bold">Identidad y medios del negocio</h2>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <form onSubmit={guardar} className="panel space-y-4 p-6">
        {existe && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SubidaImagen
              label="Portada"
              aspecto="aspect-[16/6]"
              url={negocio.fotoPortadaUrl}
              subiendo={subiendoPortada}
              onSeleccionar={(file) => prepararImagen(file, "portada")}
              onEditarActual={() => editarImagenActual("portada")}
              error={errorPortada}
            />
            <SubidaImagen
              label="Logo"
              aspecto="aspect-square max-w-[9rem]"
              url={negocio.logoUrl}
              subiendo={subiendoLogo}
              onSeleccionar={(file) => prepararImagen(file, "logo")}
              onEditarActual={() => editarImagenActual("logo")}
              error={errorLogo}
            />
          </div>
        )}
        {imagenPendiente && <NegocioImagenEditor key={`${imagenPendiente.tipo}-${imagenPendiente.archivo.name}-${imagenPendiente.archivo.lastModified}`} archivo={imagenPendiente.archivo} tipo={imagenPendiente.tipo} onClose={() => setImagenPendiente(null)} onGuardar={imagenPendiente.tipo === "logo" ? subirArchivoLogo : subirArchivoPortada} />}

        <div>
          <Label htmlFor="nombre">Nombre comercial</Label>
          <div className="relative">
            <Store className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="nombre" required className="pl-10" value={form.nombreComercial} onChange={campo("nombreComercial")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="categoria"
                value={form.categoriaId}
                onChange={campo("categoriaId")}
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="ciudad" className="pl-10" placeholder="Guayaquil" value={form.ciudad} onChange={campo("ciudad")} />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="slogan">Eslogan del negocio</Label>
          <Input id="slogan" maxLength={120} placeholder="Una frase que represente tu negocio" value={form.slogan} onChange={campo("slogan")} />
          <p className="mt-1 text-right text-xs text-muted-foreground">{form.slogan.length}/120</p>
        </div>

        <div>
          <Label htmlFor="desc">Descripción breve</Label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <textarea
              id="desc"
              rows={3}
              maxLength={500}
              placeholder="Cuenta qué ofreces y cómo ayudas a tus clientes"
              value={form.descripcionCorta}
              onChange={campo("descripcionCorta")}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">{form.descripcionCorta.length}/500</p>
        </div>

        {suscripcion?.plan.incluyeVideo ? (
          <div>
            <Label htmlFor="video">Video de presentación</Label>
            <div className="flex flex-wrap items-center gap-3"><input id="video" type="file" accept="video/mp4,.mp4" onChange={elegirVideo} disabled={subiendoVideo} className="text-sm" />{subiendoVideo && <Loader2 className="size-4 animate-spin" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">MP4 de hasta 45 segundos y 25 MB. {form.videoPresentacionUrl && "Hay un video seleccionado; guarda los cambios para publicarlo."}</p>
          </div>
        ) : existe && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-trust" />
            <span>
              El video de presentación está disponible en los planes Básico y Plus.{" "}
              <Link to="/negocio/planes" className="font-medium text-trust hover:underline">Mejora tu plan</Link>
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}
        {exito && (
          <div className="flex items-start gap-2 rounded-lg border border-verified/30 bg-verified/10 px-3 py-2.5 text-sm text-verified">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {exito}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" variant="trust" disabled={guardando}>
            {guardando ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            {existe ? "Guardar cambios" : "Crear mi negocio"}
          </Button>

          {existe && (
            <Button
              type="button"
              variant={negocio.estadoPublicacion === "publicado" ? "outline" : "verified"}
              onClick={alternarPublicacion}
              disabled={publicando}
            >
              {publicando ? (
                <Loader2 className="size-4 animate-spin" />
              ) : negocio.estadoPublicacion === "publicado" ? (
                <><EyeOff className="size-4" /> Pasar a borrador</>
              ) : (
                <><Rocket className="size-4" /> Publicar</>
              )}
            </Button>
          )}
        </div>
      </form>
      <aside className="business-surface business-live-preview p-5 xl:sticky xl:top-8">
        <div className="mb-5"><h2 className="text-lg font-bold">Vista previa en vivo</h2><p className="text-sm text-muted-foreground">Así se verá la información principal para tus clientes. Guarda los cambios para publicarlos.</p></div>
        <div className="business-preview-phone">
          <div className="overflow-hidden rounded-[1.5rem] bg-background">
            <div className="relative h-32 bg-gradient-to-br from-trust/40 via-verified/30 to-action/30">
              {negocio?.fotoPortadaUrl && <img src={resolverImagenNegocio(negocio.fotoPortadaUrl)} alt="Portada del negocio" className="h-full w-full object-cover" />}
            </div>
            <div className="relative px-4 pb-6">
              <div className="-mt-8 grid size-16 place-items-center overflow-hidden rounded-2xl border-4 border-background bg-card shadow-md">
                {negocio?.logoUrl ? <img src={resolverImagenNegocio(negocio.logoUrl)} alt="Logo del negocio" className="size-full object-cover" /> : <Store className="size-7 text-trust" />}
              </div>
              <h3 className="mt-3 break-words text-xl font-bold">{form.nombreComercial || "Nombre de tu negocio"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{categorias.find((c) => String(c.id) === String(form.categoriaId))?.nombre || "Categoría"} · {form.ciudad || "Tu ciudad"}</p>
              {form.slogan && <p className="mt-3 font-semibold text-trust">{form.slogan}</p>}
              <p className="mt-3 min-h-16 break-words text-sm">{form.descripcionCorta || "Cuenta qué producto o servicio ofreces."}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-verified/10 px-3 py-2 text-xs font-semibold text-verified"><span>Perfil verificado</span><span>{negocio?.trustScore ?? 0}/100</span></div>
              <div className="mt-4 rounded-xl bg-trust px-4 py-2.5 text-center text-sm font-semibold text-primary-ink">Contáctenos por chat</div>
            </div>
          </div>
        </div>
        {negocio?.slug && <a href={`/negocio/publico/${negocio.slug}?vista=negocio`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-trust hover:underline">Abrir perfil publicado <ExternalLink className="size-4" /></a>}
      </aside>
      </div>

      {existe && negocio.esDueno && (
        suscripcion?.plan.incluyeMultiusuario ? (
          <EquipoPanel />
        ) : (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-trust" />
            <span>
              Invitar a alguien más a administrar este negocio está disponible en el plan Plus.{" "}
              <Link to="/negocio/planes" className="font-medium text-trust hover:underline">Mejora tu plan</Link>
            </span>
          </div>
        )
      )}
    </div>
  );
}
