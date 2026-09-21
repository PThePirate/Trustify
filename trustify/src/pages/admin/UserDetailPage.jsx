import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, CreditCard, Calendar, ShieldCheck, Store,
  FileText, MessageSquare, Star, Ban, ExternalLink, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { obtenerUsuario } from "@/services/adminApi";

const CAPAS = [
  { n: 1, nombre: "Estructura" },
  { n: 2, nombre: "Teléfono" },
  { n: 3, nombre: "Foto" },
  { n: 4, nombre: "SENESCYT/SRI" },
  { n: 5, nombre: "Biometría" },
];

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
}

export default function UserDetailPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsuario(null);
    setError("");
    obtenerUsuario(id)
      .then(setUsuario)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link to="/admin" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver
        </Link>
        <div className="panel p-8 text-center text-danger">{error}</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando ficha…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>

      {/* Encabezado */}
      <div className="panel mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-trust/10 font-display text-xl font-bold text-trust">
              {usuario.nombreCompleto.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div>
              <h1 className="font-display text-xl font-bold">{usuario.nombreCompleto}</h1>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {usuario.rolCliente && <Badge variant="trust">Cliente</Badge>}
                {usuario.rolEmprendedor && <Badge variant="verified">Emprendedor</Badge>}
                {usuario.estadoCedula === "vetada" && <Badge variant="outline" className="border-danger/30 text-danger">Vetada</Badge>}
              </div>
            </div>
          </div>

          <Link
            to={`/admin/veto?cedula=${usuario.cedula}`}
            className="flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <Ban className="size-4" /> Vetar cédula
          </Link>
        </div>

        <div className="mt-5 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="flex items-center gap-1.5"><CreditCard className="size-3.5" /> {usuario.cedula}</span>
          <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> {usuario.correo}</span>
          <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {usuario.telefono}</span>
          <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> Se unió el {formatearFecha(usuario.creadoEn)}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {/* Progreso de KYC */}
          <div className="panel p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
              <ShieldCheck className="size-4" /> Esquema de identidad
            </h2>
            <div className="flex gap-1.5">
              {CAPAS.map((c) => (
                <div key={c.n} className="flex-1 text-center">
                  <div
                    className={`h-2 rounded-full ${
                      c.n <= usuario.kycLayer ? "bg-verified" : "bg-muted"
                    }`}
                  />
                  <p className="mt-1.5 text-[10px] text-muted-foreground">{c.nombre}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Capa {usuario.kycLayer} de 5 · Foto: <span className="font-medium text-foreground">{usuario.fotoVerificacionEstado}</span>
              {" · "}SENESCYT/SRI: <span className="font-medium text-foreground">{usuario.senescytSriEstado}</span>
              <span className="text-[11px]"> (simulado — no consulta esas bases en este piloto)</span>
            </p>
          </div>

          {/* Negocio (si es emprendedor) */}
          {usuario.negocio && (
            <div className="panel p-5">
              <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
                <Store className="size-4" /> Negocio
              </h2>
              <p className="font-semibold">{usuario.negocio.nombreComercial}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Nivel: <span className="font-medium text-foreground">{usuario.negocio.nivelFormalizacion}</span></span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-pending text-pending" /> Trust Score {usuario.negocio.trustScore}
                </span>
              </div>
            </div>
          )}

          {/* Contratos firmados */}
          <div className="panel p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
              <FileText className="size-4" /> Contratos firmados
            </h2>
            <div className="space-y-2">
              {usuario.contratos.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{c.tipo === "adhesion_general" ? "Contrato de Adhesión general" : "Contrato de Adhesión emprendedor"}</p>
                    <p className="text-xs text-muted-foreground">IP {c.ip} · {formatearFecha(c.firmadoEn)}</p>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad como cliente */}
        <div className="panel h-fit p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
            <MessageSquare className="size-4" /> Actividad
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">Solicitudes enviadas</span>
              <span className="font-display text-lg font-bold">{usuario.solicitudes}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">Reseñas dejadas</span>
              <span className="font-display text-lg font-bold">{usuario.resenas}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}