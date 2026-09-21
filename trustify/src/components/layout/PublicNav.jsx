import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Cómo funciona", to: "/como-funciona" },
  { label: "Identidad", href: "#identidad" },
  { label: "Producto", href: "#producto" },
  { label: "Métricas", href: "#metricas" },
  { label: "Universidades", to: "/universidades" },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-strong border-b"
          : "border-b border-transparent bg-gradient-to-b from-black/40 to-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Sobre el hero (no scrolled) forzamos texto claro */}
        <Link to="/" aria-label="CheckBiz inicio" className={cn(!scrolled && "text-white")}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const className = cn(
              "text-sm transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            );
            return l.to ? (
              <Link key={l.to} to={l.to} className={className}>{l.label}</Link>
            ) : (
              <a key={l.href} href={l.href} className={className}>{l.label}</a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle
            className={cn(
              !scrolled &&
                "border-white/25 bg-white/10 text-white hover:bg-white/20"
            )}
          />
          <Button
            variant="ghost"
            size="sm"
            className={cn("hidden sm:inline-flex", !scrolled && "text-white hover:bg-white/10")}
            asChild
          >
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="trust" size="sm" asChild>
            <Link to="/registro">Únete</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
