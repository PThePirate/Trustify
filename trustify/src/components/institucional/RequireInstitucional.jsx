import { Navigate } from "react-router-dom";
import { isInstitucionalLoggedIn } from "@/services/institucionalApi";

/** Envuelve las rutas de /institucional/* — sin sesión, redirige al login institucional. */
export default function RequireInstitucional({ children }) {
  if (!isInstitucionalLoggedIn()) {
    return <Navigate to="/institucional/login" replace />;
  }
  return children;
}
