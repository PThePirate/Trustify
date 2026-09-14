import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

/**
 * Router principal de CheckBiz.
 * A medida que construyamos cada módulo (A Cliente, B Emprendedor, C/D paneles,
 * E admin) iremos agregando sus rutas aquí.
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* MÓDULO F — Público / Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Próximos módulos (placeholders):
          <Route path="/app/*" element={<ClienteLayout />} />
          <Route path="/negocio/*" element={<EmprendedorLayout />} />
          <Route path="/panel/*" element={<PanelLayout />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
