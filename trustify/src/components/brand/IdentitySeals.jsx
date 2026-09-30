import { BadgeCheck, Building2, Fingerprint, Mail, FileCheck2 } from "lucide-react";

export default function IdentitySeals() {
  return <div className="identity-seals">
    <article className="identity-seal identity-seal-person">
      <div className="seal-emblem"><BadgeCheck size={48} /></div>
      <div><h3>Verificado</h3><p>Conoce quién está detrás del perfil.</p></div>
      <ul>
        <li><Fingerprint /> Cédula válida y verificación del rostro</li>
        <li><Mail /> Confirmación del correo</li>
        <li><FileCheck2 /> Aceptación de los términos; el emprendedor firma su Declaración Responsable</li>
      </ul>
      <p className="seal-note">El servicio contempla biometría con el Registro Civil, sin guardar la foto ni la plantilla facial. En esta versión, la revisión de identidad es manual.</p>
    </article>
    <article className="identity-seal identity-seal-business">
      <div className="seal-emblem"><Building2 size={48} /></div>
      <div><h3>Formalizado</h3><p>Identifica un negocio asociado a un RUC activo.</p></div>
      <ul><li><FileCheck2 /> Revisión del RUC del negocio</li><li><BadgeCheck /> Plazo previsto: hasta 48 horas hábiles</li></ul>
      <p className="seal-note">La ruta tiene dos niveles: Verificado y Formalizado. Completar sus requisitos aporta al Trust Score; el simulador RIMPE no valida por sí mismo el registro ante el SRI.</p>
    </article>
  </div>;
}
