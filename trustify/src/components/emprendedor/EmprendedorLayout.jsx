import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Store, Package, MessageCircle, Star, LogOut, QrCode, TrendingUp, LineChart, Menu, X, CreditCard, HelpCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { logout } from "@/services/authApi";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/negocio", label: "Mi Mini Landing", icon: Store, end: true },
  { to: "/negocio/catalogo", label: "Catálogo", icon: Package },
  { to: "/negocio/solicitudes", label: "Mensajes", icon: MessageCircle },
  { to: "/negocio/reputacion", label: "Reputación", icon: Star },
  { to: "/negocio/analitica", label: "Analítica", icon: LineChart },
  { to: "/negocio/formalizacion", label: "Formalización", icon: TrendingUp },
  { to: "/negocio/qr", label: "QR de verificación", icon: QrCode },
  { to: "/negocio/planes", label: "Suscripción y planes", icon: CreditCard },
];

const NAV_FINAL = [
  { to: "/ayuda", label: "Ayuda", icon: HelpCircle },
];

export default function EmprendedorLayout() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(() => localStorage.getItem("checkbiz-emprendedor-sidebar-colapsado") === "true");

  useEffect(() => {
    localStorage.setItem("checkbiz-emprendedor-sidebar-colapsado", String(colapsado));
  }, [colapsado]);

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
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClick}
            title={compacto ? item.label : undefined}
            className={({ isActive }) => itemClasses(isActive, compacto)}
          >
            <item.icon className="size-[18px]" />
            {!compacto && item.label}
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
            <item.icon className="size-[18px]" />
            {!compacto && item.label}
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-verified/25 bg-verified/10 px-2.5 py-1 text-[11px] font-semibold text-verified">
            <Store className="size-3.5 shrink-0" /> {!colapsado && "Panel de negocio"}
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
          <ThemeToggle />
          <button onClick={salir} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
            <LogOut className="size-[18px]" />
          </button>
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

      <div className="hidden justify-end border-b border-border bg-card px-8 py-3 lg:flex lg:ml-64">
        <ThemeToggle />
      </div>

      <main className={cn("px-4 py-6 transition-[margin] duration-200 lg:px-8 lg:py-8", colapsado ? "lg:ml-20" : "lg:ml-64")}>
        <Outlet />
      </main>
    </div>
  );
}
