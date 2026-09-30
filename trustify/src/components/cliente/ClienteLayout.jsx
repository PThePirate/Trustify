import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home, Search, MessageCircle, Bell, User, HelpCircle, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, Sparkles, ArrowUpRight, Bookmark, Award, UserRoundCheck, CalendarDays, ShieldAlert,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import PanelModeSwitcher from "@/components/shared/PanelModeSwitcher";
import { logout, listarNotificaciones, obtenerPerfil, leerPerfilSesion } from "@/services/authApi";
import { imagenPerfilPublico } from "@/services/perfilPublicoApi";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Inicio", icon: Home, end: true },
  { to: "/buscar", label: "Explorar negocios", icon: Search },
  { to: "/mis-solicitudes", label: "Mensajes", icon: MessageCircle },
  { to: "/mi-red", label: "Mi red de confianza", icon: Bookmark },
  { to: "/historial", label: "Historial y reseñas", icon: Award },
  { to: "/comprador-verificado", label: "Comprador verificado", icon: UserRoundCheck },
  { to: "/recordatorios", label: "Recordatorios", icon: CalendarDays },
  { to: "/seguridad", label: "Centro de seguridad", icon: ShieldAlert },
  { to: "/notificaciones", label: "Notificaciones", icon: Bell, badge: "noLeidas" },
  { to: "/perfil", label: "Mi cuenta", icon: User },
];

// Estas dos salen del panel hacia una pantalla pública aparte — por eso
// llevan el ícono de "abrir en otra pantalla", igual que "Ver sitio
// público" en el panel del emprendedor.
const NAV_EXTERNAS = [
  { to: "/ayuda", label: "Ayuda", icon: HelpCircle },
];

export default function ClienteLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const seccion = [...NAV, ...NAV_EXTERNAS].find(item => pathname === item.to || pathname.startsWith(item.to + '/'))?.label || 'Mi panel';
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(() => localStorage.getItem("checkbiz-cliente-sidebar-colapsado") === "true");
  const [noLeidas, setNoLeidas] = useState(0);
  const [usuario, setUsuario] = useState(leerPerfilSesion);
  const fotoUrl = usuario?.id && usuario?.fotoPerfilUrl ? `${imagenPerfilPublico(usuario.id, "foto")}?v=${encodeURIComponent(usuario.fotoPerfilUrl)}` : null;

  useEffect(() => {
    let activo = true;
    obtenerPerfil().then((perfil) => { if (activo) setUsuario(perfil); }).catch(() => {});
    const actualizar = () => setUsuario(leerPerfilSesion());
    window.addEventListener("checkbiz:perfil-actualizado", actualizar);
    return () => { activo = false; window.removeEventListener("checkbiz:perfil-actualizado", actualizar); };
  }, []);

  useEffect(() => {
    localStorage.setItem("checkbiz-cliente-sidebar-colapsado", String(colapsado));
  }, [colapsado]);

  useEffect(() => {
    const cargar = () => listarNotificaciones().then((d) => setNoLeidas(d.noLeidas)).catch(() => {});
    cargar();
    const intervalo = setInterval(cargar, 6000);
    window.addEventListener("checkbiz:notificaciones-actualizadas", cargar);
    return () => { clearInterval(intervalo); window.removeEventListener("checkbiz:notificaciones-actualizadas", cargar); };
  }, []);

  function salir() {
    logout();
    navigate("/login");
  }

  function itemClasses(isActive, compacto = false) {
    return cn(
      "flex min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      compacto ? "sidebar-link-compact" : "",
      isActive ? "bg-trust/10 text-trust" : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
    );
  }

  function renderNav(onClick, compacto = false) {
    return (
      <>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClick} title={compacto ? item.label : undefined} className={({ isActive }) => itemClasses(isActive, compacto)}>
            <item.icon className="size-[18px] shrink-0" />
            <span className={cn("min-w-0 flex-1 whitespace-nowrap leading-snug", compacto && "sidebar-label")}>{item.label}</span>
            {item.badge === "noLeidas" && noLeidas > 0 && (
              <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white">
                {noLeidas > 99 ? "99+" : noLeidas}
              </span>
            )}
          </NavLink>
        ))}
        <div className="my-2 border-t border-border" />
        {NAV_EXTERNAS.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClick} title={compacto ? item.label : undefined} className={({ isActive }) => itemClasses(isActive, compacto)}>
            <item.icon className="size-[18px] shrink-0" />
            <span className={cn("flex-1 whitespace-nowrap", compacto && "sidebar-label")}>{item.label}</span>
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="client-ui min-h-screen bg-background">
      <aside className={cn(
        "client-sidebar",
        "fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-300 ease-in-out lg:flex",
        colapsado && "is-collapsed",
        colapsado ? "w-20" : "w-72"
      )}>
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-[18px]">
          <Logo showText={false} />
          <span className="sidebar-label whitespace-nowrap font-display text-lg font-semibold">CheckBiz</span>
        </div>

        <div className="client-sidebar-profile shrink-0 px-3 pb-3 pt-4">
          <NavLink to="/perfil" title={colapsado ? "Mi perfil" : undefined} className="flex min-w-0 items-center gap-3 rounded-2xl border border-trust/15 bg-trust/5 p-2.5 hover:bg-trust/10">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-trust/15 font-display text-sm font-bold text-trust">
              {fotoUrl ? <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" /> : usuario?.nombreCompleto ? usuario.nombreCompleto.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase() : <User className="size-5" />}
            </span>
            <span className="sidebar-label min-w-0 flex-1"><strong className="block truncate text-sm">{usuario?.nombreUsuario ? usuario.nombreUsuario : usuario?.nombreCompleto || "Mi perfil"}</strong><span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-trust"><span className="size-2 shrink-0 rounded-full bg-verified" /> {usuario?.estadoPerfil || "Cliente"}</span></span>
          </NavLink>
          <div className="mt-3"><PanelModeSwitcher usuario={usuario} actual="cliente" compacto={colapsado} /></div>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 py-2">{renderNav(undefined, true)}</nav>

        {!colapsado && <div className="client-sidebar-note mx-3 mb-3"><Sparkles className="size-5" /><p className="mt-3 font-display text-sm font-bold">¿Tienes una idea en mente?</p><p className="mt-1 text-xs leading-relaxed">Encuentra a la persona indicada para hacerla realidad.</p><NavLink to="/buscar" className="mt-3 inline-flex items-center gap-1 text-xs font-bold">Explorar negocios <ArrowUpRight className="size-3.5" /></NavLink></div>}

        <div className="space-y-1 border-t border-border p-3">
          <button
            type="button"
            onClick={() => setColapsado((v) => !v)}
            title={colapsado ? "Expandir menú" : "Contraer menú"}
            aria-label={colapsado ? "Expandir menú" : "Contraer menú"}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {colapsado ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            <span className="sidebar-label whitespace-nowrap">{colapsado ? "Expandir menú" : "Contraer menú"}</span>
          </button>
          <button
            onClick={salir}
            title={colapsado ? "Cerrar sesión" : undefined}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <LogOut className="size-[18px] shrink-0" /> <span className="sidebar-label whitespace-nowrap">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="grid size-9 place-items-center rounded-lg text-foreground/80 hover:bg-muted/60"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Logo />
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      {menuAbierto && (
        <nav className="fixed inset-x-0 top-16 z-20 max-h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto border-b border-border bg-card p-3 shadow-lg lg:hidden">
          <NavLink to="/perfil" onClick={() => setMenuAbierto(false)} className="mb-3 flex items-center gap-3 rounded-xl border border-trust/15 bg-trust/5 p-2.5">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-trust/15 font-display text-sm font-bold text-trust">{fotoUrl ? <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" /> : usuario?.nombreCompleto ? usuario.nombreCompleto.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase() : <User className="size-5" />}</span>
            <span className="min-w-0"><strong className="block truncate text-sm">{usuario?.nombreUsuario ? usuario.nombreUsuario : usuario?.nombreCompleto || "Mi perfil"}</strong><span className="block truncate text-xs text-trust">{usuario?.estadoPerfil || "Cliente"}</span></span>
          </NavLink>
          <PanelModeSwitcher usuario={usuario} actual="cliente" onNavigate={() => setMenuAbierto(false)} />
          {renderNav(() => setMenuAbierto(false))}
          <div className="mt-2 border-t border-border pt-2">
            <button onClick={salir} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10">
              <LogOut className="size-[18px]" /> Cerrar sesión
            </button>
          </div>
        </nav>
      )}

      <div className={cn("client-topbar relative z-50 hidden items-center gap-2 border-b border-border bg-card px-8 py-3 transition-[margin] duration-300 ease-in-out lg:flex", colapsado ? "lg:ml-20" : "lg:ml-72")}>
        <div className="mr-auto flex items-center gap-3 text-sm"><span className="text-muted-foreground">Mi espacio</span><span aria-hidden="true" className="text-border">/</span><span className="font-semibold">{seccion}</span></div>
        <NotificationBell />
        <ThemeToggle />
      </div>

      <main className={cn("client-main px-4 py-6 transition-[margin] duration-300 ease-in-out lg:px-8 lg:py-8", colapsado ? "lg:ml-20" : "lg:ml-72")}>
        <Outlet context={{ dentroClienteShell: true }} />
      </main>
    </div>
  );
}
