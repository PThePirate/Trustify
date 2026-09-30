import { obtenerInstitucionActual } from "@/services/institucionalApi";
import DashboardB2GPage from "@/pages/institucional/DashboardB2GPage";
import UniversidadPanelPage from "@/pages/institucional/UniversidadPanelPage";

/** Resuelve qué dashboard mostrar en /institucional según el tipo de cuenta. */
export default function InstitucionalIndexPage() {
  const institucion = obtenerInstitucionActual();
  return institucion?.tipo === "universidad" ? <UniversidadPanelPage /> : <DashboardB2GPage />;
}
