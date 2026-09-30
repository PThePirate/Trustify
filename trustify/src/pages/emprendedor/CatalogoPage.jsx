import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, Plus, Pencil, Trash2, Loader2, AlertCircle, X, Check, Sparkles, Languages, Image as ImageIcon, Search, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listarCatalogo, crearItemCatalogo, actualizarItemCatalogo, eliminarItemCatalogo, obtenerMiSuscripcion,
  subirFotoItemCatalogo, resolverImagenNegocio,
} from "@/services/negocioApi";

const VACIO = { nombre: "", precioReferencial: "", nombreEn: "" };

function formatearPrecio(p) {
  if (p === null || p === undefined) return "Sin precio";
  return `$${Number(p).toFixed(2)}`;
}

function FotoItem({ fotoUrl, subiendo, onSeleccionar }) {
  const inputRef = useRef(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      className="group relative grid size-14 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/20 hover:border-trust"
      title="Subir foto del ítem"
    >
      {fotoUrl ? (
        <img src={resolverImagenNegocio(fotoUrl)} alt="" className="size-full object-cover" />
      ) : (
        <ImageIcon className="size-5 text-muted-foreground" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        {subiendo ? <Loader2 className="size-4 animate-spin text-white" /> : <Pencil className="size-3.5 text-white" />}
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
  );
}

export default function CatalogoPage() {
  const [items, setItems] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [limiteAlcanzado, setLimiteAlcanzado] = useState(false);
  const [subiendoFotoId, setSubiendoFotoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const filtrados = useMemo(() => (items || []).filter(item => {
    const coincideTexto = item.nombre.toLocaleLowerCase("es").includes(busqueda.trim().toLocaleLowerCase("es"));
    return coincideTexto && (filtro === "todos" || (filtro === "disponibles" ? item.activo : !item.activo));
  }), [items, busqueda, filtro]);

  function cargar() {
    listarCatalogo().then(setItems).catch((err) => setError(err.message));
    obtenerMiSuscripcion().then(setSuscripcion).catch(() => {});
  }
  useEffect(cargar, []);

  function empezarEdicion(item) {
    setError("");
    setEditandoId(item.id);
    setForm({ nombre: item.nombre, precioReferencial: item.precioReferencial ?? "", nombreEn: item.nombreEn ?? "" });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function guardar(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setError("");
    setLimiteAlcanzado(false);
    setGuardando(true);
    try {
      const datos = {
        nombre: form.nombre.trim(),
        precioReferencial: form.precioReferencial === "" ? null : Number(form.precioReferencial),
        nombreEn: suscripcion?.plan.incluyeTraduccion ? (form.nombreEn.trim() || null) : null,
      };
      if (editandoId) {
        const actual = items.find((item) => item.id === editandoId);
        await actualizarItemCatalogo(editandoId, { ...datos, fotoUrl: actual?.fotoUrl ?? null, activo: actual?.activo ?? true });
      } else {
        await crearItemCatalogo(datos);
      }
      cancelar();
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo guardar");
      setLimiteAlcanzado(err.codigo === "LIMITE_CATALOGO_ALCANZADO");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar este ítem del catálogo?")) return;
    try {
      await eliminarItemCatalogo(id);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function subirFoto(id, file) {
    setError("");
    setSubiendoFotoId(id);
    try {
      await subirFotoItemCatalogo(id, file);
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo subir la foto");
    } finally {
      setSubiendoFotoId(null);
    }
  }

  async function alternarDisponible(item) {
    setError("");
    try {
      await actualizarItemCatalogo(item.id, { nombre: item.nombre, precioReferencial: item.precioReferencial, fotoUrl: item.fotoUrl, nombreEn: item.nombreEn, activo: !item.activo });
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo cambiar la disponibilidad");
      setLimiteAlcanzado(err.codigo === "LIMITE_CATALOGO_ALCANZADO");
    }
  }

  return (
    <div className="business-page">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Catálogo</h1>
        <p className="mt-1 text-muted-foreground">
          Productos o servicios con precio referencial — así los ven tus clientes en tu perfil público.
        </p>
        {suscripcion && (
          <p className="mt-1 text-sm text-muted-foreground">
            {suscripcion.totalCatalogoUsado}/{suscripcion.plan.limiteCatalogo >= 32767 ? "∞" : suscripcion.plan.limiteCatalogo} ítems disponibles en tu plan{" "}
            {suscripcion.plan.nombre === "basico" ? "Acceso inicial" : suscripcion.plan.nombre === "pro" ? "Básico" : "Plus"}.
          </p>
        )}
      </div>

      {suscripcion && <div className="business-section-banner mb-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-trust">Tu vitrina de productos y servicios</p><p className="mt-1 font-display text-2xl font-bold">{items?.filter((item) => item.activo).length ?? 0} de {suscripcion.plan.limiteCatalogo >= 32767 ? "∞" : suscripcion.plan.limiteCatalogo} espacios usados</p></div><Link to="/negocio/planes" className="text-sm font-semibold text-trust hover:underline">Ver capacidad del plan</Link></div>
        {suscripcion.plan.limiteCatalogo < 32767 && <div className="relative z-10 mt-4 h-2 overflow-hidden rounded-full bg-card/70"><div className="h-full rounded-full bg-verified transition-all" style={{ width: `${Math.min(100, ((items?.filter((item) => item.activo).length ?? 0) / Math.max(1, suscripcion.plan.limiteCatalogo)) * 100)}%` }} /></div>}
      </div>}

      <form onSubmit={guardar} className="panel mb-6 p-5">
        <p className="mb-3 text-sm font-semibold">
          {editandoId ? "Editar ítem" : "Agregar nuevo ítem"}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Ej: Diseño de logo"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div className="sm:w-40">
            <Label htmlFor="precio">Precio referencial</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              placeholder="$"
              value={form.precioReferencial}
              onChange={(e) => setForm((f) => ({ ...f, precioReferencial: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="trust" disabled={guardando || !form.nombre.trim()}>
              {guardando ? <Loader2 className="size-4 animate-spin" /> : editandoId ? <Check className="size-4" /> : <Plus className="size-4" />}
              {editandoId ? "Guardar" : "Agregar"}
            </Button>
            {editandoId && (
              <Button type="button" variant="ghost" onClick={cancelar}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {suscripcion?.plan.incluyeTraduccion ? (
          <div className="mt-3">
            <Label htmlFor="nombreEn">Nombre en inglés (opcional)</Label>
            <div className="relative">
              <Languages className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="nombreEn" placeholder="Ej: Logo design" className="pl-10"
                value={form.nombreEn} onChange={(e) => setForm((f) => ({ ...f, nombreEn: e.target.value }))} />
            </div>
          </div>
        ) : (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-trust" />
            La edición del catálogo en inglés está disponible en el plan Plus.{" "}
            <Link to="/negocio/planes" className="font-medium text-trust hover:underline">Mejora tu plan</Link>
          </p>
        )}
      </form>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            {error}
            {limiteAlcanzado && (
              <>
                {" "}
                <Link to="/negocio/planes" className="inline-flex items-center gap-1 font-semibold underline">
                  <Sparkles className="size-3.5" /> Mejora tu plan
                </Link>
              </>
            )}
          </span>
        </div>
      )}

      {items?.length > 0 && <div className="catalog-toolbar" aria-label="Explorar catálogo">
        <div><strong>Productos publicados</strong><p>Encuentra y administra cada diseño de tu vitrina.</p></div>
        <label className="catalog-search"><Search size={17} /><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar camiseta…" aria-label="Buscar productos" /></label>
        <div className="catalog-filters" role="group" aria-label="Filtrar disponibilidad">
          {[["todos", "Todos", items.length], ["disponibles", "Disponibles", items.filter(item => item.activo).length], ["agotados", "Agotados", items.filter(item => !item.activo).length]].map(([valor, label, total]) => <button key={valor} type="button" aria-pressed={filtro === valor} onClick={() => setFiltro(valor)}>{label} <span>{total}</span></button>)}
        </div>
      </div>}

      {items === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Package className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no tienes ítems en tu catálogo</p>
          <p className="text-sm text-muted-foreground">Agrega el primero arriba.</p>
        </div>
      ) : (
        filtrados.length === 0 ? <div className="panel p-8 text-center text-muted-foreground">No hay productos que coincidan con este filtro.</div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((item) => (
            <div key={item.id} className="business-surface business-catalog-card overflow-hidden">
              <div className="catalog-card-media">
                {item.fotoUrl ? <img src={resolverImagenNegocio(item.fotoUrl)} alt={item.nombre} loading="lazy" /> : <Package className="size-12 text-trust/60" />}
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${item.activo ? "bg-verified text-primary-ink" : "bg-card text-foreground"}`}>{item.activo ? "Disponible" : "Agotado"}</span>
                {item.fotoUrl && <button type="button" className="catalog-view-photo" onClick={() => setFotoAmpliada(item)}><Eye size={16} /> Ver foto completa</button>}
              </div>
              <div className="p-4">
              <div className="flex items-center gap-3">
                <FotoItem
                  fotoUrl={item.fotoUrl}
                  subiendo={subiendoFotoId === item.id}
                  onSeleccionar={(file) => subirFoto(item.id, file)}
                />
                <div className="min-w-0">
                  <span className="catalog-item-kind">{item.nombre.toLocaleLowerCase("es").startsWith("camiseta") ? "Camiseta" : "Producto o servicio"}</span>
                  <p className="font-medium">{item.nombre}</p>
                  {item.nombreEn && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Languages className="size-3" /> {item.nombreEn}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{formatearPrecio(item.precioReferencial)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-1.5 border-t border-border pt-3">
                <button type="button" role="switch" aria-checked={item.activo} aria-label={`Marcar ${item.nombre} como ${item.activo ? "agotado" : "disponible"}`} onClick={() => alternarDisponible(item)} className="catalog-availability"><span className={`catalog-switch ${item.activo ? "is-on" : ""}`} aria-hidden="true"><span /></span><span>{item.activo ? "Disponible" : "Agotado"}</span></button>
                <div className="flex gap-1">
                <button type="button" aria-label={`Editar ${item.nombre}`} onClick={() => empezarEdicion(item)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="size-4" />
                </button>
                <button type="button" aria-label={`Eliminar ${item.nombre}`} onClick={() => eliminar(item.id)} className="grid size-8 place-items-center rounded-lg text-danger hover:bg-danger/10">
                  <Trash2 className="size-4" />
                </button>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {fotoAmpliada && <div className="catalog-photo-backdrop" role="presentation" onClick={() => setFotoAmpliada(null)}><div className="catalog-photo-dialog" role="dialog" aria-modal="true" aria-label={`Foto de ${fotoAmpliada.nombre}`} onClick={e => e.stopPropagation()}><div className="catalog-photo-head"><strong>{fotoAmpliada.nombre}</strong><button type="button" aria-label="Cerrar foto" onClick={() => setFotoAmpliada(null)}><X size={20} /></button></div><img src={resolverImagenNegocio(fotoAmpliada.fotoUrl)} alt={fotoAmpliada.nombre} /></div></div>}
    </div>
  );
}
