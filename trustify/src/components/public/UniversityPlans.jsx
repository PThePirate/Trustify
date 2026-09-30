import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Medal, Gem } from "lucide-react";
export default function UniversityPlans() {
  return <section id="planes-universidades" className="plans-comparison"><h2>Planes para universidades</h2><p className="mb-6 text-muted-foreground">Impulsa a tu comunidad emprendedora. Silver ofrece más cuentas; Gold incluye cuentas Plus. Coordinamos el precio en una reunión contigo.</p>
    <div className="plans-cards university-plan-cards">{[["Bronze","100 Básicas","Sin cuentas extra"],["Silver","200 Básicas","Cuentas Básicas adicionales"],["Gold","150 Plus","Cuentas Plus adicionales"]].map(([name,accounts,extra]) => <article className={`plans-card campus-tier campus-tier-${name.toLowerCase()}`} key={name}><span className="campus-medallion">{name === "Gold" ? <Gem /> : name === "Silver" ? <Medal /> : <GraduationCap />}</span><h3 className="text-2xl font-bold">{name}</h3><p className="my-5 text-xl font-semibold">{accounts}</p><ul><li>✓ Panel con métricas agregadas</li><li>✓ Visibilidad y filtro por universidad</li><li>✓ 25% de descuento en Básico para egresados durante 1 año</li><li>{extra}</li></ul><Button variant="trust" asChild className="w-full"><Link to={`/solicitar-reunion?nivel=${name}`}>Solicitar reunión</Link></Button></article>)}</div>
    <p className="plans-small">Las cuentas cubiertas por el convenio son gratuitas para el estudiante. Las plazas se asignan por orden de llegada y la universidad puede consultar cuántas quedan en su panel.</p>
  </section>;
}
