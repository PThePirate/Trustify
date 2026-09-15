import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Loader2, CreditCard } from "lucide-react";
import { buscarUsuarios } from "@/services/adminApi";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function fuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const t = setTimeout(() => {
      buscarUsuarios(query).then((r) => {
        setResultados(r);
        setBuscando(false);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  function irA(id) {
    navigate(`/admin/usuarios/${id}`);
    setQuery("");
    setResultados([]);
    setAbierto(false);
  }

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setAbierto(true)}
        placeholder="Buscar por nombre, cédula o correo…"
        className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {abierto && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-auto rounded-xl border border-border bg-card shadow-lg">
          {buscando ? (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Buscando…
            </div>
          ) : resultados.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Sin resultados para "{query}"</p>
          ) : (
            resultados.map((u) => (
              <button
                key={u.id}
                onClick={() => irA(u.id)}
                className="flex w-full items-center gap-3 border-b border-border/60 p-3 text-left last:border-0 hover:bg-muted/50"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-trust/10 text-trust">
                  <User className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.nombreCompleto}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="size-3" /> {u.cedula} · {u.correo}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}