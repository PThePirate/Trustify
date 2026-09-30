import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import { Link } from "react-router-dom";

export default function PrivacidadPage() {
  return <div className="min-h-screen bg-background"><PublicNav/><main className="container max-w-3xl pt-32 pb-16 space-y-8">
    <h1 className="text-3xl font-bold">Política de Privacidad</h1>
    <section className="panel p-6 space-y-3"><h2 className="text-xl font-semibold">Datos de tu cuenta y perfil</h2><p className="text-muted-foreground">CheckBiz utiliza los datos de registro para identificar tu cuenta y gestionar el acceso. La información que eliges publicar en tu perfil, como nombre de usuario, fotografía y presentación del negocio, puede ser visible para otras personas.</p></section>
    <section className="panel p-6 space-y-3"><h2 className="text-xl font-semibold">Verificación de identidad</h2><p className="text-muted-foreground">En esta versión, el administrador revisa las imágenes del frente y reverso de la cédula. Se almacenan temporalmente de forma privada y se eliminan tras aprobar o rechazar la solicitud. No forman parte de tu perfil público.</p><p className="text-muted-foreground">El modelo contempla una verificación biométrica con el Registro Civil sin conservar la fotografía ni la plantilla facial. Esta integración todavía no está habilitada.</p></section>
    <section className="panel p-6 space-y-3"><h2 className="text-xl font-semibold">Información institucional</h2><p className="text-muted-foreground">El panel universitario está diseñado para mostrar indicadores agregados de su comunidad, sin publicar documentos de identidad ni conversaciones personales.</p></section>
    <section className="panel p-6 space-y-3"><h2 className="text-xl font-semibold">Gestiona tu información</h2><p className="text-muted-foreground">Puedes editar tu perfil y solicitar la eliminación de tu cuenta desde la configuración. El historial relacionado con otras personas puede conservarse según los <Link className="text-trust underline" to="/contrato">Términos y Condiciones</Link>.</p></section>
  </main><PublicFooter/></div>;
}
