import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Store, Package, Inbox, Star, LogOut, ExternalLink } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { logout } from "@/services/authApi";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/negocio", label: "Mi Mini Landing", icon: Store, end: true },
  { to: "/negocio/catalogo", label: "Catálogo", icon: Package },
  { to: "/negocio/solicitudes", label: "Solicitudes", icon: Inbox },
  { to: "/negocio/reputacion", label: "Reputación", icon: Star },
];

export default function EmprendedorLayout() {
  const navigate = useNavigate();

  function salir() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Logo />
        </div>

        <div className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-verified/25 bg-verified/10 px-2.5 py-1 text-[11px] font-semibold text-verified">
            <Store className="size-3.5" /> Panel de negocio
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-trust/10 text-trust" : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <button
            onClick={() => window.open("/", "_blank")}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted/60"
          >
            <ExternalLink className="size-[18px]" /> Ver sitio público
          </button>
          <button
            onClick={salir}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <LogOut className="size-[18px]" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={salir} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </header>

      <div className="hidden justify-end border-b border-border bg-card px-8 py-3 lg:flex lg:ml-64">
        <ThemeToggle />
      </div>

      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}