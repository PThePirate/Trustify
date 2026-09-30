import { Link } from "react-router-dom";
import { ShieldCheck, Flag, Tags, ScrollText, CreditCard, Award, Fingerprint } from "lucide-react";
const AREAS = [
  ["Identidad", "Revisión documental", "/admin/kyc", ShieldCheck],
  ["Moderación", "Reportes y denuncias", "/admin/denuncias", Flag],
  ["Catálogo", "Categorías de negocios", "/admin/categorias", Tags],
  ["Suscripciones", "Planes y convenios", "/admin/suscripciones", CreditCard],
  ["Insignias", "Reconocimientos", "/admin/insignias", Award],
  ["Auditoría", "Historial de acciones", "/admin/auditoria", ScrollText],
];
export default function AdminControlMap() {
  return <section className="admin-control-map mb-8" aria-labelledby="control-map-title">
    <div className="admin-map-heading"><span><Fingerprint /></span><div><h2 id="control-map-title">Tu centro de revisión</h2><p>Elige el área que necesitas gestionar.</p></div></div>
    <div className="admin-map-links">{AREAS.map(([name,description,to,Icon],index)=><Link to={to} key={to} className={`admin-map-link admin-map-link-${index}`}><span className="admin-map-icon"><Icon /></span><strong>{name}</strong><small>{description}</small></Link>)}</div>
    <svg className="admin-map-wires" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true"><path d="M50 190H1150M120 190V70M315 190V70M505 190V70M695 190V70M885 190V70M1075 190V70" /><path className="admin-map-current" d="M50 190H1150" /></svg>
  </section>;
}
