import { useEffect, useState } from "react";
import {
  Tags, Plus, Palette, Code2, Stethoscope, Box, Scale, Sparkles,
  GraduationCap, Wrench, Tag, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listarCategorias, crearCategoria, alternarCategoria } from "@/services/adminApi";

const ICONOS = {
  palette: Palette, code: Code2, stethoscope: Stethoscope, box: Box,
  scale: Scale, sparkles: Sparkles, "graduation-cap": GraduationCap, wrench: Wrench,
};

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState(null);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");

  function cargar() {
    listarCategorias().then(setCategorias);
  }
  useEffect(cargar, []);

  async function crear(e) {
    e.preventDefault();
    if (!nombreNuevo.trim()) return;
    setError("");
    setCreando(true);
    try {
      await crearCategoria({ nombre: nombreNuevo.trim() });
      setNombreNuevo("");
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreando(false);
    }
  }

  async function toggle(id) {
    setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, activa: !c.activa } : c)));
    await alternarCategoria(id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Categorías del catálogo</h1>
        <p className="mt-1 text-muted-foreground">
          Estas categorías aparecen en el buscador y en el filtro de negocios.
          Desactivar una no borra los negocios que ya la usan.
        </p>
      </div>

      <form onSubmit={crear} className="panel mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Nueva categoría</label>
          <Input
            value={nombreNuevo}
            onChange={(e) => setNombreNuevo(e.target.value)}
            placeholder="Ej: Fotografía"
          />
        </div>
        <Button type="submit" variant="trust" disabled={!nombreNuevo.trim() || creando}>
          {creando ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Agregar
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {!categorias ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando…
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categorias.map((cat) => {
            const Icon = ICONOS[cat.icono] || Tag;
            return (
              <div key={cat.id} className="panel flex items-center gap-3 p-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${cat.activa ? "bg-trust/10 text-trust" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{cat.nombre}</p>
                  <p className="text-xs text-muted-foreground">{cat.negocios} negocios</p>
                </div>
                <button
                  onClick={() => toggle(cat.id)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    cat.activa
                      ? "border-verified/30 bg-verified/10 text-verified"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {cat.activa ? "Activa" : "Inactiva"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}