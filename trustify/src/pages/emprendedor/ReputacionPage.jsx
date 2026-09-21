import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Star, ShieldCheck, Calendar, CheckCircle2, Loader2, AlertCircle,
  MessageSquareText, Send, TrendingUp, FileDown, Sparkles,
  BadgeCheck, GraduationCap, Languages,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  obtenerReputacion, listarMisResenas, responderResena, obtenerMiNegocio, obtenerMiSuscripcion,
} from "@/services/negocioApi";

const ICONO_INSIGNIA = { "badge-check": BadgeCheck, "graduation-cap": GraduationCap, "shield-check": ShieldCheck, languages: Languages };

/** B9.1 — certificado generado en el navegador, sin backend: solo con datos que el propio dueño ya puede ver. */
function generarCertificadoPdf(negocio, rep) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Certificado de Verificación CheckBiz", 20, 25);

  doc.setFontSize(12);
  doc.text(`Negocio: ${negocio.nombreComercial}`, 20, 45);
  doc.text(`Perfil: checkbiz.ec/negocio/publico/${negocio.slug}`, 20, 53);
  doc.text(`Trust Score: ${rep.trustScore}/100`, 20, 65);
  doc.text(`Nivel de formalización: ${rep.nivelFormalizacion}`, 20, 73);
  doc.text(`Reseñas: ${rep.totalResenas} (promedio ${rep.promedioResenas.toFixed(1)}/5)`, 20, 81);

  if (rep.insignias.length > 0) {
    doc.text("Insignias obtenidas:", 20, 95);
    rep.insignias.forEach((ins, i) => doc.text(`- ${ins.nombre}`, 26, 103 + i * 8));
  }

  doc.setFontSize(9);
  doc.text(`Emitido el ${new Date().toLocaleDateString("es-EC")} — datos verificados en checkbiz.ec`, 20, 280);

  doc.save(`certificado-${negocio.slug}.pdf`);
}

const NIVEL_LABEL = { semilla: "Semilla", asesoria: "En asesoría", formalizado: "Formalizado" };

function colorPorPuntaje(score) {
  if (score >= 70) return { stroke: "hsl(var(--verified))", texto: "text-verified" };
  if (score >= 40) return { stroke: "hsl(var(--trust))", texto: "text-trust" };
  return { stroke: "hsl(var(--pending))", texto: "text-pending" };
}

function Medidor({ score }) {
  const radio = 70;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = (score / 100) * circunferencia;
  const { stroke, texto } = colorPorPuntaje(score);

  return (
    <div className="relative grid place-items-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={radio} fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={radio} fill="none" stroke={stroke} strokeWidth="14"
          strokeDasharray={`${progreso} ${circunferencia}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray .6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-display text-4xl font-bold ${texto}`}>{score}</span>
        <span className="text-xs text-muted-foreground">de 100</span>
      </div>
    </div>
  );
}

function FormularioRespuesta({ resenaId, onListo }) {
  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await responderResena(resenaId, respuesta);
      onListo();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-3 flex gap-2">
      <input
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        placeholder="Responde públicamente…"
        className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" size="sm" variant="trust" disabled={enviando || !respuesta.trim()}>
        {enviando ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

export default function ReputacionPage() {
  const [rep, setRep] = useState(null);
  const [resenas, setResenas] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    obtenerReputacion().then(setRep).catch((err) => setError(err.message));
    listarMisResenas().then(setResenas).catch((err) => setError(err.message));
    obtenerMiNegocio().then(setNegocio).catch(() => {});
    obtenerMiSuscripcion().then(setSuscripcion).catch(() => {});
  }
  useEffect(cargar, []);

  if (error) {
    return <p className="flex items-center gap-1.5 text-sm text-danger"><AlertCircle className="size-4" /> {error}</p>;
  }
  if (!rep || !resenas) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Reputación y Trust Score</h1>
          <p className="mt-1 text-muted-foreground">
            Se recalcula solo, a partir de datos reales — nunca es un número fijo.
          </p>
        </div>
        {suscripcion?.plan.incluyeCertificadoPdf && negocio ? (
          <Button variant="outline" onClick={() => generarCertificadoPdf(negocio, rep)}>
            <FileDown className="size-4" /> Descargar certificado
          </Button>
        ) : suscripcion && (
          <Link to="/negocio/planes" className="flex items-center gap-1.5 text-sm text-trust hover:underline">
            <Sparkles className="size-3.5" /> Certificado PDF disponible en Pro/Elite
          </Link>
        )}
      </div>

      {rep.insignias.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {rep.insignias.map((ins) => {
            const Icon = ICONO_INSIGNIA[ins.icono] ?? BadgeCheck;
            return (
              <Badge key={ins.nombre} variant="verified" title={ins.descripcion ?? undefined}>
                <Icon className="size-3" /> {ins.nombre}
              </Badge>
            );
          })}
        </div>
      )}

      <div className="panel mb-6 flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-around">
        <Medidor score={rep.trustScore} />
        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Star className="size-3.5" /> Reseñas</p>
            <p className="mt-1 font-display text-lg font-bold">
              {rep.totalResenas > 0 ? `${rep.promedioResenas.toFixed(1)} ★` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">{rep.totalResenas} en total</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="size-3.5" /> Cumplimiento</p>
            <p className="mt-1 font-display text-lg font-bold">{Math.round(rep.tasaConfirmacion * 100)}%</p>
            <p className="text-xs text-muted-foreground">{rep.solicitudesConfirmadas} de {rep.totalSolicitudes}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> Nivel</p>
            <p className="mt-1 font-display text-lg font-bold">{NIVEL_LABEL[rep.nivelFormalizacion] ?? rep.nivelFormalizacion}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3.5" /> Antigüedad</p>
            <p className="mt-1 font-display text-lg font-bold">{rep.antiguedadDias}d</p>
            <p className="text-xs text-muted-foreground">en CheckBiz</p>
          </div>
        </div>
      </div>

      <div className="panel mb-6 flex items-start gap-2 p-4 text-sm text-muted-foreground">
        <TrendingUp className="mt-0.5 size-4 shrink-0 text-trust" />
        <span>
          El puntaje pesa: identidad verificada (40 pts), calidad de tus reseñas (30 pts),
          % de solicitudes confirmadas (20 pts), y tu nivel de formalización (10 pts).
        </span>
      </div>

      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
        <MessageSquareText className="size-5" /> Tus reseñas
      </h2>
      {resenas.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no tienes reseñas.</p>
      ) : (
        <div className="space-y-3">
          {resenas.map((r) => (
            <div key={r.id} className="panel p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.clienteNombre}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`size-3.5 ${n <= r.estrellas ? "fill-pending text-pending" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              {r.comentario && <p className="mt-1.5 text-sm text-muted-foreground">{r.comentario}</p>}

              {r.respuestaNegocio ? (
                <div className="mt-3 rounded-lg bg-trust/10 p-3 text-sm">
                  <p className="mb-0.5 text-xs font-semibold text-trust">Tu respuesta</p>
                  {r.respuestaNegocio}
                </div>
              ) : (
                <FormularioRespuesta resenaId={r.id} onListo={cargar} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}