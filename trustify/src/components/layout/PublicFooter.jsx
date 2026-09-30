import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Negocios verificados de tu comunidad universitaria.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-start">
            <Link to="/planes" className="text-sm font-medium text-trust hover:underline">Planes para tu negocio</Link>
            <Link to="/ayuda" className="text-sm font-medium text-trust hover:underline">
              Centro de Ayuda
            </Link>
            <Link to="/universidades" className="text-sm font-medium text-trust hover:underline">
              Universidades
            </Link>
            <Link to="/contrato" className="text-sm font-medium text-trust hover:underline">
              Términos y Condiciones
            </Link>
            <Link to="/privacidad" className="text-sm font-medium text-trust hover:underline">Política de Privacidad</Link>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          
          <p className="mt-1">
            © {new Date().getFullYear()} CheckBiz.
          </p>
        </div>
      </div>
    </footer>
  );
}

