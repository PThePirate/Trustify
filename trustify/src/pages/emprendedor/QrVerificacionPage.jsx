import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check, Loader2, AlertCircle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { obtenerMiQr } from "@/services/negocioApi";

/**
 * B11 — QR de verificación física. El código lo entrega el backend (estable
 * mientras exista el negocio); la imagen se genera aquí mismo, en el
 * navegador, apuntando a /qr/{codigo} de este mismo sitio — esa ruta pública
 * registra el escaneo y de ahí redirige a la Mini Landing Page (A6).
 */
export default function QrVerificacionPage() {
  const [qr, setQr] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [formato, setFormato] = useState("afiche");

  useEffect(() => {
    obtenerMiQr()
      .then(async (res) => {
        setQr(res);
        const destino = `${window.location.origin}/qr/${res.codigo}`;
        setUrl(destino);
        const png = await QRCode.toDataURL(destino, {
          width: 1200,
          margin: 2,
          color: { dark: "#172A36", light: "#FFFCF6" },
        });
        setDataUrl(png);
      })
      .catch((err) => setError(err.message));
  }, []);

  function descargar() {
    if (!dataUrl || !qr) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `checkbiz-qr-${qr.codigo}.png`;
    a.click();
  }

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard puede fallar sin HTTPS/permiso — no es crítico, el enlace ya se ve en pantalla
    }
  }

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }

  return (
    <div className="business-page">
      <div className="business-section-banner mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">QR de verificación física</h1>
        <p className="mt-1 text-muted-foreground">
          Imprímelo o muéstralo en tu local o taller — al escanearlo, cualquiera llega directo a tu Mini Landing Page.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="business-surface business-qr-stage flex flex-col items-center gap-5 p-8 text-center">
        {!qr || !dataUrl ? (
          <div className="flex h-[480px] w-full max-w-[480px] items-center justify-center gap-2 rounded-2xl bg-muted/30 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Generando tu código…
          </div>
        ) : (
          <img
            src={dataUrl}
            alt="Código QR de verificación"
            className="w-full max-w-[320px] rounded-2xl border border-border sm:max-w-[400px]"
          />
        )}

        {qr && (
          <>
            <div className="flex items-center gap-2 rounded-full border border-verified/25 bg-verified/10 px-3 py-1.5 text-sm font-semibold text-verified">
              <ScanLine className="size-4" /> {qr.escaneosTotal} {qr.escaneosTotal === 1 ? "escaneo" : "escaneos"} hasta ahora
            </div>

            <code className="w-full break-all rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {url}
            </code>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button variant="trust" className="flex-1" onClick={descargar}>
                <Download className="size-4" /> Descargar PNG
              </Button>
              <Button variant="outline" className="flex-1" onClick={copiarEnlace}>
                {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copiado ? "Copiado" : "Copiar enlace"}
              </Button>
            </div>
          </>
        )}
      </div>
      <aside className="business-surface p-6"><h2 className="text-xl font-bold">Listo para tu espacio</h2><p className="mt-1 text-sm text-muted-foreground">Escoge una presentación y usa la impresión del navegador.</p><div className="mt-5 grid gap-2">{[["afiche", "Afiche", "Para pared o vitrina"], ["stand", "Stand de escritorio", "Para mostrador"], ["sticker", "Sticker", "Para empaque o tarjeta"]].map(([id, label, detail]) => <button key={id} onClick={() => setFormato(id)} className={`rounded-xl border p-4 text-left transition-colors ${formato === id ? "border-trust bg-trust/10" : "border-border hover:bg-muted/40"}`}><strong className="block text-sm">{label}</strong><span className="text-xs text-muted-foreground">{detail}</span></button>)}</div><Button variant="trust" className="mt-5 w-full" disabled={!dataUrl} onClick={() => window.print()}>Imprimir {formato}</Button><p className="mt-4 text-xs text-muted-foreground">Para que el QR funcione fuera de tu computadora, el enlace debe estar disponible públicamente; localhost solo abre en este dispositivo.</p></aside>
      </div>
      {dataUrl && <div className={`business-print business-print-${formato}`}><img src={dataUrl} alt="QR para imprimir" /><strong>Conoce nuestro negocio verificado en CheckBiz</strong><span>Escanea para ver nuestro perfil y contactarnos.</span></div>}

      <div className="panel mt-4 flex items-start gap-2 p-4 text-sm text-muted-foreground">
        <QrCode className="mt-0.5 size-4 shrink-0 text-trust" />
        <span>
          El código no cambia — imprímelo una sola vez. Cada escaneo queda registrado y suma a tu panel de analítica.
        </span>
      </div>
    </div>
  );
}
