import { Navigate } from "react-router-dom";
import { isLoggedIn } from "@/services/authApi";

/** Envuelve rutas que requieren sesión de usuario (cliente/emprendedor). */
export default function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}