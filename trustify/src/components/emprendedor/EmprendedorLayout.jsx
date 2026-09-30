import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Store, Package, MessageCircle, Star, LogOut, QrCode, TrendingUp, LineChart, Menu, X, CreditCard, HelpCircle, PanelLeftClose, PanelLeftOpen, LayoutDashboard, User, Bell } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import PanelModeSwitcher from "@/components/shared/PanelModeSwitcher";
import { imagenPerfilPublico } from "@/services/perfilPublicoApi";
import { listarNotificaciones } from "@/services/authApi";
import { logout, obtenerPerfil, leerPerfilSesion } from "@/services/authApi";
import { cn } from "@/lib/utils";
import "@/business.css";
import BusinessSectionScene from "./BusinessSectionScene";

const NAV = [
  { to: "/negocio", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/negocio/editar", label: "Mi Mini Landing", icon: Store },
  { to: "/negocio/catalogo", label: "Catálogo", icon: Package },
  { to: "/negocio/solicitudes", label: "Mensajes", icon: MessageCircle },
  { to: "/negocio/notificaciones", label: "Notificaciones", icon: Bell },
  { to: "/negocio/reputacion", label: "Reputación", icon: Star },
  { to: "/negocio/analitica", label: "Analítica", icon: LineChart },
  { to: "/negocio/formalizacion", label: "Formalización", icon: TrendingUp },
  { to: "/negocio/qr", label: "QR de verificación", icon: QrCode },
  { to: "/negocio/planes", label: "Suscripción y planes", icon: CreditCard },
  { to: "/negocio/perfil", label: "Mi perfil", icon: User },
];

const NAV_FINAL = [
  { to: "/negocio/ayuda", label: "Ayuda", icon: HelpCircle },
];

export default function EmprendedorLayout() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(() => localStorage.getItem("checkbiz-emprendedor-sidebar-colapsado") === "true");
  const [usuario, setUsuario] = useState(leerPerfilSesion);
  const fotoUrl = usuario?.id && usuario?.fotoPerfilUrl ? `${imagenPerfilPublico(usuario.id, "foto")}?v=${encodeURIComponent(usuario.fotoPerfilUrl)}` : null;
  const [noLeidas, setNoLeidas] = useState(0);
  useEffect(() => {
    obtenerPerfil().then(setUsuario).catch(() => {});
    const actualizar = () => setUsuario(leerPerfilSesion());
    window.addEventListener("checkbiz:perfil-actualizado", actualizar);
    return () => window.removeEventListener("checkbiz:perfil-actualizado", actualizar);
  }, []);
  useEffect(() => {
    localStorage.setItem("checkbiz-emprendedor-sidebar-colapsado", String(colapsado));
  }, [colapsado]);

  useEffect(() => {
    const cargar = () => listarNotificaciones().then(datos => setNoLeidas(datos.noLeidas)).catch(() => {});
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
      "flex items-center overflow-hidden whitespace-nowrap rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
      compacto ? "justify-center px-2" : "gap-2.5 px-3",
      isActive ? "bg-trust/10 text-trust shadow-sm" : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
    );
  }

  function renderNav(onClick, compacto = false) {
    return (
      <>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClick}
            title={compacto ? item.label : undefined}
            className={({ isActive }) => itemClasses(isActive, compacto)}
          >
            <item.icon className="size-[18px] shrink-0" />
            {!compacto && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            {item.icon === Bell && noLeidas > 0 && <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white">{noLeidas > 99 ? "99+" : noLeidas}</span>}
          </NavLink>
        ))}
        <div className="my-2 border-t border-border" />
        {NAV_FINAL.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClick}
            title={compacto ? item.label : undefined}
            className={({ isActive }) => itemClasses(isActive, compacto)}
          >
            <item.icon className="size-[18px] shrink-0" />
            {!compacto && item.label}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="business-shell min-h-screen bg-background">
      <aside className={cn(
        "business-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-300 ease-in-out lg:flex",
        colapsado ? "w-20" : "w-64"
      )}>
        <div className={cn("flex h-16 items-center border-b border-border", colapsado ? "justify-center px-2" : "px-6")}>
          <Logo showText={!colapsado} />
        </div>

        <NavLink to="/negocio/perfil" title="Mi perfil" className={cn("mx-3 mt-4 flex min-w-0 items-center gap-2.5 rounded-xl border border-trust/20 bg-trust/5 p-2.5 hover:bg-trust/10", colapsado && "justify-center")}>
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-trust/15 font-bold text-trust">{fotoUrl ? <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" /> : usuario?.nombreCompleto?.slice(0, 2).toUpperCase() || <User className="size-5" />}</span>
          {!colapsado && <span className="min-w-0"><strong className="block truncate text-sm">{usuario?.nombreUsuario ? usuario.nombreUsuario : usuario?.nombreCompleto || "Mi perfil"}</strong><small className="block truncate text-trust">{usuario?.estadoPerfil || "Emprendedor"}</small></span>}
        </NavLink>
        <div className="mx-3 mt-3"><PanelModeSwitcher usuario={usuario} actual="emprendedor" compacto={colapsado} /></div>
        <div className={cn("py-3", colapsado ? "flex justify-center px-2" : "px-4")}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-verified/25 bg-verified/10 px-2.5 py-1 text-[11px] font-semibold text-verified">
            <Store className="size-3.5 shrink-0" /> {!colapsado && "Panel de negocio"}
          </span>
        </div>

        {!colapsado && <div className="mx-3 mb-3 rounded-2xl border border-trust/20 bg-gradient-to-br from-trust/15 to-verified/10 p-3"><p className="text-sm font-bold">Haz visible tu trabajo</p><p className="mt-1 text-xs text-muted-foreground">Publica, responde y crece con confianza.</p></div>}

        <nav className={cn("min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-2", colapsado ? "px-2" : "px-3")}>{renderNav(undefined, colapsado)}</nav>

        <div className={cn("space-y-1 border-t border-border", colapsado ? "p-2" : "p-3")}>
          <button
            type="button"
            onClick={() => setColapsado((v) => !v)}
            title={colapsado ? "Expandir menú" : "Contraer menú"}
            aria-label={colapsado ? "Expandir menú" : "Contraer menú"}
            className={cn("flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground", colapsado ? "justify-center px-2" : "gap-2.5 px-3")}
          >
            {colapsado ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            {!colapsado && "Contraer menú"}
          </button>
          <button
            onClick={salir}
            title={colapsado ? "Cerrar sesión" : undefined}
            className={cn("flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-danger hover:bg-danger/10", colapsado ? "justify-center px-2" : "gap-2.5 px-3")}
          >
            <LogOut className="size-[18px]" /> {!colapsado && "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="grid size-9 place-items-center rounded-lg text-foreground/80 hover:bg-muted/60"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Logo />
        <div className="flex items-center gap-2">
          <NotificationBell to="/negocio/notificaciones" />
          <ThemeToggle />
          <button onClick={salir} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </header>

      {menuAbierto && (
        <nav className="fixed inset-x-0 top-16 z-20 space-y-1 border-b border-border bg-card p-3 shadow-lg lg:hidden">
          <PanelModeSwitcher usuario={usuario} actual="emprendedor" onNavigate={() => setMenuAbierto(false)} />
          {renderNav(() => setMenuAbierto(false))}
          <div className="mt-2 border-t border-border pt-2">
            <button onClick={salir} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10">
              <LogOut className="size-[18px]" /> Cerrar sesión
            </button>
          </div>
        </nav>
      )}

      <div className={cn("hidden items-center justify-end gap-2 border-b border-border bg-card px-8 py-3 transition-[margin] duration-300 ease-in-out lg:flex", colapsado ? "lg:ml-20" : "lg:ml-64")}>
        <NotificationBell to="/negocio/notificaciones" />
        <ThemeToggle />
      </div>

      <main className={cn("relative min-w-0 px-4 py-6 transition-[margin] duration-300 ease-in-out lg:px-8 lg:py-8", colapsado ? "lg:ml-20" : "lg:ml-64")}>
        <div className="business-ambient" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <div className="relative z-[1]"><BusinessSectionScene /><Outlet /></div>
      </main>
    </div>
  );
}
