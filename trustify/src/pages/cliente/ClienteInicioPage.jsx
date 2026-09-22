import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, FileText, Bell, ShieldCheck, Star, ArrowRight, Store, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { obtenerPerfil, listarNotificaciones } from "@/services/authApi";
import { misSolicitudes } from "@/services/solicitudApi";
import { buscarNegocios, resolverImagenNegocio } from "@/services/negocioApi";

const NIVEL_LABEL = { semilla: "Semilla", asesoria: "En asesoría", formalizado: "Formalizado" };

function TarjetaAcceso({ to, icon: Icon, titulo, valor, nota, tono }) {
  return (
    <Link to={to} className="panel panel-hover flex items-center gap-3 p-4">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tono}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{titulo}</p>
        <p className="font-display text-lg font-bold leading-tight">{valor}</p>
        {nota && <p className="text-xs text-muted-foreground">{nota}</p>}
      </div>
    </Link>
  );
}

export default function ClienteInicioPage() {
  const [usuario, setUsuario] = useState(null);
  const [solicitudesActivas, setSolicitudesActivas] = useState(null);
  const [noLeidas, setNoLeidas] = useState(null);
  const [destacados, setDestacados] = useState(null);

  useEffect(() => {
    obtenerPerfil().then(setUsuario).catch(() => {});
    misSolicitudes()
      .then((lista) => setSolicitudesActivas(lista.filter((s) => s.estado !== "confirmada" && s.estado !== "cancelada").length))
      .catch(() => setSolicitudesActivas(0));
    listarNotificaciones().then((d) => setNoLeidas(d.noLeidas)).catch(() => setNoLeidas(0));
    buscarNegocios({}).then((lista) => setDestacados(lista.slice(0, 4))).catch(() => setDestacados([]));
  }, []);

  const capasCumplidas = usuario
    ? [usuario.kycLayer >= 1, usuario.kycLayer >= 2, usuario.fotoVerificacionEstado === "aprobada", usuario.senescytSriEstado === "verificado"].filter(Boolean).length
    : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Hola{usuario ? `, ${usuario.nombreCompleto.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">Esto es lo que pasa en tu cuenta CheckBiz.</p>
      </div>

      {/* Accesos rápidos con datos reales */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TarjetaAcceso
          to="/mis-solicitudes"
          icon={FileText}
          titulo="Solicitudes activas"
          valor={solicitudesActivas === null ? "…" : solicitudesActivas}
          nota="Ver, confirmar y reseñar"
          tono="bg-trust/10 text-trust"
        />
        <TarjetaAcceso
          to="/notificaciones"
          icon={Bell}
          titulo="Notificaciones"
          valor={noLeidas === null ? "…" : noLeidas > 0 ? `${noLeidas} sin leer` : "Al día"}
          nota="Respuestas y avisos"
          tono="bg-pending/10 text-pending"
        />
        <TarjetaAcceso
          to="/perfil"
          icon={ShieldCheck}
          titulo="Identidad verificada"
          valor={usuario ? `${capasCumplidas} de 4 capas` : "…"}
          nota="Cédula, correo, foto, SENESCYT/SRI"
          tono="bg-verified/10 text-verified"
        />
      </div>

      {/* Explorar negocios */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Negocios destacados</h2>
        <Link to="/buscar" className="flex items-center gap-1 text-sm font-medium text-trust hover:underline">
          Explorar todos <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {destacados === null ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Cargando…</div>
      ) : destacados.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 py-12 text-center">
          <Store className="size-8 text-muted-foreground/50" />
          <p className="font-medium">Todavía no hay negocios publicados</p>
          <Link to="/buscar" className="mt-1 text-sm text-trust hover:underline">Ir a buscar →</Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {destacados.map((n) => (
            <Link key={n.slug} to={`/negocio/publico/${n.slug}`} className="panel panel-hover flex items-center gap-3 p-4">
              <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-trust/10 font-display text-sm font-bold text-trust">
                {n.logoUrl ? (
                  <img src={resolverImagenNegocio(n.logoUrl)} alt="" className="size-full object-cover" />
                ) : (
                  n.nombreComercial.split(" ").map((p) => p[0]).slice(0, 2).join("")
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{n.nombreComercial}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Star className="size-3 fill-pending text-pending" /> {n.trustScore}</span>
                  {n.categoria && <span className="truncate">{n.categoria.nombre}</span>}
                </div>
              </div>
              <Badge variant="outline" className="shrink-0">{NIVEL_LABEL[n.nivelFormalizacion] ?? n.nivelFormalizacion}</Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 rounded-xl border border-trust/25 bg-trust/5 p-4">
        <Search className="size-5 shrink-0 text-trust" />
        <p className="text-sm text-muted-foreground">
          ¿Buscas algo específico? <Link to="/buscar" className="font-medium text-trust hover:underline">Explora todos los negocios verificados →</Link>
        </p>
      </div>
    </div>
  );
}
