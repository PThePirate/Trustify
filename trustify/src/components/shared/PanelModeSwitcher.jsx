import { NavLink } from "react-router-dom";
import { Store, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/** Las vistas comparten usuario y sesión; solo cambia el panel activo. */
export default function PanelModeSwitcher({ usuario, actual, compacto = false, onNavigate }) {
  if (!usuario?.rolCliente || !usuario?.rolEmprendedor) return null;

  const opciones = [
    { modo: "cliente", ruta: "/panel", etiqueta: "Cliente", icono: UserRound },
    { modo: "emprendedor", ruta: "/negocio", etiqueta: "Emprendedor", icono: Store },
  ];

  return (
    <div className={cn("rounded-xl border border-trust/25 bg-trust/5 p-1", compacto && "mx-auto w-fit")} role="group" aria-label="Cambiar vista de la cuenta">
      {!compacto && <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ver como</p>}
      <div className={cn("flex gap-1", compacto && "flex-col")}>
        {opciones.map(({ modo, ruta, etiqueta, icono: Icono }) => (
          <NavLink
            key={modo}
            to={ruta}
            onClick={onNavigate}
            title={compacto ? `Ver como ${etiqueta}` : undefined}
            aria-label={`Ver como ${etiqueta}`}
            aria-current={actual === modo ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors",
              actual === modo ? "bg-trust text-white shadow-sm" : "text-muted-foreground hover:bg-trust/10 hover:text-foreground"
            )}
          >
            <Icono className="size-4 shrink-0" />
            {!compacto && <span className="truncate">{etiqueta}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
