import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye, MessageCircle, TrendingUp, TrendingDown, Minus, Loader2, AlertCircle, Table2, LineChart as LineChartIcon, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { obtenerMiAnalitica, misSolicitudesRecibidas } from "@/services/negocioApi";

function TarjetaMetrica({ icon: Icon, etiqueta, valor, nota, tono = "bg-trust/10 text-trust" }) {
  return (
    <div className="panel p-5">
      <span className={`grid size-10 place-items-center rounded-xl ${tono}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-bold leading-none">{valor}</p>
      <p className="mt-1.5 text-sm font-medium text-foreground/80">{etiqueta}</p>
      {nota && <p className="mt-0.5 text-xs text-muted-foreground">{nota}</p>}
    </div>
  );
}

/** Delta con ícono + etiqueta — nunca solo color, tal como pide la guía de accesibilidad. */
function Delta({ comparativa, periodoLabel }) {
  const { variacionPorcentual: v, periodoAnterior } = comparativa;
  if (v === null) {
    return <span className="text-xs text-muted-foreground">Sin datos de {periodoLabel} anterior para comparar</span>;
  }
  const subio = v > 0;
  const igual = v === 0;
  const Icon = igual ? Minus : subio ? TrendingUp : TrendingDown;
  const color = igual ? "text-muted-foreground" : subio ? "text-verified" : "text-danger";
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="size-3.5" />
      {Math.abs(v).toFixed(0)}% vs. {periodoLabel} anterior ({periodoAnterior})
    </span>
  );
}

const ANCHO = 640;
const ALTO = 220;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };

function GraficaVisitas({ serie }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);

  const maxCrudo = Math.max(1, ...serie.map((p) => Math.max(p.visitas, p.clicsWhatsapp)));
  // Redondear el techo del eje a un número "limpio" (5, 10, 20, 25, 50…)
  const pasos = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
  const max = pasos.find((p) => p >= maxCrudo) ?? Math.ceil(maxCrudo / 100) * 100;

  const anchoUtil = ANCHO - PAD.left - PAD.right;
  const altoUtil = ALTO - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (i / Math.max(1, serie.length - 1)) * anchoUtil;
  const y = (v) => PAD.top + altoUtil - (v / max) * altoUtil;

  function puntos(campo) {
    return serie.map((p, i) => `${x(i)},${y(p[campo])}`).join(" ");
  }
  function area(campo) {
    const linea = puntos(campo);
    return `${x(0)},${y(0)} ${linea} ${x(serie.length - 1)},${y(0)}`;
  }

  function onMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * ANCHO;
    const i = Math.round(((relX - PAD.left) / anchoUtil) * (serie.length - 1));
    setHoverIdx(Math.min(serie.length - 1, Math.max(0, i)));
  }

  const gridlines = [0, 0.25, 0.5, 0.75, 1];
  const activo = hoverIdx !== null ? serie[hoverIdx] : null;

  return (
    <div className="relative">
      {/* Leyenda — dos series, siempre visible */}
      <div className="mb-3 flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-trust" /> Visitas al perfil</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-verified" /> Chats iniciados</span>
      </div>

      <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full touch-none"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Gridlines horizontales — hairline, recesivas */}
        {gridlines.map((g) => (
          <line
            key={g}
            x1={PAD.left} x2={ANCHO - PAD.right}
            y1={PAD.top + altoUtil * (1 - g)} y2={PAD.top + altoUtil * (1 - g)}
            stroke="hsl(var(--border))" strokeWidth="1"
          />
        ))}
        <text x={4} y={PAD.top + 4} className="fill-muted-foreground text-[9px]">{max}</text>
        <text x={4} y={ALTO - PAD.bottom + 4} className="fill-muted-foreground text-[9px]">0</text>

        {/* Áreas al 10% de opacidad, debajo de las líneas */}
        <polygon points={area("visitas")} fill="hsl(var(--trust))" opacity="0.1" />
        <polygon points={area("clicsWhatsapp")} fill="hsl(var(--verified))" opacity="0.1" />

        {/* Líneas — 2px, join/cap redondeado */}
        <polyline points={puntos("visitas")} fill="none" stroke="hsl(var(--trust))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={puntos("clicsWhatsapp")} fill="none" stroke="hsl(var(--verified))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Crosshair + puntos activos al pasar el mouse */}
        {activo && (
          <>
            <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={PAD.top} y2={ALTO - PAD.bottom} stroke="hsl(var(--border))" strokeWidth="1" />
            <circle cx={x(hoverIdx)} cy={y(activo.visitas)} r="4" fill="hsl(var(--trust))" stroke="hsl(var(--card))" strokeWidth="2" />
            <circle cx={x(hoverIdx)} cy={y(activo.clicsWhatsapp)} r="4" fill="hsl(var(--verified))" stroke="hsl(var(--card))" strokeWidth="2" />
          </>
        )}

        {/* Eje X: solo extremos, para no saturar */}
        <text x={x(0)} y={ALTO - 4} textAnchor="start" className="fill-muted-foreground text-[9px]">
          {serie[0].fecha.slice(5)}
        </text>
        <text x={x(serie.length - 1)} y={ALTO - 4} textAnchor="end" className="fill-muted-foreground text-[9px]">
          {serie[serie.length - 1].fecha.slice(5)}
        </text>
      </svg>

      {activo && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(x(hoverIdx) / ANCHO) * 100}%`, top: `${(PAD.top / ALTO) * 100}%` }}
        >
          <p className="font-semibold">{activo.fecha}</p>
          <p className="text-trust">Visitas: {activo.visitas}</p>
          <p className="text-verified">Chats iniciados: {activo.clicsWhatsapp}</p>
        </div>
      )}
      </div>
    </div>
  );
}

/** Vista de tabla — alternativa accesible a la gráfica, con los mismos datos. */
function TablaSerie({ serie }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setAbierta((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <Table2 className="size-3.5" /> {abierta ? "Ocultar tabla" : "Ver como tabla"}
      </button>
      {abierta && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Fecha</th>
                <th className="px-3 py-2 text-right font-medium">Visitas</th>
                <th className="px-3 py-2 text-right font-medium">Chats iniciados</th>
              </tr>
            </thead>
            <tbody>
              {[...serie].reverse().map((p) => (
                <tr key={p.fecha} className="border-t border-border">
                  <td className="px-3 py-1.5 tabular-nums">{p.fecha}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{p.visitas}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{p.clicsWhatsapp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AnaliticaPage() {
  const [datos, setDatos] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState(false);
  const [errorSolicitudes, setErrorSolicitudes] = useState("");

  async function cargar() {
    setActualizando(true);
    setError("");
    setErrorSolicitudes("");
    await Promise.all([
      obtenerMiAnalitica().then(setDatos).catch((err) => setError(err.message)),
      misSolicitudesRecibidas().then(setSolicitudes).catch((err) => setErrorSolicitudes(err.message)),
    ]);
    setActualizando(false);
  }
  useEffect(() => { cargar(); }, []);
  function descargar() {
    const filas = [["Métrica", "Valor"], ["Visitas", datos.totalVisitas], ["Chats iniciados", datos.totalClicsWhatsapp], ["Conversión", datos.tasaConversion], [], ["Fecha", "Visitas", "Chats iniciados"], ...datos.serieDiaria.map(p => [p.fecha, p.visitas, p.clicsWhatsapp])];
    const url = URL.createObjectURL(new Blob(["\uFEFF" + filas.map(f => f.join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const enlace = document.createElement("a"); enlace.href = url; enlace.download = "analitica-checkbiz.csv"; enlace.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (error) {
    return <div role="alert"><p className="text-danger">{error}</p><Button onClick={cargar} disabled={actualizando}>Reintentar</Button></div>;
  }
  if (!datos) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  return (
    <div className="business-page">
      <div className="business-section-banner mb-6">
        <div className="mb-4 flex gap-2"><Button onClick={cargar} disabled={actualizando}>{actualizando ? "Actualizando…" : "Actualizar datos"}</Button><Button variant="outline" onClick={descargar}>Descargar CSV</Button></div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Panel de Analítica</h1>
        <p className="mt-1 text-muted-foreground">
          Visitas de cuentas con sesión: una por cuenta y día, excluyendo al propietario. Los accesos anónimos y el historial anterior sin identificar no se cuentan. Los chats cuentan conversaciones creadas desde Contáctenos, no mensajes ni usuarios únicos.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TarjetaMetrica icon={Eye} etiqueta="Visitas al perfil" valor={datos.totalVisitas} tono="bg-trust/10 text-trust" />
        <TarjetaMetrica icon={MessageCircle} etiqueta="Chats iniciados" valor={datos.totalClicsWhatsapp} tono="bg-verified/10 text-verified" />
        <TarjetaMetrica
          icon={TrendingUp}
          etiqueta="Tasa de conversión"
          valor={`${(datos.tasaConversion * 100).toFixed(1)}%`}
          nota="visita → contacto"
          tono="bg-pending/10 text-pending"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Actividad de este mes">
        <TarjetaMetrica icon={Eye} etiqueta="Visitas de este mes" valor={datos.visitasMes ?? 0} />
        <TarjetaMetrica icon={MessageCircle} etiqueta="Solicitudes de este mes" valor={datos.solicitudesMes ?? 0} />
        <TarjetaMetrica icon={Sparkles} etiqueta="Reseñas de este mes" valor={datos.resenasMes ?? 0} />
      </div>

      {datos.avanzadaDisponible ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="panel p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Esta semana</p>
              <p className="font-display text-xl font-bold">{datos.comparativaSemanal.periodoActual} visitas</p>
              <Delta comparativa={datos.comparativaSemanal} periodoLabel="semana" />
            </div>
            <div className="panel p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Este mes</p>
              <p className="font-display text-xl font-bold">{datos.comparativaMensual.periodoActual} visitas</p>
              <Delta comparativa={datos.comparativaMensual} periodoLabel="mes" />
            </div>
          </div>

          <div className="business-chart panel p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
              <LineChartIcon className="size-4" /> Últimos 30 días
            </h2>
            {datos.serieDiaria.length > 0 ? <GraficaVisitas serie={datos.serieDiaria} /> : <p>Aún no hay datos diarios.</p>}
            <TablaSerie serie={datos.serieDiaria} />
          </div>
        </>
      ) : (
        <div className="panel flex flex-col items-center gap-2 py-12 text-center">
          <Sparkles className="size-8 text-trust/60" />
          <p className="font-medium">La analítica avanzada está disponible en el plan Plus</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Comparativas semana a semana, mes a mes y la gráfica de los últimos 30 días.
          </p>
          <Link to="/negocio/planes">
            <Button variant="trust" className="mt-2">Mejora tu plan</Button>
          </Link>
        </div>
      )}
      {datos.avanzadaDisponible && <div className="business-surface mt-6 p-5">
        <h2 className="text-lg font-bold">Cuándo llegan más solicitudes</h2>
        {errorSolicitudes && <p role="alert" className="mt-2 text-danger">No se pudieron cargar las solicitudes: {errorSolicitudes}</p>}
        <p className="mt-1 text-sm text-muted-foreground">Distribución de solicitudes recibidas según su fecha de creación; aún no identifica la ciudad de origen.</p>
        {solicitudes.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">Cuando recibas solicitudes, verás aquí los días y horarios con más actividad.</p> : <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {[{ label: "Por día", names: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], index: (d) => d.getDay() }, { label: "Por horario", names: ["00–05", "06–11", "12–17", "18–23"], index: (d) => Math.floor(d.getHours() / 6) }].map((grupo) => {
            const valores = grupo.names.map((_, i) => solicitudes.filter((s) => grupo.index(new Date(s.creadoEn)) === i).length);
            const max = Math.max(1, ...valores);
            return <div key={grupo.label}><h3 className="mb-4 font-semibold">{grupo.label}</h3><div className="space-y-3">{grupo.names.map((nombre, i) => <div key={nombre} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3 text-xs"><span className="text-muted-foreground">{nombre}</span><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-trust" style={{ width: `${valores[i] / max * 100}%` }} /></div><strong>{valores[i]}</strong></div>)}</div></div>;
          })}
        </div>}
      </div>}
    </div>
  );
}
