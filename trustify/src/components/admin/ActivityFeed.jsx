import { ShieldCheck, ShieldX, Ban, Store, Activity } from "lucide-react";

const ICONOS = {
  kyc_aprobado: { Icon: ShieldCheck, tono: "text-verified bg-verified/10" },
  kyc_rechazado: { Icon: ShieldX, tono: "text-danger bg-danger/10" },
  veto: { Icon: Ban, tono: "text-danger bg-danger/10" },
  negocio: { Icon: Store, tono: "text-trust bg-trust/10" },
};

function tiempoRelativo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const horas = Math.floor(diffMs / 3600000);
  if (horas < 1) return "Hace unos minutos";
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} d`;
}

export default function ActivityFeed({ items }) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">Sin actividad reciente.</p>;
  }
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const conf = ICONOS[item.tipo] || { Icon: Activity, tono: "text-muted-foreground bg-muted" };
        return (
          <li key={item.id} className="flex gap-3">
            <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${conf.tono}`}>
              <conf.Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-snug">{item.texto}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{tiempoRelativo(item.fecha)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}