import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MapPin, Star, ShieldCheck, Search, Loader2, PackageSearch, X,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  buscarNegocios, listarCategoriasDisponibles, listarCiudadesDisponibles, resolverImagenNegocio,
} from "@/services/negocioApi";

const NIVEL_LABEL = { semilla: "Semilla", asesoria: "En asesoría", formalizado: "Formalizado" };
const ORDENES = [
  { id: "relevancia", label: "Más relevantes" },
  { id: "nombre", label: "Nombre A-Z" },
];

function NegocioCard({ n }) {
  const iniciales = n.nombreComercial.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <Link to={`/negocio/publico/${n.slug}`} className="panel panel-hover flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-trust/10 font-display text-sm font-bold text-trust">
          {n.logoUrl ? (
            <img src={resolverImagenNegocio(n.logoUrl)} alt="" className="size-full rounded-xl object-cover" />
          ) : iniciales}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate font-semibold">
            {n.nombreComercial} <ShieldCheck className="size-3.5 shrink-0 text-verified" />
          </p>
          <p className="text-xs text-muted-foreground">
            {n.categoria?.nombre ?? "Sin categoría"}
            {n.ciudad && <> · <MapPin className="inline size-3" /> {n.ciudad}</>}
          </p>
        </div>
      </div>

      {n.descripcionCorta && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{n.descripcionCorta}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <Badge variant="outline">{NIVEL_LABEL[n.nivelFormalizacion] ?? n.nivelFormalizacion}</Badge>
        <span className="flex items-center gap-1 text-sm font-medium">
          <Star className="size-3.5 text-pending" /> {n.trustScore}
        </span>
      </div>
    </Link>
  );
}

export default function ResultadosBusquedaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultados, setResultados] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [orden, setOrden] = useState("relevancia");

  const texto = searchParams.get("texto") || "";
  const categoriaId = searchParams.get("categoriaId") || "";
  const ciudad = searchParams.get("ciudad") || "";
  const nivel = searchParams.get("nivel") || "";

  useEffect(() => {
    listarCategoriasDisponibles().then(setCategorias);
    listarCiudadesDisponibles().then(setCiudades);
  }, []);

  useEffect(() => {
    setResultados(null);
    buscarNegocios({
      texto: texto || undefined,
      categoriaId: categoriaId || undefined,
      ciudad: ciudad || undefined,
      nivel: nivel || undefined,
    }).then(setResultados);
  }, [texto, categoriaId, ciudad, nivel]);

  function actualizarFiltro(clave, valor) {
    const nuevos = new URLSearchParams(searchParams);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    setSearchParams(nuevos);
  }

  const ordenados = useMemo(() => {
    if (!resultados) return null;
    const copia = [...resultados];
    if (orden === "nombre") copia.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
    return copia; // "relevancia" ya viene ordenado del backend (trustScore + antigüedad)
  }, [resultados, orden]);

  const hayFiltros = texto || categoriaId || ciudad || nivel;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Negocios verificados</h1>
            <p className="text-sm text-muted-foreground">
              {ordenados ? `${ordenados.length} resultado${ordenados.length === 1 ? "" : "s"}` : "Buscando…"}
            </p>
          </div>
          <Link to="/buscar" className="flex items-center gap-1.5 text-sm text-trust hover:underline">
            <Search className="size-3.5" /> Nueva búsqueda
          </Link>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <select
            value={categoriaId}
            onChange={(e) => actualizarFiltro("categoriaId", e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>

          <select
            value={ciudad}
            onChange={(e) => actualizarFiltro("ciudad", e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={nivel}
            onChange={(e) => actualizarFiltro("nivel", e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Cualquier nivel</option>
            {Object.entries(NIVEL_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {ORDENES.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>

          {hayFiltros && (
            <button
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Resultados */}
        {ordenados === null ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Cargando…
          </div>
        ) : ordenados.length === 0 ? (
          <div className="panel flex flex-col items-center gap-2 py-16 text-center">
            <PackageSearch className="size-8 text-muted-foreground/50" />
            <p className="font-medium">No encontramos negocios con estos filtros</p>
            <p className="text-sm text-muted-foreground">Prueba con otra categoría o quita algún filtro.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordenados.map((n) => <NegocioCard key={n.slug} n={n} />)}
          </div>
        )}
      </div>
    </div>
  );
}