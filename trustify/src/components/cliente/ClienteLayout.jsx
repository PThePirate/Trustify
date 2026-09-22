import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home, Search, FileText, Bell, User, HelpCircle, LogOut, Menu, X, ShieldCheck,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";
import { logout, listarNotificaciones } from "@/services/authApi";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Inicio", icon: Home, end: true },
  { to: "/buscar", label: "Explorar negocios", icon: Search },
  { to: "/mis-solicitudes", label: "Mis solicitudes", icon: FileText },
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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(() => localStorage.getItem("checkbiz-cliente-sidebar-colapsado") === "true");
  const [noLeidas, setNoLeidas] = useState(0);

  useEffect(() => {
    localStorage.setItem("checkbiz-cliente-sidebar-colapsado", String(colapsado));
  }, [colapsado]);

  useEffect(() => {
    listarNotificaciones().then((d) => setNoLeidas(d.noLeidas)).catch(() => {});
  }, []);

  function salir() {
    logout();
    navigate("/login");
  }

  function itemClasses(isActive, compacto = false) {
    return cn(
      "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
      compacto ? "justify-center px-2" : "gap-2.5 px-3",
      isActive ? "bg-trust/10 text-trust" : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
    );
  }

  function renderNav(onClick, compacto = false) {
    return (
      <>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClick} title={compacto ? item.label : undefined} className={({ isActive }) => itemClasses(isActive, compacto)}>
            <item.icon className="size-[18px]" />
            {!compacto && <span className="flex-1">{item.label}</span>}
            {!compacto && item.badge === "noLeidas" && noLeidas > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
                {noLeidas > 9 ? "9+" : noLeidas}
              </span>
            )}
          </NavLink>
        ))}
        <div className="my-2 border-t border-border" />
        {NAV_EXTERNAS.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClick} title={compacto ? item.label : undefined} className={({ isActive }) => itemClasses(isActive, compacto)}>
            <item.icon className="size-[18px]" />
            {!compacto && <span className="flex-1">{item.label}</span>}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-card transition-[width] duration-200 lg:flex",
        colapsado ? "w-20" : "w-64"
      )}>
        <div className={cn("flex h-16 items-center border-b border-border", colapsado ? "justify-center px-2" : "px-6")}>
          <Logo showText={!colapsado} />
        </div>

        <div className={cn("py-3", colapsado ? "flex justify-center px-2" : "px-4")}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-trust/25 bg-trust/10 px-2.5 py-1 text-[11px] font-semibold text-trust">
            <ShieldCheck className="size-3.5 shrink-0" /> {!colapsado && "Panel del cliente"}
          </span>
        </div>

        <nav className={cn("flex-1 space-y-1 py-2", colapsado ? "px-2" : "px-3")}>{renderNav(undefined, colapsado)}</nav>

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
          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      {menuAbierto && (
        <nav className="fixed inset-x-0 top-16 z-20 space-y-1 border-b border-border bg-card p-3 shadow-lg lg:hidden">
          {renderNav(() => setMenuAbierto(false))}
          <div className="mt-2 border-t border-border pt-2">
            <button onClick={salir} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10">
              <LogOut className="size-[18px]" /> Cerrar sesión
            </button>
          </div>
        </nav>
      )}

      <div className={cn("hidden justify-end gap-2 border-b border-border bg-card px-8 py-3 lg:flex", colapsado ? "lg:ml-20" : "lg:ml-64")}>
        <NotificationBell />
        <ThemeToggle />
      </div>

      <main className={cn("px-4 py-6 transition-[margin] duration-200 lg:px-8 lg:py-8", colapsado ? "lg:ml-20" : "lg:ml-64")}>
        <Outlet context={{ dentroClienteShell: true }} />
      </main>
    </div>
  );
}
