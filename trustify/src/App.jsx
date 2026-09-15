import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Módulo E — Admin
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import KycQueuePage from "@/pages/admin/KycQueuePage";
import VetoPage from "@/pages/admin/VetoPage";
import ComplaintsPage from "@/pages/admin/ComplaintsPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import UserDetailPage from "@/pages/admin/UserDetailPage";

/**
 * Router principal de CheckBiz.
 * A medida que construyamos cada módulo (A Cliente, B Emprendedor, C/D paneles)
 * iremos agregando sus rutas aquí.
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* MÓDULO F — Público / Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Autenticación pública (Cliente / Emprendedor) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* MÓDULO E — Admin (ruta y login completamente separados) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="kyc" element={<KycQueuePage />} />
            <Route path="veto" element={<VetoPage />} />
            <Route path="denuncias" element={<ComplaintsPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="auditoria" element={<AuditLogsPage />} />
            <Route path="usuarios/:id" element={<UserDetailPage />} />
          </Route>

          {/* Próximos módulos (placeholders):
          <Route path="/app/*" element={<ClienteLayout />} />
          <Route path="/negocio/*" element={<EmprendedorLayout />} />
          <Route path="/panel/*" element={<PanelLayout />} />
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}