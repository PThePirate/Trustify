import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, GraduationCap, ShieldCheck, UserRoundCheck } from "lucide-react";
import ClienteSection from "@/components/cliente/ClienteSection";
import { obtenerPerfil } from "@/services/authApi";
import { misVerificacionesAlumni } from "@/services/alumniApi";

export default function CompradorVerificadoPage() {
  const [perfil, setPerfil] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { obtenerPerfil().then(setPerfil).catch(e => setError(e.message)); misVerificacionesAlumni().then(setAlumni).catch(() => {}); }, []);
  const capas = perfil ? [
    { titulo: "Cédula registrada", hecho: perfil.kycLayer >= 1 },
    { titulo: "Correo confirmado", hecho: perfil.kycLayer >= 2 },
    { titulo: "Cédula revisada", hecho: perfil.fotoVerificacionEstado === "aprobada" },
    { titulo: "SENESCYT/SRI", hecho: perfil.senescytSriEstado === "verificado", piloto: true },
  ] : [];
  const completas = capas.filter(c => c.hecho).length;
  return <ClienteSection icon={UserRoundCheck} eyebrow="Identidad de confianza" title="Comprador verificado" description="Consulta las verificaciones de tu cuenta y tu vínculo con instituciones aliadas." action={{ to: "/perfil", label: "Gestionar mi cuenta" }}>
    {error && <p role="alert" className="client-extra-error">{error}</p>}{!perfil && !error && <p className="mt-6 text-sm text-muted-foreground">Cargando verificaciones…</p>}
    {perfil && <><div className="client-identity-score"><div className="client-identity-ring" style={{ "--progress": `${completas * 25}%` }}><strong>{completas}<small>/4</small></strong></div><div><h2 className="font-display text-xl font-bold">Tu identidad, paso a paso</h2><p>Los negocios pueden ver señales de que interactúan con una cuenta identificada. Este indicador no predice la rapidez con la que responderán.</p></div></div><div className="client-extra-split"><section className="client-extra-panel"><h2 className="font-display text-lg font-bold">Capas de verificación</h2><div className="mt-4 space-y-3">{capas.map(c => <div key={c.titulo} className={`client-layer ${c.hecho ? "is-done" : ""}`}>{c.hecho ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}<span>{c.titulo}</span><strong>{c.hecho ? "Completada" : "Pendiente"}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">La consulta SENESCYT/SRI sigue simulada durante este piloto; no indica una comprobación real con esas bases.</p><Link to="/perfil" className="client-extra-link">Revisar mis datos</Link></section><section className="client-extra-panel"><div className="flex items-center gap-2"><GraduationCap className="size-6 text-trust" /><h2 className="font-display text-lg font-bold">Mi vínculo alumni</h2></div><p className="mt-2 text-sm text-muted-foreground">Solicita en Mi cuenta que tu universidad confirme tu condición de egresado.</p>{alumni.length ? <div className="mt-4 space-y-2">{alumni.map(a => <div key={a.id} className="client-layer"><GraduationCap className="size-5" /><span>{a.universidad?.nombre || "Universidad"}</span><strong>{a.estado === "verificado" ? "Verificado" : a.estado === "pendiente" ? "En revisión" : a.estado}</strong></div>)}</div> : <div className="client-extra-empty"><GraduationCap className="size-8 text-trust" /><strong>Sin vínculo universitario</strong><p>Puedes iniciar una solicitud desde tu perfil.</p></div>}<Link to="/perfil" className="client-extra-link">Ir a verificación alumni</Link></section></div></>}
  </ClienteSection>;
}
