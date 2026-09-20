import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registrarEscaneoQr } from "@/services/negocioApi";

/**
 * B11 — a esta ruta llega quien escanea el QR físico. Registra el escaneo
 * (para analítica y el contador que ve el dueño) y redirige de inmediato a
 * la Mini Landing Page real del negocio (A6). No requiere sesión.
 */
export default function QrEscaneoPage() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;
    registrarEscaneoQr(codigo)
      .then((res) => {
        if (!cancelado) navigate(`/negocio/publico/${res.slug}`, { replace: true });
      })
      .catch((err) => !cancelado && setError(err.message || "Este código QR no es válido"));
    return () => {
      cancelado = true;
    };
  }, [codigo, navigate]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="panel flex max-w-sm flex-col items-center gap-3 p-8 text-center">
          <ShieldAlert className="size-8 text-danger" />
          <h1 className="font-display text-lg font-bold">No pudimos abrir este código</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" asChild className="mt-2">
            <Link to="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        Abriendo el perfil verificado…
      </div>
    </div>
  );
}
