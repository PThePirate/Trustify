import { useEffect, useState } from "react";
import {
  Award, Plus, Loader2, AlertCircle, CheckCircle2, X, Link2, Trash2, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  listarInsigniasCoBranded, crearInsigniaCoBranded, asignarInsigniaCoBranded, revocarInsigniaCoBranded,
} from "@/services/adminApi";

const VACIO = { nombre: "", descripcion: "", icono: "" };

export default function GestionInsigniasPage() {
  const [insignias, setInsignias] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");
  const [asignando, setAsignando] = useState(null); // id de la insignia con el formulario de asignar abierto
  const [slugAsignar, setSlugAsignar] = useState("");
  const [cargandoAccion, setCargandoAccion] = useState(false);

  function cargar() {
    listarInsigniasCoBranded().then(setInsignias).catch((err) => setError(err.message));
  }
  useEffect(cargar, []);

  async function crear(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setError("");
    setCreando(true);
    try {
      await crearInsigniaCoBranded({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        icono: form.icono.trim() || null,
      });
      setForm(VACIO);
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo crear la insignia");
    } finally {
      setCreando(false);
    }
  }

  async function asignar(id) {
    if (!slugAsignar.trim()) return;
    setError("");
    setCargandoAccion(true);
    try {
      await asignarInsigniaCoBranded(id, slugAsignar.trim());
      setAsignando(null);
      setSlugAsignar("");
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo asignar la insignia");
    } finally {
      setCargandoAccion(false);
    }
  }

  async function revocar(id, negocioId) {
    if (!confirm("¿Quitar esta insignia a este negocio?")) return;
    setError("");
    try {
      await revocarInsigniaCoBranded(id, negocioId);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Insignias co-branded</h1>
        <p className="mt-1 text-muted-foreground">
          Alianzas con instituciones (cámaras, universidades, gremios) que tú asignas a mano — a
          diferencia de las insignias automáticas de Reputación (B10), estas también se pueden revocar.
        </p>
      </div>

      <form onSubmit={crear} className="panel mb-6 space-y-3 p-5">
        <p className="text-sm font-semibold">Crear nueva insignia</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="Ej: Aliado Cámara de Comercio"
              value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="icono">Ícono (opcional)</Label>
            <Input id="icono" placeholder="badge-check, shield-check…"
              value={form.icono} onChange={(e) => setForm((f) => ({ ...f, icono: e.target.value }))} />
          </div>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripción (opcional)</Label>
          <Input id="descripcion" placeholder="Qué representa esta alianza"
            value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
        </div>
        <Button type="submit" variant="trust" disabled={creando || !form.nombre.trim()}>
          {creando ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Crear insignia
        </Button>
      </form>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
        </div>
      )}

      {insignias === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : insignias.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-16 text-center">
          <Award className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no hay insignias co-branded</p>
          <p className="text-sm text-muted-foreground">Crea la primera arriba.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insignias.map((ins) => (
            <div key={ins.id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <Award className="size-4 text-trust" /> {ins.nombre}
                  </p>
                  {ins.descripcion && <p className="mt-0.5 text-sm text-muted-foreground">{ins.descripcion}</p>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setAsignando(asignando === ins.id ? null : ins.id); setSlugAsignar(""); }}
                >
                  <Link2 className="size-3.5" /> Asignar
                </Button>
              </div>

              {asignando === ins.id && (
                <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3">
                  <div className="flex-1">
                    <Label htmlFor={`slug-${ins.id}`}>Enlace del negocio (slug)</Label>
                    <Input
                      id={`slug-${ins.id}`}
                      placeholder="ej: taller-qr-prueba"
                      value={slugAsignar}
                      onChange={(e) => setSlugAsignar(e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="trust" size="sm" disabled={cargandoAccion || !slugAsignar.trim()} onClick={() => asignar(ins.id)}>
                    {cargandoAccion ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />} Confirmar
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAsignando(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {ins.negociosAsignados.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                  {ins.negociosAsignados.map((n) => (
                    <Badge key={n.negocioId} variant="verified" className="gap-1.5">
                      <Building2 className="size-3" /> {n.nombreComercial}
                      <button onClick={() => revocar(ins.id, n.negocioId)} title="Revocar" className="ml-1 hover:text-danger">
                        <Trash2 className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
