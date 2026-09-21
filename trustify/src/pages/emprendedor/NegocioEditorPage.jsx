import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store, MapPin, Phone, Tag, FileText, Globe, ShieldCheck, Star,
  Loader2, AlertCircle, CheckCircle2, ExternalLink, Rocket, EyeOff, Video, Sparkles,
  BadgeCheck, GraduationCap, Languages, Image as ImageIcon, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  obtenerMiNegocio, crearNegocio, actualizarNegocio,
  cambiarPublicacion, listarCategoriasDisponibles, obtenerMiSuscripcion,
  subirLogo, subirPortada, resolverImagenNegocio,
} from "@/services/negocioApi";

const VACIO = { nombreComercial: "", categoriaId: "", descripcionCorta: "", ciudad: "", whatsapp: "", videoPresentacionUrl: "" };
const ICONO_INSIGNIA = { "badge-check": BadgeCheck, "graduation-cap": GraduationCap, "shield-check": ShieldCheck, languages: Languages };

function SubidaImagen({ label, aspecto, url, subiendo, onSeleccionar, error }) {
  const inputRef = useRef(null);
  return (
    <div>
      <Label>{label}</Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/20 hover:border-trust ${aspecto}`}
      >
        {url ? (
          <img src={resolverImagenNegocio(url)} alt={label} className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <ImageIcon className="size-6" />
            <span className="text-xs">JPG, PNG o WEBP</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
          {subiendo ? <Loader2 className="size-5 animate-spin" /> : <span className="flex items-center gap-1.5 text-sm font-medium"><Upload className="size-4" /> {url ? "Cambiar" : "Subir"}</span>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onSeleccionar(file);
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function NegocioEditorPage() {
  const [negocio, setNegocio] = useState(null);
  const [existe, setExiste] = useState(null); // null = cargando, false = no tiene, true = sí tiene
  const [categorias, setCategorias] = useState([]);
  const [suscripcion, setSuscripcion] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  const [errorLogo, setErrorLogo] = useState("");
  const [errorPortada, setErrorPortada] = useState("");

  useEffect(() => {
    listarCategoriasDisponibles().then(setCategorias);
    obtenerMiSuscripcion().then(setSuscripcion).catch(() => {});
    cargar();
  }, []);

  async function cargar() {
    try {
      const n = await obtenerMiNegocio();
      setNegocio(n);
      setForm({
        nombreComercial: n.nombreComercial,
        categoriaId: n.categoria?.id ?? "",
        descripcionCorta: n.descripcionCorta ?? "",
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
    } finally {
      setSubiendoPortada(false);
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

  if (existe === null) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
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
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> Nivel</p>
            <p className="mt-1 text-sm font-semibold capitalize">{negocio.nivelFormalizacion}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Tag className="size-3.5" /> Catálogo</p>
            <p className="mt-1 font-display text-xl font-bold">{negocio.totalCatalogo}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Globe className="size-3.5" /> Enlace</p>
            <a
              href={`/negocio/publico/${negocio.slug}`}
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

      <form onSubmit={guardar} className="panel space-y-4 p-6">
        {existe && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SubidaImagen
              label="Portada"
              aspecto="aspect-[16/6]"
              url={negocio.fotoPortadaUrl}
              subiendo={subiendoPortada}
              onSeleccionar={subirArchivoPortada}
              error={errorPortada}
            />
            <SubidaImagen
              label="Logo"
              aspecto="aspect-square max-w-[9rem]"
              url={negocio.logoUrl}
              subiendo={subiendoLogo}
              onSeleccionar={subirArchivoLogo}
              error={errorLogo}
            />
          </div>
        )}

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
          <Label htmlFor="desc">Descripción corta</Label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <textarea
              id="desc"
              rows={3}
              maxLength={280}
              placeholder="En una frase, ¿qué ofreces?"
              value={form.descripcionCorta}
              onChange={campo("descripcionCorta")}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">{form.descripcionCorta.length}/280</p>
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp de contacto</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="whatsapp" required inputMode="numeric" placeholder="0991234567" className="pl-10"
              value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") }))} />
          </div>
        </div>

        {suscripcion?.plan.incluyeVideo ? (
          <div>
            <Label htmlFor="video">Video de presentación</Label>
            <div className="relative">
              <Video className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="video" type="url" placeholder="Enlace de YouTube, Vimeo o video directo" className="pl-10"
                value={form.videoPresentacionUrl} onChange={campo("videoPresentacionUrl")} />
            </div>
          </div>
        ) : existe && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-trust" />
            <span>
              El video de presentación es una función de los planes Pro y Elite.{" "}
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
    </div>
  );
}