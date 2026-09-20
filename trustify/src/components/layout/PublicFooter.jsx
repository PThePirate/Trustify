import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Marketplace de identidad digital verificada. Convertimos la
            desconfianza del comercio local en un activo de reputación.
          </p>
          <Link to="/ayuda" className="inline-block text-sm font-medium text-trust hover:underline">
            Centro de Ayuda
          </Link>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Business Week — UEES · Prototipo académico</p>
          <p className="mt-1">
            © {new Date().getFullYear()} CheckBiz. Confianza verificada, sin
            intermediarios.
          </p>
        </div>
      </div>
    </footer>
  );
}
