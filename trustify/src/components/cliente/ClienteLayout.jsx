import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home, Search, MessageCircle, Bell, User, HelpCircle, LogOut, ExternalLink, Menu, X, ShieldCheck,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { logout, listarNotificaciones } from "@/services/authApi";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Inicio", icon: Home, end: true },
  { to: "/mis-solicitudes", label: "Mensajes", icon: MessageCircle },
  { to: "/notificaciones", label: "Notificaciones", icon: Bell, badge: "noLeidas" },
  { to: "/perfil", label: "Mi cuenta", icon: User },
];

// Estas dos salen del panel hacia una pantalla pública aparte — por eso
// llevan el ícono de "abrir en otra pantalla", igual que "Ver sitio
// público" en el panel del emprendedor.
const NAV_EXTERNAS = [
  { to: "/buscar", label: "Explorar negocios", icon: Search },
  { to: "/ayuda", label: "Ayuda", icon: HelpCircle },
];

export default function ClienteLayout() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);

  useEffect(() => {
    listarNotificaciones().then((d) => setNoLeidas(d.noLeidas)).catch(() => {});
  }, []);

  function salir() {
    logout();
    navigate("/login");
  }

  function itemClasses(isActive) {
    return cn(
      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      isActive ? "bg-trust/10 text-trust" : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
    );
  }

  function renderNav(onClick) {
    return (
      <>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClick} className={({ isActive }) => itemClasses(isActive)}>
            <item.icon className="size-[18px]" />
            <span className="flex-1">{item.label}</span>
            {item.badge === "noLeidas" && noLeidas > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
                {noLeidas > 9 ? "9+" : noLeidas}
              </span>
            )}
          </NavLink>
        ))}
        <div className="my-2 border-t border-border" />
        {NAV_EXTERNAS.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClick} className={({ isActive }) => itemClasses(isActive)}>
            <item.icon className="size-[18px]" />
            <span className="flex-1">{item.label}</span>
            <ExternalLink className="size-3.5 text-muted-foreground" />
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Logo />
        </div>

        <div className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-trust/25 bg-trust/10 px-2.5 py-1 text-[11px] font-semibold text-trust">
            <ShieldCheck className="size-3.5" /> Panel del cliente
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">{renderNav()}</nav>

        <div className="border-t border-border p-3">
          <button
            onClick={salir}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <LogOut className="size-[18px]" /> Cerrar sesión
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
          <ThemeToggle />
          <button onClick={salir} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </header>

      {menuAbierto && (
        <nav className="fixed inset-x-0 top-16 z-20 space-y-1 border-b border-border bg-card p-3 shadow-lg lg:hidden">
          {renderNav(() => setMenuAbierto(false))}
        </nav>
      )}

      <div className="hidden justify-end border-b border-border bg-card px-8 py-3 lg:flex lg:ml-64">
        <ThemeToggle />
      </div>

      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}