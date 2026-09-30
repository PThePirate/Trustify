import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Contact, Phone, ShieldCheck, CheckCircle2, XCircle,
  FileText, Store, Loader2, AlertCircle, Save, Camera, HelpCircle, GraduationCap, Clock,
  Lock, ShieldAlert, Trash2, X, Heart, Bookmark, ImagePlus, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  obtenerPerfil, leerPerfilSesion, actualizarPerfil, logout,
  cambiarPassword, eliminarCuenta,
} from "@/services/authApi";
import { imagenPerfilPublico } from "@/services/perfilPublicoApi";
import { buscarNegocios } from "@/services/negocioApi";
import { leerEspacio } from "@/services/clienteEspacioLocal";
import {
  listarUniversidades, solicitarVerificacionAlumni, misVerificacionesAlumni,
} from "@/services/alumniApi";
import AvatarEditor from "@/components/cliente/AvatarEditor";
import BannerEditor from "@/components/cliente/BannerEditor";

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
  const fotoUrl = usuario?.id && usuario?.fotoPerfilUrl ? `${imagenPerfilPublico(usuario.id, "foto")}?v=${encodeURIComponent(usuario.fotoPerfilUrl)}` : null;
  const [editorAbierto, setEditorAbierto] = useState(false);

  return (
    <div className="relative shrink-0">
      <div className="grid size-24 place-items-center overflow-hidden rounded-3xl border-4 border-card bg-trust/10 font-display text-2xl font-bold text-trust shadow-lg">
        {fotoUrl ? (
          <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" />
        ) : (
          usuario.nombreCompleto.split(" ").map((p) => p[0]).slice(0, 2).join("")
        )}
      </div>
      <button
        type="button"
        onClick={() => setEditorAbierto(true)}
        title="Cambiar foto de perfil"
        className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-trust text-white shadow-sm hover:bg-trust/90"
      >
        <Camera className="size-4" />
      </button>
      {editorAbierto && <AvatarEditor onClose={() => setEditorAbierto(false)} onActualizado={onActualizado} />}
    </div>
  );
}

const CAPAS = [
  { n: 1, nombre: "Estructura (cédula)" },
  { n: 2, nombre: "Correo verificado" },
  { n: 3, nombre: "Cédula revisada" },
  { n: 4, nombre: "Biometría facial (pendiente)" },
  { n: 5, nombre: "SENESCYT/SRI (pendiente)" },
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

/** Elimina la identidad de acceso y conserva el historial compartido anonimizado. */
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
        Tu cuenta se elimina de inmediato y se cierran tus sesiones en todos los dispositivos.
        Tus solicitudes, reseñas y conversaciones se conservan sin tus datos personales, ya que otras personas dependen de ellas.
        Si tienes un negocio, dejará de estar publicado.
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

export default function PerfilPage({ contexto = "cliente" }) {
  const [usuario, setUsuario] = useState(leerPerfilSesion);
  const [form, setForm] = useState(() => { const u = leerPerfilSesion(); return { nombreCompleto: u?.nombreCompleto || "", telefono: u?.telefono || "", nombreUsuario: u?.nombreUsuario || "", descripcionPerfil: u?.descripcionPerfil || "", estadoPerfil: u?.estadoPerfil || "" }; });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const bannerUrl = usuario?.id && usuario?.bannerPerfilUrl ? `${imagenPerfilPublico(usuario.id, "banner")}?v=${encodeURIComponent(usuario.bannerPerfilUrl)}` : null;
  const [editandoBanner, setEditandoBanner] = useState(false);
  const [negociosDisponibles, setNegociosDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    buscarNegocios({}).then(setNegociosDisponibles).catch(() => setNegociosDisponibles([]));
    obtenerPerfil()
      .then((u) => {
        setUsuario(u);
        setForm({ nombreCompleto: u.nombreCompleto, telefono: u.telefono, nombreUsuario: u.nombreUsuario || "", descripcionPerfil: u.descripcionPerfil || "", estadoPerfil: u.estadoPerfil || "", negocioFavoritoSlug: u.negocioFavoritoSlug || "", negociosGuardadosSlugs: u.negociosGuardadosSlugs || [] });
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
    navigate("/login");
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
    return false; // Las capas biométrica y de bases externas siguen pendientes.
  };
  const slugsGuardados = [...new Set([...leerEspacio().guardados.map(g => g.slug), ...(form.negociosGuardadosSlugs || []), form.negocioFavoritoSlug].filter(Boolean))];
  const candidatos = negociosDisponibles.filter(n => slugsGuardados.includes(n.slug));

  return (
    <div className="client-profile mx-auto max-w-5xl">
        <div className="client-profile-cover mb-6 flex items-end gap-4 pt-20 sm:pt-24">
          {bannerUrl && <img className="client-profile-banner-image" src={bannerUrl} alt="Tu banner de perfil" />}
          <button type="button" className="client-profile-banner-edit" onClick={() => setEditandoBanner(true)}><ImagePlus size={17} /> Editar banner</button>
          {editandoBanner && <BannerEditor bannerUrl={bannerUrl} onClose={() => setEditandoBanner(false)} onActualizado={setUsuario} />}
          <AvatarPerfil usuario={usuario} onActualizado={setUsuario} />
          <div className="min-w-0 pb-1">
            <h1 className="truncate font-display text-2xl font-bold">{form.nombreUsuario || usuario.nombreCompleto}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {usuario.rolCliente && <Badge variant="trust">Cliente</Badge>}
              {usuario.rolEmprendedor && <Badge variant="verified">Emprendedor</Badge>}
            </div>
          </div>
        </div>

        <div className="client-profile-intro panel mb-6 p-5"><div className="flex flex-wrap items-center gap-2"><span className="client-profile-status-dot" /><strong>{form.estadoPerfil || "Disponible para conectar"}</strong></div><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{form.descripcionPerfil || "Añade una descripción para contar un poco sobre ti."}</p><div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-trust"><span className="flex items-center gap-2"><Sparkles size={15} /> Así se presenta tu perfil a otros usuarios al pulsar tu foto en una reseña.</span>{usuario.id && <Link to={`/usuarios/${usuario.id}`} state={{ volverA: contexto === "negocio" ? "/negocio/perfil" : "/perfil" }} className="font-bold underline">Ver mi perfil público ↗</Link>}</div></div>

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
          <p className="mt-3 text-xs text-muted-foreground">
            La capa SENESCYT/SRI está simulada en este piloto — todavía no consulta esas bases públicas reales.
          </p>
        </div>

        <VerificacionAlumni />

        {/* Accesos rápidos */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Link to={contexto === "negocio" ? "/negocio/solicitudes" : "/mis-solicitudes"} className="panel panel-hover flex items-center gap-3 p-4">
            <FileText className="size-5 text-trust" />
            <div>
              <p className="font-medium">{contexto === "negocio" ? "Mensajes del negocio" : "Mis solicitudes"}</p>
              <p className="text-xs text-muted-foreground">{contexto === "negocio" ? "Responder a clientes" : "Ver, confirmar y reseñar"}</p>
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
          <h2 className="font-display text-base font-bold">Editar mi perfil</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="nombreUsuario">Nombre de usuario</Label><Input id="nombreUsuario" maxLength={24} value={form.nombreUsuario} onChange={e => setForm(f => ({ ...f, nombreUsuario: e.target.value.replace(/[^A-Za-z0-9_./,]/g, "") }))} placeholder="Tu.Nombre" /><p className="mt-1 text-xs text-muted-foreground">De 3 a 24 caracteres. Letras mayúsculas y minúsculas, números, _, /, . y ,.</p></div>
            <div><Label htmlFor="estadoPerfil">Estado</Label><Input id="estadoPerfil" maxLength={80} value={form.estadoPerfil} onChange={e => setForm(f => ({ ...f, estadoPerfil: e.target.value }))} placeholder="Disponible para nuevas ideas" /><p className="mt-1 text-xs text-muted-foreground">Una frase breve que aparecerá en tu perfil.</p></div>
          </div>
          <div><Label htmlFor="descripcionPerfil">Sobre mí</Label><textarea id="descripcionPerfil" className="client-profile-description" maxLength={300} value={form.descripcionPerfil} onChange={e => setForm(f => ({ ...f, descripcionPerfil: e.target.value }))} placeholder="Cuéntanos quién eres y qué te interesa…" rows={5} /><p className="mt-1 text-right text-xs text-muted-foreground">{form.descripcionPerfil.length}/300</p></div>

          <div className="client-profile-collection">
            <div><h3 className="flex items-center gap-2 font-display font-bold"><Heart size={18} /> Mi red visible</h3><p className="mt-1 text-sm text-muted-foreground">Elige un negocio favorito y hasta cinco guardados para mostrar en tu perfil público.</p></div>
            {candidatos.length ? <div className="client-profile-picks">{candidatos.map(negocio => {
              const elegido = (form.negociosGuardadosSlugs || []).includes(negocio.slug);
              return <div key={negocio.slug} className="client-profile-pick"><span className="min-w-0 flex-1 truncate font-medium">{negocio.nombreComercial}</span><button type="button" className={form.negocioFavoritoSlug === negocio.slug ? "selected" : ""} onClick={() => setForm(f => ({ ...f, negocioFavoritoSlug: f.negocioFavoritoSlug === negocio.slug ? "" : negocio.slug }))} aria-label={`Marcar ${negocio.nombreComercial} como favorito`} aria-pressed={form.negocioFavoritoSlug === negocio.slug}><Heart size={16} /> Favorito</button><button type="button" className={elegido ? "selected" : ""} onClick={() => setForm(f => ({ ...f, negociosGuardadosSlugs: elegido ? f.negociosGuardadosSlugs.filter(slug => slug !== negocio.slug) : f.negociosGuardadosSlugs.length < 5 ? [...f.negociosGuardadosSlugs, negocio.slug] : f.negociosGuardadosSlugs }))} aria-label={`${elegido ? "Quitar" : "Mostrar"} ${negocio.nombreComercial} en guardados`} aria-pressed={elegido}><Bookmark size={16} /> {elegido ? "Visible" : "Mostrar"}</button></div>;
            })}</div> : <p className="text-sm text-muted-foreground">Guarda negocios desde Explorar para elegirlos aquí. <Link to="/buscar" className="text-trust underline">Explorar negocios</Link></p>}
            <span className="text-xs text-muted-foreground">{(form.negociosGuardadosSlugs || []).length}/5 guardados visibles</span>
          </div>

          <h3 className="border-t border-border pt-4 font-display font-bold">Datos de identidad</h3>

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
  );
}
