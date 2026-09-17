import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Contact, Phone, ShieldCheck, CheckCircle2, XCircle,
  FileText, Store, Loader2, AlertCircle, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import { obtenerPerfil, actualizarPerfil, logout } from "@/services/authApi";

const CAPAS = [
  { n: 1, nombre: "Estructura (cédula)" },
  { n: 2, nombre: "Correo verificado" },
  { n: 3, nombre: "Foto revisada" },
  { n: 4, nombre: "SENESCYT/SRI" },
];

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({ nombreCompleto: "", telefono: "" });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPerfil()
      .then((u) => {
        setUsuario(u);
        setForm({ nombreCompleto: u.nombreCompleto, telefono: u.telefono });
      })
      .catch((err) => setError(err.message));
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setError("");
    setExito(false);
    setGuardando(true);
    try {
      const u = await actualizarPerfil(form);
      setUsuario(u);
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  function salir() {
    logout();
    navigate("/");
  }

  if (error && !usuario) {
    return <p className="p-6 text-sm text-danger">{error}</p>;
  }
  if (!usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" /> Cargando…
      </div>
    );
  }

  const capaCumplida = (n) => {
    if (n <= 2) return usuario.kycLayer >= n;
    if (n === 3) return usuario.fotoVerificacionEstado === "aprobada";
    return usuario.senescytSriEstado === "verificado";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-trust/10 font-display text-xl font-bold text-trust">
            {usuario.nombreCompleto.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{usuario.nombreCompleto}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {usuario.rolCliente && <Badge variant="trust">Cliente</Badge>}
              {usuario.rolEmprendedor && <Badge variant="verified">Emprendedor</Badge>}
            </div>
          </div>
        </div>

        {/* Identidad verificada */}
        <div className="panel mb-6 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
            <ShieldCheck className="size-4 text-trust" /> Tu identidad verificada
          </h2>
          <div className="space-y-1.5">
            {CAPAS.map((c) => (
              <div key={c.n} className="flex items-center gap-2 text-sm">
                {capaCumplida(c.n) ? (
                  <CheckCircle2 className="size-4 text-verified" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground/40" />
                )}
                <span className={capaCumplida(c.n) ? "" : "text-muted-foreground/60"}>{c.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Link to="/mis-solicitudes" className="panel panel-hover flex items-center gap-3 p-4">
            <FileText className="size-5 text-trust" />
            <div>
              <p className="font-medium">Mis solicitudes</p>
              <p className="text-xs text-muted-foreground">Ver, confirmar y reseñar</p>
            </div>
          </Link>
          {usuario.rolEmprendedor && (
            <Link to="/negocio" className="panel panel-hover flex items-center gap-3 p-4">
              <Store className="size-5 text-verified" />
              <div>
                <p className="font-medium">Mi negocio</p>
                <p className="text-xs text-muted-foreground">Panel de emprendedor</p>
              </div>
            </Link>
          )}
        </div>

        {/* Datos personales */}
        <form onSubmit={guardar} className="panel space-y-4 p-6">
          <h2 className="font-display text-base font-bold">Mis datos</h2>

          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="nombre" required className="pl-10" value={form.nombreCompleto}
                onChange={(e) => setForm((f) => ({ ...f, nombreCompleto: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="telefono" required inputMode="numeric" className="pl-10" value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value.replace(/\D/g, "") }))} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Correo</Label>
              <div className="relative opacity-60">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={usuario.correo} disabled className="pl-10" />
              </div>
            </div>
            <div>
              <Label>Cédula</Label>
              <div className="relative opacity-60">
                <Contact className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={usuario.cedula} disabled className="pl-10" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            El correo y la cédula no se pueden editar — están ligados a tu identidad verificada.
          </p>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>
          )}
          {exito && (
            <p className="flex items-center gap-1.5 text-sm text-verified"><CheckCircle2 className="size-4" /> Guardado</p>
          )}

          <Button type="submit" variant="trust" disabled={guardando}>
            {guardando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Guardar cambios
          </Button>
        </form>

        <button onClick={salir} className="mt-6 text-sm text-muted-foreground hover:text-danger">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}