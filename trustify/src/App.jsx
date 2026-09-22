import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import LandingPage from "@/pages/public/LandingPage";
import MiniLandingPublicaPage from "@/pages/public/MiniLandingPublicaPage";
import BuscarPage from "@/pages/public/BuscarPage";
import ResultadosBusquedaPage from "@/pages/public/ResultadosBusquedaPage";
import MisSolicitudesPage from "@/pages/public/MisSolicitudesPage";
import PerfilPage from "@/pages/public/PerfilPage";
import NotificacionesPage from "@/pages/public/NotificacionesPage";
import AyudaPage from "@/pages/public/AyudaPage";
import ContratoPage from "@/pages/public/ContratoPage";
import ComoFuncionaPage from "@/pages/public/ComoFuncionaPage";
import UniversidadesPage from "@/pages/public/UniversidadesPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import RecuperarPasswordPage from "@/pages/auth/RecuperarPasswordPage";
import FotoVerificacionPage from "@/pages/auth/FotoVerificacionPage";
import OnboardingPage from "@/pages/public/OnboardingPage";
import ClienteLayout from "@/components/cliente/ClienteLayout";
import ClienteInicioPage from "@/pages/cliente/ClienteInicioPage";
import { isLoggedIn, obtenerPerfil } from "@/services/authApi";

// Módulo B — Emprendedor
import RequireAuth from "@/components/auth/RequireAuth";
import ActivarEmprendedorPage from "@/pages/emprendedor/ActivarEmprendedorPage";
import OnboardingEmprendedorPage from "@/pages/emprendedor/OnboardingEmprendedorPage";
import EmprendedorLayout from "@/components/emprendedor/EmprendedorLayout";
import NegocioEditorPage from "@/pages/emprendedor/NegocioEditorPage";
import CatalogoPage from "@/pages/emprendedor/CatalogoPage";
import BandejaSolicitudesPage from "@/pages/emprendedor/BandejaSolicitudesPage";
import ReputacionPage from "@/pages/emprendedor/ReputacionPage";
import FormalizacionPage from "@/pages/emprendedor/FormalizacionPage";
import AnaliticaPage from "@/pages/emprendedor/AnaliticaPage";
import PlanesPage from "@/pages/emprendedor/PlanesPage";
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
import GestionSuscripcionesPage from "@/pages/admin/GestionSuscripcionesPage";
import GestionInsigniasPage from "@/pages/admin/GestionInsigniasPage";
import UserDetailPage from "@/pages/admin/UserDetailPage";

// Módulo D — Institucional (B2G)
import RequireInstitucional from "@/components/institucional/RequireInstitucional";
import InstitucionalLayout from "@/components/institucional/InstitucionalLayout";
import InstitucionalLoginPage from "@/pages/institucional/InstitucionalLoginPage";
import InstitucionalIndexPage from "@/pages/institucional/InstitucionalIndexPage";
import SeguimientoAlumniPage from "@/pages/institucional/SeguimientoAlumniPage";

function ClienteAwareLayout() {
  return isLoggedIn() ? <ClienteLayout /> : <Outlet />;
}

function AyudaAwareLayout() {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      setRol("publico");
      return;
    }

    obtenerPerfil()
      .then((usuario) => setRol(usuario.rolEmprendedor ? "emprendedor" : "cliente"))
      .catch(() => setRol("publico"));
  }, []);

  if (rol === null) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Cargando…</div>;
  }

  if (rol === "cliente") return <ClienteLayout />;
  if (rol === "emprendedor") return <EmprendedorLayout />;
  return <Outlet />;
}

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

          {/* B11 — a donde apunta el QR físico; registra el escaneo y redirige a A6 */}
          <Route path="/qr/:codigo" element={<QrEscaneoPage />} />

          {/* El cliente conserva su sidebar también al explorar negocios. */}
          <Route element={<ClienteAwareLayout />}>
            {/* A6 — Mini Landing Page pública de un negocio */}
            <Route path="/negocio/publico/:slug" element={<MiniLandingPublicaPage />} />
            {/* A4/A5 — Búsqueda y resultados */}
            <Route path="/buscar" element={<BuscarPage />} />
            <Route path="/buscar/resultados" element={<ResultadosBusquedaPage />} />
          </Route>

          {/* Panel del cliente — mismo layout con sidebar que emprendedor/admin/
              institucional; cada ruta hija conserva su URL de siempre para no
              romper enlaces existentes (NotificationBell, "Mejora tu plan", etc). */}
          <Route
            element={
              <RequireAuth>
                <ClienteLayout />
              </RequireAuth>
            }
          >
            <Route path="/panel" element={<ClienteInicioPage />} />
            {/* A7/A8 — Mis solicitudes */}
            <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} />
            {/* A9 — Perfil del comprador */}
            <Route path="/perfil" element={<PerfilPage />} />
            {/* A10 — Notificaciones */}
            <Route path="/notificaciones" element={<NotificacionesPage />} />
          </Route>

          {/* Autenticación pública (Cliente / Emprendedor) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/verificar-otp" element={<OtpVerificationPage />} />
          <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
          <Route path="/verificar-foto" element={<FotoVerificacionPage />} />

          {/* A1 — Onboarding, primera vez que un cliente nuevo entra */}
          <Route path="/bienvenida" element={<OnboardingPage />} />

          {/* A11 — Centro de Ayuda: contenido único, layout según sesión/rol */}
          <Route element={<AyudaAwareLayout />}>
            <Route path="/ayuda" element={<AyudaPage />} />
          </Route>

          {/* A2 — Contrato de Adhesión y Términos y Condiciones, público */}
          <Route path="/contrato" element={<ContratoPage />} />

          {/* F3 — Cómo funciona, recorrido completo por rol */}
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />

          {/* F4 — Página B2B para universidades y cámaras */}
          <Route path="/universidades" element={<UniversidadesPage />} />

          {/* MÓDULO B — Emprendedor */}
          <Route
            path="/negocio/activar"
            element={
              <RequireAuth>
                <ActivarEmprendedorPage />
              </RequireAuth>
            }
          />
          {/* B1 — recorrido de los 4 pilares, entre activar (B2) y crear la Mini Landing Page (B3) */}
          <Route
            path="/negocio/bienvenida"
            element={
              <RequireAuth>
                <OnboardingEmprendedorPage />
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
            <Route path="analitica" element={<AnaliticaPage />} />
            <Route path="formalizacion" element={<FormalizacionPage />} />
            <Route path="qr" element={<QrVerificacionPage />} />
            <Route path="planes" element={<PlanesPage />} />
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
            <Route path="suscripciones" element={<GestionSuscripcionesPage />} />
            <Route path="insignias" element={<GestionInsigniasPage />} />
            <Route path="usuarios/:id" element={<UserDetailPage />} />
          </Route>

          {/* MÓDULO D / C — Institucional: B2G (cámaras) y universidades comparten
              login y layout; InstitucionalIndexPage decide el dashboard según el
              tipo de cuenta (D2 para cámaras, C2 para universidades). */}
          <Route path="/institucional/login" element={<InstitucionalLoginPage />} />
          <Route
            path="/institucional"
            element={
              <RequireInstitucional>
                <InstitucionalLayout />
              </RequireInstitucional>
            }
          >
            <Route index element={<InstitucionalIndexPage />} />
            {/* C3 — solo tiene sentido para universidades; una cámara nunca ve este link en su nav */}
            <Route path="alumni" element={<SeguimientoAlumniPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
