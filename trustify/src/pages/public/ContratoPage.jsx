import { Link } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

const VERSION_DOCUMENTO = "v1";
const FECHA_VIGENCIA = "21 de septiembre de 2026";

function Seccion({ id, titulo, children }) {
  return (
    <div id={id} className="panel scroll-mt-24 space-y-3 p-6">
      <h2 className="font-display text-lg font-bold">{titulo}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export default function ContratoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-trust/10 text-trust">
            <FileText className="size-6" />
          </span>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Términos, Condiciones y Contrato de Adhesión
          </h1>
          <p className="mt-1 text-muted-foreground">
            Documento {VERSION_DOCUMENTO} — vigente desde el {FECHA_VIGENCIA}.
          </p>
        </div>

        <div className="space-y-6">
          <Seccion id="sobre-este-documento" titulo="Sobre este documento">
            <p>
              CheckBiz es un prototipo académico (Business Week — UEES) que
              actúa como directorio y verificador de identidad, no como
              plataforma financiera ni de intermediación comercial. Este
              documento describe en lenguaje claro lo que aceptas al crear
              una cuenta, tanto si eres cliente/comprador como si activas un
              perfil de emprendedor.
            </p>
            <p>
              Cada vez que aceptas este documento en el registro o en la
              activación de tu perfil de emprendedor, CheckBiz guarda tu
              dirección IP y la fecha/hora exactas de la firma, junto con la
              versión de este texto que aceptaste. Si el contenido cambia, se
              publica una nueva versión y se te pedirá aceptarla de nuevo.
            </p>
          </Seccion>

          <Seccion id="nucleo-intocable" titulo="1. El Núcleo Intocable">
            <p>
              Estas cuatro reglas no cambian sin importar el plan contratado
              ni el tipo de cuenta:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">No procesamos dinero.</strong>{" "}
                El pago se acuerda libremente entre las partes, fuera de la
                app. CheckBiz nunca retiene, gestiona ni garantiza fondos.
              </li>
              <li>
                <strong className="text-foreground">No cobramos comisión</strong>{" "}
                sobre la mano de obra ni el producto final. Monetizamos la
                confianza (suscripciones), no la transacción.
              </li>
              <li>
                <strong className="text-foreground">No hacemos logística.</strong>{" "}
                Sin entregas, despachos, devoluciones ni garantías gestionadas
                por CheckBiz.
              </li>
              <li>
                <strong className="text-foreground">No permitimos anonimato.</strong>{" "}
                Verificación de identidad (KYC) obligatoria y bidireccional:
                tanto quien ofrece como quien contrata un servicio se
                identifica con cédula.
              </li>
            </ul>
          </Seccion>

          <Seccion id="verificacion-identidad" titulo="2. Verificación de identidad y datos personales">
            <p>
              Al registrarte aceptas que CheckBiz valide tu cédula (Módulo
              10), tu número de teléfono mediante un código de un solo uso, y
              — si activas un perfil de emprendedor — que se realice un cruce
              con bases públicas (SENESCYT/SRI) para confirmar actividad
              académica o comercial registrada a tu nombre.
            </p>
            <p>
              La foto de verificación (selfie con cédula) se almacena de
              forma privada: solo tú y el equipo de revisión pueden acceder a
              ella; nunca se publica en tu perfil ni es visible por otros
              usuarios.
            </p>
            <p>
              Puedes solicitar la eliminación de tu cuenta en cualquier
              momento desde tu perfil. La eliminación cierra tu sesión de
              inmediato; los datos legalmente exigibles (como el registro de
              esta firma) se conservan el tiempo que la ley requiera.
            </p>
          </Seccion>

          <Seccion id="uso-aceptable-veto" titulo="3. Uso aceptable y veto">
            <p>
              Está prohibido crear cuentas falsas, suplantar identidad,
              reseñar tu propio negocio o solicitar servicios a tu propia
              cuenta de emprendedor. El equipo de moderación puede vetar una
              cédula ante denuncias fundamentadas; un veto cierra la sesión
              del usuario en todos sus dispositivos de inmediato y bloquea
              futuros registros e inicios de sesión con esa cédula.
            </p>
          </Seccion>

          <Seccion id="planes-y-suscripciones" titulo="4. Planes y suscripciones (aplica a emprendedores)">
            <p>
              Los planes Pro y Elite desbloquean beneficios adicionales
              (más ítems de catálogo, video de presentación, analítica
              avanzada, catálogo bilingüe, entre otros) descritos en la
              pantalla de Planes de tu panel de emprendedor. CheckBiz no
              procesa el cobro de la suscripción dentro de la app — se
              coordina directamente con el equipo, en línea con el Núcleo
              Intocable de no procesar dinero.
            </p>
          </Seccion>

          <Seccion id="cuentas-institucionales" titulo="5. Cuentas institucionales (cámaras y universidades)">
            <p>
              Las cuentas institucionales acceden únicamente a datos
              agregados o a información de sus propios egresados que hayan
              solicitado y confirmado la asociación con esa institución.
              Ninguna institución tiene acceso a datos de negocios ni
              usuarios ajenos a su alcance autorizado.
            </p>
          </Seccion>

          <Seccion id="alcance-del-proyecto" titulo="6. Alcance del proyecto">
            <p>
              CheckBiz es un prototipo desarrollado con fines académicos y de
              validación de un modelo de negocio. Algunas verificaciones
              (por ejemplo, biometría facial) están planeadas en el roadmap y
              no están activas en esta versión; las capas activas se indican
              explícitamente en la pantalla "Identidad en capas".
            </p>
          </Seccion>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0" /> Al continuar en CheckBiz confirmas que leíste
          y aceptas este documento en su versión {VERSION_DOCUMENTO}.
        </div>
      </div>
    </div>
  );
}
