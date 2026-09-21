import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Contact, Phone, ShieldCheck, CheckCircle2, XCircle,
  FileText, Store, Loader2, AlertCircle, Save, Camera, HelpCircle, GraduationCap, Clock,
  Lock, ShieldAlert, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import {
  obtenerPerfil, actualizarPerfil, logout, subirFotoPerfil, obtenerFotoPerfilUrl,
  cambiarPassword, eliminarCuenta,
} from "@/services/authApi";
import {
  listarUniversidades, solicitarVerificacionAlumni, misVerificacionesAlumni,
} from "@/services/alumniApi";

const ALUMNI_ESTADO_INFO = {
  pendiente: { label: "En revisión", variant: "pending" },
  verificado: { label: "Verificado", variant: "verified" },
  rechazado: { label: "No verificado", variant: "outline" },
};

/** Verificación de alumni (Módulo C) — pedirle a una universidad que te reconozca como su egresado. */
function VerificacionAlumni() {
  const [universidades, setUniversidades] = useState(null);
  const [misVerificaciones, setMisVerificaciones] = useState(null);
  const [seleccion, setSeleccion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  function cargar() {
    listarUniversidades().then(setUniversidades).catch(() => setUniversidades([]));
    misVerificacionesAlumni().then(setMisVerificaciones).catch(() => setMisVerificaciones([]));
  }
  useEffect(cargar, []);

  async function solicitar(e) {
    e.preventDefault();
    if (!seleccion) return;
    setError("");
    setEnviando(true);
    try {
      await solicitarVerificacionAlumni(Number(seleccion));
      setSeleccion("");
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!universidades || !misVerificaciones) return null;

  const yaSolicitadas = new Set(misVerificaciones.map((v) => v.universidad.id));
  const disponibles = universidades.filter((u) => !yaSolicitadas.has(u.id));

  return (
    <div className="panel mb-6 p-5">
      <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
        <GraduationCap className="size-4 text-trust" /> Verificación de alumni
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Pide que tu universidad te reconozca como su egresado — suma a tu identidad verificada.
      </p>

      {misVerificaciones.length > 0 && (
        <div className="mb-3 space-y-2">
          {misVerificaciones.map((v) => {
            const info = ALUMNI_ESTADO_INFO[v.estado] ?? { label: v.estado, variant: "outline" };
            return (
              <div key={v.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                <span>{v.universidad.nombre}</span>
                <Badge variant={info.variant}>
                  {v.estado === "pendiente" && <Clock className="size-3.5" />} {info.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {disponibles.length > 0 && (
        <form onSubmit={solicitar} className="flex gap-2">
          <select
            value={seleccion}
            onChange={(e) => setSeleccion(e.target.value)}
            className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecciona tu universidad…</option>
            {disponibles.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
          <Button type="submit" variant="trust" disabled={enviando || !seleccion}>
            {enviando ? <Loader2 className="size-4 animate-spin" /> : "Solicitar"}
          </Button>
        </form>
      )}

      {error && <p className="mt-2 flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>}
    </div>
  );
}

/** Avatar del comprador (A9) — foto propia si la subió, iniciales si no. */
function AvatarPerfil({ usuario, onActualizado }) {
  const [fotoUrl, setFotoUrl] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    let objectUrl = null;
    let cancelado = false;
    if (usuario.fotoPerfilUrl) {
      obtenerFotoPerfilUrl().then((u) => {
        if (cancelado || !u) return;
        objectUrl = u;
        setFotoUrl(u);
      });
    }
    return () => {
      cancelado = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [usuario.fotoPerfilUrl]);

  async function elegirArchivo(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError("");
    setSubiendo(true);
    try {
      const actualizado = await subirFotoPerfil(archivo);
      onActualizado(actualizado);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  return (
    <div className="relative shrink-0">
      <div className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-trust/10 font-display text-xl font-bold text-trust">
        {fotoUrl ? (
          <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" />
        ) : (
          usuario.nombreCompleto.split(" ").map((p) => p[0]).slice(0, 2).join("")
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={subiendo}
        title="Cambiar foto de perfil"
        className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-trust text-white shadow-sm hover:bg-trust/90 disabled:opacity-60"
      >
        {subiendo ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={elegirArchivo} />
      {error && <p className="absolute top-full mt-1 w-40 text-xs text-danger">{error}</p>}
    </div>
  );
}

const CAPAS = [
  { n: 1, nombre: "Estructura (cédula)" },
  { n: 2, nombre: "Correo verificado" },
  { n: 3, nombre: "Foto revisada" },
  { n: 4, nombre: "SENESCYT/SRI" },
];

/** B12 — cambiar contraseña estando ya logueado (distinto del flujo de recuperación sin sesión). */
function CambiarPasswordForm() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    setError("");
    setExito(false);
    setGuardando(true);
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      setPasswordActual("");
      setPasswordNueva("");
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="panel mt-6 space-y-4 p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <Lock className="size-4" /> Cambiar contraseña
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="passwordActual">Contraseña actual</Label>
          <Input id="passwordActual" type="password" required value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="passwordNueva">Contraseña nueva</Label>
          <Input id="passwordNueva" type="password" required minLength={8} value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)} />
        </div>
      </div>
      {error && <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>}
      {exito && <p className="flex items-center gap-1.5 text-sm text-verified"><CheckCircle2 className="size-4" /> Contraseña actualizada</p>}
      <Button type="submit" variant="outline" disabled={guardando}>
        {guardando ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        Cambiar contraseña
      </Button>
    </form>
  );
}

/** B12 — desactiva la cuenta (no la borra) y cierra la sesión de inmediato, igual que el veto. */
function EliminarCuentaSection({ onEliminada }) {
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  async function confirmar(e) {
    e.preventDefault();
    setError("");
    setEliminando(true);
    try {
      await eliminarCuenta(password);
      onEliminada();
    } catch (err) {
      setError(err.message);
      setEliminando(false);
    }
  }

  return (
    <div className="panel mt-6 border-danger/30 p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-danger">
        <ShieldAlert className="size-4" /> Eliminar cuenta
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Desactiva tu cuenta de inmediato — tu sesión se cierra al instante en todos tus dispositivos.
        Tu historial de solicitudes y reseñas se conserva, ya que otras personas dependen de él.
      </p>
      {!abierto ? (
        <Button variant="outline" className="mt-4 border-danger/30 text-danger hover:bg-danger/10" onClick={() => setAbierto(true)}>
          <Trash2 className="size-4" /> Eliminar mi cuenta
        </Button>
      ) : (
        <form onSubmit={confirmar} className="mt-4 space-y-3">
          <div>
            <Label htmlFor="passwordEliminar">Confirma tu contraseña para continuar</Label>
            <Input id="passwordEliminar" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>}
          <div className="flex gap-2">
            <Button type="submit" variant="danger" disabled={eliminando}>
              {eliminando ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Sí, eliminar mi cuenta
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setAbierto(false); setError(""); }}>
              <X className="size-4" /> Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

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
          <AvatarPerfil usuario={usuario} onActualizado={setUsuario} />
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

        <VerificacionAlumni />

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
          <Link to="/ayuda" className="panel panel-hover flex items-center gap-3 p-4">
            <HelpCircle className="size-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Centro de ayuda</p>
              <p className="text-xs text-muted-foreground">Preguntas frecuentes y reportes</p>
            </div>
          </Link>
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

        <CambiarPasswordForm />
        <EliminarCuentaSection onEliminada={salir} />

        <button onClick={salir} className="mt-6 text-sm text-muted-foreground hover:text-danger">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}