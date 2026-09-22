import { useEffect, useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { Search, Palette, Code2, Stethoscope, Box, Scale, Sparkles, GraduationCap, Wrench, Tag, ShieldCheck } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listarCategoriasDisponibles } from "@/services/negocioApi";

const ICONOS = {
  palette: Palette, code: Code2, stethoscope: Stethoscope, box: Box,
  scale: Scale, sparkles: Sparkles, "graduation-cap": GraduationCap, wrench: Wrench,
};

export default function BuscarPage() {
  const [texto, setTexto] = useState("");
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const { dentroClienteShell = false } = useOutletContext() || {};

  useEffect(() => {
    listarCategoriasDisponibles().then(setCategorias);
  }, []);

  function buscar(e) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (texto.trim()) params.set("texto", texto.trim());
    navigate(`/buscar/resultados?${params.toString()}`);
  }

  function buscarPorCategoria(id) {
    navigate(`/buscar/resultados?categoriaId=${id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      {!dentroClienteShell && (
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/"><Logo /></Link>
          <ThemeToggle />
        </header>
      )}

      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-trust/25 bg-trust/10 px-3 py-1.5 text-xs font-semibold text-trust">
          <ShieldCheck className="size-3.5" /> Solo negocios con identidad verificada
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
          Encuentra un negocio verificado
        </h1>
        <p className="mt-2 text-muted-foreground">
          Busca por nombre o explora por categoría — cada perfil está respaldado por cédula y contrato real.
        </p>

        <form onSubmit={buscar} className="mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ej: diseño de logo, veterinaria, Guayaquil…"
              className="h-12 pl-10"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <Button type="submit" variant="trust" size="lg" className="h-12">
            Buscar
          </Button>
        </form>

        <div className="mt-4">
          <Link to="/buscar/resultados" className="text-sm text-trust hover:underline">
            O explora todos los negocios publicados →
          </Link>
        </div>
      </div>

      {categorias.length > 0 && (
        <div className="mx-auto max-w-4xl px-6 pb-16">
          <p className="mb-4 text-center text-sm font-semibold text-muted-foreground">Categorías</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map((c) => {
              const Icon = ICONOS[c.icono] || Tag;
              return (
                <button
                  key={c.id}
                  onClick={() => buscarPorCategoria(c.id)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-trust/40 hover:text-trust"
                >
                  <Icon className="size-4" /> {c.nombre}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
