import { obtenerInstitucionActual } from "@/services/institucionalApi";
import DashboardB2GPage from "@/pages/institucional/DashboardB2GPage";
import DashboardCacesPage from "@/pages/institucional/DashboardCacesPage";

/** Resuelve qué dashboard mostrar en /institucional según el tipo de cuenta. */
export default function InstitucionalIndexPage() {
  const institucion = obtenerInstitucionActual();
  return institucion?.tipo === "universidad" ? <DashboardCacesPage /> : <DashboardB2GPage />;
}
