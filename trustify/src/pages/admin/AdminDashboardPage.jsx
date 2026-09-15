import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, ShieldCheck, Store, Ban, ArrowRight, Flag, Tags, ScrollText,
  TrendingUp, Clock,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { obtenerEstadisticas, listarActividadReciente } from "@/services/adminApi";

const CAPAS_LABELS = ["Capa 1", "Capa 2", "Capa 3", "Capa 4", "Capa 5"];

function TarjetaAcceso({ to, icon: Icon, titulo, desc, disabled, badge }) {
  const contenido = (
    <div className={`panel ${!disabled && "panel-hover"} flex h-full flex-col p-5`}>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-trust/10 text-trust">
          <Icon className="size-5" />
        </span>
        {badge && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-base font-bold">{titulo}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{desc}</p>
      {!disabled && (
        <span className="mt-3 flex items-center gap-1 text-sm font-medium text-trust">
          Ir ahora <ArrowRight className="size-3.5" />
        </span>
      )}
    </div>
  );
  if (disabled) return contenido;
  return <Link to={to}>{contenido}</Link>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [actividad, setActividad] = useState([]);

  useEffect(() => {
    obtenerEstadisticas().then(setStats);
    listarActividadReciente().then(setActividad);
  }, []);

  const totalCapas = stats ? Object.values(stats.usuariosPorCapa).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Panel general</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido de vuelta. Esto es lo que necesita tu atención hoy.
        </p>
      </div>

      {/* Aviso de pendientes */}
      {stats && (
        <div className="panel mb-8 flex items-center gap-4 border-l-4 border-l-pending p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-pending/10 text-pending">
            <Clock className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">
              {stats.kycPendientes} {stats.kycPendientes === 1 ? "verificación" : "verificaciones"} esperando revisión
            </p>
            <p className="text-sm text-muted-foreground">Capa 3 del esquema de identidad — selfie con cédula.</p>
          </div>
          <Link to="/admin/kyc">
            <span className="flex items-center gap-1 text-sm font-semibold text-trust hover:underline">
              Revisar <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      )}

      {/* Métricas */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          tono="trust"
          etiqueta="Usuarios registrados"
          valor={stats ? stats.usuariosTotales : "—"}
          nota="cuentas activas"
        />
        <StatCard
          icon={Store}
          tono="verified"
          etiqueta="Negocios publicados"
          valor={stats ? stats.negociosPublicados : "—"}
          nota="Mini Landing activas"
        />
        <StatCard
          icon={TrendingUp}
          tono="pending"
          etiqueta="Tasa de aprobación KYC"
          valor={stats ? `${Math.round(stats.tasaAprobacionKyc * 100)}%` : "—"}
          nota="últimas verificaciones"
        />
        <StatCard
          icon={Ban}
          tono="danger"
          etiqueta="Cédulas vetadas"
          valor={stats ? stats.cedulasVetadas : "—"}
          nota="bloqueos permanentes"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* Distribución por capa de KYC */}
          <div className="panel p-5">
            <h2 className="mb-4 font-display text-base font-bold">Usuarios por capa de identidad</h2>
            <div className="space-y-3">
              {stats &&
                CAPAS_LABELS.map((label, i) => {
                  const n = i + 1;
                  const cantidad = stats.usuariosPorCapa[n] || 0;
                  const pct = totalCapas ? Math.round((cantidad / totalCapas) * 100) : 0;
                  return (
                    <div key={n}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{cantidad} usuarios</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-trust transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <h2 className="mb-3 mt-8 font-display text-base font-bold">Accesos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TarjetaAcceso to="/admin/kyc" icon={ShieldCheck} titulo="Verificación KYC" desc="Aprueba o rechaza las fotos de identidad de Capa 3." />
            <TarjetaAcceso to="/admin/denuncias" icon={Flag} titulo="Denuncias" desc="Revisa reportes de clientes sobre negocios o usuarios." />
            <TarjetaAcceso to="/admin/veto" icon={Ban} titulo="Veto por cédula" desc="Bloqueo permanente e irreversible de cuentas." />
            <TarjetaAcceso to="/admin/categorias" icon={Tags} titulo="Categorías" desc="Gestión del catálogo maestro de categorías." />
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Actividad reciente</h2>
            <Link to="/admin/auditoria" className="flex items-center gap-1 text-xs font-medium text-trust hover:underline">
              Ver todo <ArrowRight className="size-3" />
            </Link>
          </div>
          <ActivityFeed items={actividad} />
        </div>
      </div>
    </div>
  );
}