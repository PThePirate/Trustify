import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "@/services/adminApi";

/** Envuelve las rutas de /admin/* — sin sesión, redirige al login de admin. */
export default function RequireAdmin({ children }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}