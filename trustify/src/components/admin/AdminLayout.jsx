import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShieldCheck, Ban, Flag, Tags, ScrollText, LogOut, ShieldAlert, CreditCard, Award, Fingerprint, Sparkles, ScanLine, LockKeyhole,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import GlobalSearch from "@/components/admin/GlobalSearch";
import { adminLogout } from "@/services/adminApi";
import { cn } from "@/lib/utils";
import "./adminDecoration.css";
import PanelMobileNav from "@/components/layout/PanelMobileNav";

const SECCIONES = [
  {
    titulo: "General",
    items: [{ to: "/admin", label: "Panel general", icon: LayoutDashboard, end: true }],
  },
  {
    titulo: "Confianza e identidad",
    items: [
      { to: "/admin/kyc", label: "Verificación KYC", icon: ShieldCheck },
      { to: "/admin/denuncias", label: "Denuncias", icon: Flag },
      { to: "/admin/veto", label: "Veto por cédula", icon: Ban },
    ],
  },
  {
    titulo: "Catálogo",
    items: [{ to: "/admin/categorias", label: "Categorías", icon: Tags }],
  },
  {
    titulo: "Negocio",
    items: [
      { to: "/admin/suscripciones", label: "Suscripciones y B2B", icon: CreditCard },
      { to: "/admin/insignias", label: "Insignias co-branded", icon: Award },
    ],
  },
  {
    titulo: "Sistema",
    items: [{ to: "/admin/auditoria", label: "Logs de auditoría", icon: ScrollText }],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function salir() {
    adminLogout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-experience min-h-screen bg-background">
      <div className="admin-atmosphere" aria-hidden="true"><span /><span /><svg viewBox="0 0 1200 800" preserveAspectRatio="none"><path d="M-20 650 C200 650 150 100 550 150 S950 700 1220 350" /><path className="admin-signal" d="M-20 650 C200 650 150 100 550 150 S950 700 1220 350" /></svg>{Array.from({length:16},(_,i)=><i key={i} style={{left:`${(i*31+4)%96}%`,top:`${(i*19+8)%94}%`,animationDelay:`-${i*.8}s`}} />)}</div>
      {/* Sidebar */}
      <div className="admin-decoration-shapes" aria-hidden="true"><span className="admin-shape-ring" /><span className="admin-shape-ring admin-shape-ring-two" /><span className="admin-shape-grid" /><span className="admin-shape-prism" /><span className="admin-shape-prism admin-shape-prism-two" /><svg viewBox="0 0 180 220"><path d="M90 20L150 50V115Q150 165 90 195Q30 165 30 115V50Z" /><path d="M65 100L82 117L119 75" /><circle cx="90" cy="107" r="75" /></svg></div>
      <div className="admin-floating-tools" aria-hidden="true">{[Fingerprint,ScanLine,LockKeyhole,Sparkles].map((Icon,index)=><span key={index} className={`admin-tool admin-tool-${index}`}><Icon /></span>)}</div>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Logo />
        </div>

        <div className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-trust/25 bg-trust/10 px-2.5 py-1 text-[11px] font-semibold text-trust">
            <ShieldAlert className="size-3.5" /> Acceso administrativo
          </span>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
          {SECCIONES.map((sec) => (
            <div key={sec.titulo}>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {sec.titulo}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-trust/10 text-trust"
                          : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                      )
                    }
                  >
                    <item.icon className="size-[18px]" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={salir}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            <LogOut className="size-[18px]" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Topbar móvil */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <PanelMobileNav items={SECCIONES.flatMap(s => s.items)} />
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={salir} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </header>

      {/* Topbar desktop: búsqueda global + tema */}
      <div className="hidden items-center justify-between border-b border-border bg-card px-8 py-3 lg:flex lg:ml-64">
        <GlobalSearch />
        <ThemeToggle />
      </div>

      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
