import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import LandingPage from "@/pages/public/LandingPage";
import MiniLandingPublicaPage from "@/pages/public/MiniLandingPublicaPage";
import BuscarPage from "@/pages/public/BuscarPage";
import ResultadosBusquedaPage from "@/pages/public/ResultadosBusquedaPage";
import MisSolicitudesPage from "@/pages/public/MisSolicitudesPage";
import PerfilPage from "@/pages/public/PerfilPage";
import NotificacionesPage from "@/pages/public/NotificacionesPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import FotoVerificacionPage from "@/pages/auth/FotoVerificacionPage";
import OnboardingPage from "@/pages/public/OnboardingPage";

// Módulo B — Emprendedor
import RequireAuth from "@/components/auth/RequireAuth";
import ActivarEmprendedorPage from "@/pages/emprendedor/ActivarEmprendedorPage";
import EmprendedorLayout from "@/components/emprendedor/EmprendedorLayout";
import NegocioEditorPage from "@/pages/emprendedor/NegocioEditorPage";
import CatalogoPage from "@/pages/emprendedor/CatalogoPage";
import BandejaSolicitudesPage from "@/pages/emprendedor/BandejaSolicitudesPage";
import ReputacionPage from "@/pages/emprendedor/ReputacionPage";
import FormalizacionPage from "@/pages/emprendedor/FormalizacionPage";
import QrVerificacionPage from "@/pages/emprendedor/QrVerificacionPage";
import QrEscaneoPage from "@/pages/public/QrEscaneoPage";

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
 * A medida que construyamos cada módulo (A Cliente, C/D paneles) iremos
 * agregando sus rutas aquí.
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* MÓDULO F — Público / Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* A6 — Mini Landing Page pública de un negocio */}
          <Route path="/negocio/publico/:slug" element={<MiniLandingPublicaPage />} />

          {/* B11 — a donde apunta el QR físico; registra el escaneo y redirige a A6 */}
          <Route path="/qr/:codigo" element={<QrEscaneoPage />} />

          {/* A4/A5 — Búsqueda y resultados */}
          <Route path="/buscar" element={<BuscarPage />} />
          <Route path="/buscar/resultados" element={<ResultadosBusquedaPage />} />

          {/* A7/A8 — Mis solicitudes (requiere sesión de cliente) */}
          <Route
            path="/mis-solicitudes"
            element={
              <RequireAuth>
                <MisSolicitudesPage />
              </RequireAuth>
            }
          />

          {/* A9 — Perfil del comprador (requiere sesión) */}
          <Route
            path="/perfil"
            element={
              <RequireAuth>
                <PerfilPage />
              </RequireAuth>
            }
          />

          {/* A10 — Notificaciones (requiere sesión) */}
          <Route
            path="/notificaciones"
            element={
              <RequireAuth>
                <NotificacionesPage />
              </RequireAuth>
            }
          />

          {/* Autenticación pública (Cliente / Emprendedor) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/verificar-otp" element={<OtpVerificationPage />} />
          <Route path="/verificar-foto" element={<FotoVerificacionPage />} />

          {/* A1 — Onboarding, primera vez que un cliente nuevo entra */}
          <Route path="/bienvenida" element={<OnboardingPage />} />

          {/* MÓDULO B — Emprendedor */}
          <Route
            path="/negocio/activar"
            element={
              <RequireAuth>
                <ActivarEmprendedorPage />
              </RequireAuth>
            }
          />
          <Route
            path="/negocio"
            element={
              <RequireAuth>
                <EmprendedorLayout />
              </RequireAuth>
            }
          >
            <Route index element={<NegocioEditorPage />} />
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route path="solicitudes" element={<BandejaSolicitudesPage />} />
            <Route path="reputacion" element={<ReputacionPage />} />
            <Route path="formalizacion" element={<FormalizacionPage />} />
            <Route path="qr" element={<QrVerificacionPage />} />
          </Route>

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
          <Route path="/panel/*" element={<PanelLayout />} />                        <- C/D
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}