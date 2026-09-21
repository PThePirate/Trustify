import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, Plus, Pencil, Trash2, Loader2, AlertCircle, X, Check, Sparkles, Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listarCatalogo, crearItemCatalogo, actualizarItemCatalogo, eliminarItemCatalogo, obtenerMiSuscripcion,
} from "@/services/negocioApi";

const VACIO = { nombre: "", precioReferencial: "", nombreEn: "" };

function formatearPrecio(p) {
  if (p === null || p === undefined) return "Sin precio";
  return `$${Number(p).toFixed(2)}`;
}

export default function CatalogoPage() {
  const [items, setItems] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [limiteAlcanzado, setLimiteAlcanzado] = useState(false);

  function cargar() {
    listarCatalogo().then(setItems).catch((err) => setError(err.message));
    obtenerMiSuscripcion().then(setSuscripcion).catch(() => {});
  }
  useEffect(cargar, []);

  function empezarEdicion(item) {
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
        nombreEn: form.nombreEn.trim() || null,
      };
      if (editandoId) {
        await actualizarItemCatalogo(editandoId, { ...datos, activo: true });
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Catálogo</h1>
        <p className="mt-1 text-muted-foreground">
          Productos o servicios con precio referencial — así los ven tus clientes en tu perfil público.
        </p>
        {suscripcion && (
          <p className="mt-1 text-sm text-muted-foreground">
            {items?.length ?? suscripcion.totalCatalogoUsado}/{suscripcion.plan.limiteCatalogo} ítems usados en tu plan{" "}
            {suscripcion.plan.nombre === "basico" ? "Básico" : suscripcion.plan.nombre === "pro" ? "Pro" : "Elite"}.
          </p>
        )}
      </div>

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
            La traducción de catálogo (ES↔EN, self-service) es una función de los planes Pro y Elite.{" "}
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

      {items === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Package className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no tienes ítems en tu catálogo</p>
          <p className="text-sm text-muted-foreground">Agrega el primero arriba.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="panel flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{item.nombre}</p>
                {item.nombreEn && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Languages className="size-3" /> {item.nombreEn}</p>
                )}
                <p className="text-sm text-muted-foreground">{formatearPrecio(item.precioReferencial)}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => empezarEdicion(item)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => eliminar(item.id)} className="grid size-8 place-items-center rounded-lg text-danger hover:bg-danger/10">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}