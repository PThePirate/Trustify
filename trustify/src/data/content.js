import {
  Ban, Percent, Truck, UserCheck,
  Search, ShieldCheck, MessageCircle,
  Hash, Smartphone, Camera, Database, ScanFace,
  Palette, Code2, Stethoscope, Box, Scale, Sparkles, GraduationCap, Wrench,
  Star, TrendingUp, QrCode, FileCheck2, Building2, Languages,
} from "lucide-react";

/** Los 4 pilares del "Núcleo Intocable" (propuesta, sección 1.2). */
export const PILARES = [
 { icon: Ban, title: "No tocamos tu dinero", desc: "Acuerda el pago directamente con tu cliente. CheckBiz no retiene fondos." },
 { icon: Percent, title: "No cobramos comisión", desc: "Pagas un plan fijo para publicar. No cobramos por lo que vendes." },
 { icon: Truck, title: "Tú coordinas la entrega", desc: "Acuerda dónde, cómo y cuándo entregar tus productos o servicios." },
 { icon: UserCheck, title: "Todos se identifican", desc: "Quien vende y quien compra verifican su identidad para conversar." },
];

/** Los 3 pasos del flujo (propuesta, sección 3.1). */
export const PASOS = [
  { icon: Search, title: "Busca", desc: "Explora gratis y sin cuenta. Filtra por categoría, ciudad o universidad." },
  { icon: ShieldCheck, title: "Verifica", desc: "Revisa sus sellos y las reseñas de clientes verificados." },
  { icon: MessageCircle, title: "Contacta", desc: "Abre un chat interno para hablar con el negocio y acordar los detalles del servicio." },
];

/** Esquema de identidad en 5 capas (propuesta, sección 9.2). */
export const CAPAS = [
  { n: 1, icon: Hash, title: "Estructura", subtitle: "Módulo 10", desc: "Valida que el número de cédula sea matemáticamente correcto. Filtro instantáneo y sin costo.", estado: "Implementado", tone: "verified" },
  { n: 2, icon: Smartphone, title: "Correo verificado", subtitle: "OTP", desc: "Confirma el correo mediante un código de seis dígitos.", estado: "Implementado", tone: "verified" },
  { n: 3, icon: Camera, title: "KYC documental", subtitle: "Frente y reverso", desc: "Un administrador revisa ambas caras de la cédula. Las imágenes se eliminan después de la decisión.", estado: "Implementado", tone: "trust" },
  { n: 4, icon: ScanFace, title: "Biometría facial", subtitle: "Comparación de rostro", desc: "Comparará el rostro en vivo con la foto de la cédula sin conservar la captura. Pendiente de un motor aprobado.", estado: "Pendiente", tone: "pending" },
  { n: 5, icon: Database, title: "Bases públicas", subtitle: "SENESCYT / SRI", desc: "Cruce con registros externos cuando exista una integración real. No se marca como verificado en este piloto.", estado: "Pendiente", tone: "pending" },
];

/** Métricas de unidad económica (sección 7.3). value numérico para el contador. */
export const METRICAS = [
  { label: "ARPU", value: 6, prefix: "$", suffix: "/mes", note: "por perfil pagante" },
  { label: "CAC", value: 4, prefix: "$", suffix: "", note: "costo de adquisición" },
  { label: "LTV", value: 60, prefix: "$", suffix: "", note: "valor de vida del cliente" },
  { label: "LTV / CAC", value: 15, prefix: "", suffix: "×", note: "saludable > 3×" },
  { label: "Margen neto", value: 90.3, decimals: 1, prefix: "", suffix: "%", note: "año 1 proyectado" },
];

/** Estadísticas grandes para la franja del hero (con contador). */
export const STATS = [
  { value: 100, suffix: "+", label: "Negocios verificados", note: "meta 6 meses" },
  { value: 5, suffix: " capas", label: "Verificación de identidad", note: "esquema tipo banco" },
  { value: 0, prefix: "$", label: "Comisión por venta", note: "núcleo intocable" },
  { value: 15, suffix: "×", label: "Ratio LTV / CAC", note: "unidad económica" },
];

/** Categorías del catálogo (para la cinta marquee). */
export const CATEGORIAS = [
  { icon: Palette, label: "Diseño" },
  { icon: Code2, label: "Software" },
  { icon: Stethoscope, label: "Veterinaria" },
  { icon: Box, label: "Impresión 3D" },
  { icon: Scale, label: "Legal" },
  { icon: Sparkles, label: "Limpieza" },
  { icon: GraduationCap, label: "Tutorías" },
  { icon: Wrench, label: "Mantenimiento" },
];

/** "Qué hace CheckBiz" — grid de características. */
export const CARACTERISTICAS = [
 { icon: ShieldCheck, title: "Tu Mini Landing Page", desc: "Presenta tu negocio con catálogo, imágenes y los sellos de tu perfil." },
 { icon: Star, title: "Reseñas de clientes", desc: "Solo reseña un cliente verificado que conversó con el negocio." },
 { icon: MessageCircle, title: "Conversaciones directas", desc: "Recibe solicitudes y acuerda los detalles por chat, con texto, enlaces y emojis." },
 { icon: FileCheck2, title: "Términos claros", desc: "Términos y Condiciones y Declaración Responsable del Emprendedor." },
 { icon: Building2, title: "Orientación para formalizarte", desc: "Orientación sobre RUC y RIMPE y contacto con consultorios contables." },
 { icon: GraduationCap, title: "Tu comunidad universitaria", desc: "Vincula tu emprendimiento con tu universidad o instituto." },
];

/** Negocios de muestra (estilo showcase de proyectos). */
export const NEGOCIOS_DEMO = [
  { n: "01", nombre: "Aura Design Studio", categoria: "Diseño de marca", nivel: "Nivel 3 · Formalizado", score: 4.9, capas: 4, color: "trust", tag: "Emprendedor Verificado", foto: "" },
  { n: "02", nombre: "VetCare Móvil", categoria: "Veterinaria a domicilio", nivel: "Nivel 2 · Asesoría", score: 4.8, capas: 4, color: "verified", tag: "Alumni Verificado", foto: "" },
  { n: "03", nombre: "Forge 3D Lab", categoria: "Impresión 3D a medida", nivel: "Nivel 3 · Formalizado", score: 5.0, capas: 5, color: "trust-soft", tag: "Potencial Exportable", foto: "" },
  { n: "04", nombre: "Lex Legal", categoria: "Asesoría jurídica", nivel: "Nivel 2 · Asesoría", score: 4.7, capas: 3, color: "verified", tag: "Emprendedor Verificado", foto: "" },
];

/** Comparativa contra alternativas (sección 11). */
export const COMPARATIVA = {
  criterios: ["Identidad verificada", "Contrato legal", "Reseñas auditadas", "Sin comisiones", "Ruta de formalización"],
  columnas: [
    { nombre: "CheckBiz", valores: [true, true, true, true, true], destacado: true },
    { nombre: "Facebook / Instagram", valores: [false, false, false, true, false] },
    { nombre: "Catálogo gremial", valores: [false, false, false, true, false] },
    { nombre: "LinkedIn", valores: [false, false, false, true, false] },
  ],
};

/** Preguntas frecuentes (adelanta objeciones del jurado). */
export const FAQ = [
 { q: "¿Necesito una cuenta para buscar negocios?", a: "No. Los clientes pueden explorar gratis y sin cuenta. Para conversar o reseñar, necesitan una cuenta verificada." },
 { q: "¿Por qué no cobran comisión?", a: "Porque tu venta es tuya. Pagas un plan fijo y no te cobramos nada por lo que vendes." },
 { q: "¿Qué significan los sellos?", a: "Verificado identifica a la persona detrás del perfil. Formalizado indica que el negocio está asociado a un RUC activo. Son independientes, sin puntajes ni niveles." },
 { q: "¿Cómo se verifica la identidad?", a: "El servicio contempla cédula válida, biometría con el Registro Civil, confirmación del correo y aceptación de términos. El emprendedor firma también su Declaración Responsable. En esta versión, la revisión de identidad es manual." },
 { q: "¿Quién puede dejar una reseña?", a: "Solo un cliente verificado que conversó con el negocio por el chat de CheckBiz." },
 { q: "¿Qué gana una universidad?", a: "Visibilidad para sus emprendedores y datos verificados del emprendimiento de estudiantes y graduados, siempre agregados. Puede cubrir sus planes mediante un convenio." },
 { q: "¿Qué plan necesito para publicar?", a: "Necesitas un plan individual o una plaza cubierta por tu universidad. Consulta los beneficios y precios en Planes." },
];

/** Aliados institucionales para el marquee de logos.
 *  Los PNG viven en /public/logos. Se muestran sobre tiles claros para que
 *  se lean igual en modo oscuro y claro. */
export const ALIADOS = [
  { nombre: "Universidad de Guayaquil", logo: "/images/ug.png" },
  { nombre: "ESPOL", logo: "/images/espol.png" },
  { nombre: "UEES", logo: "/images/uees.png" },
  { nombre: "Universidad Católica de Santiago de Guayaquil", logo: "/images/ucsg.png" },
  { nombre: "Universidad Casa Grande", logo: "/images/ucg.png" },
  { nombre: "Universidad Politécnica Salesiana", logo: "/images/salesiana.png" },
  { nombre: "UIDE", logo: "/images/uide.png" },
  { nombre: "Universidad Laica Vicente Rocafuerte", logo: "/images/ulvr.png" },
  { nombre: "Instituto Universitario Bolivariano (ITB)", logo: "/images/itb.png" },
  { nombre: "Tecnológico Espíritu Santo (TES)", logo: "/images/tes.png" },
];

/** Ítems verificables para la Calculadora de Trust Score (suman 100). */
export const TRUST_ITEMS = [
  { id: "cedula", label: "Cédula validada (Módulo 10)", pts: 20 },
  { id: "otp", label: "Teléfono verificado (OTP)", pts: 15 },
  { id: "foto", label: "Foto con cédula", pts: 20 },
  { id: "sri", label: "Registro SENESCYT / SRI", pts: 25 },
  { id: "resenas", label: "Reseñas de clientes verificados", pts: 12 },
  { id: "redes", label: "Redes sociales conectadas", pts: 8 },
];

/** Niveles de formalización según el Trust Score proyectado. */
export const TRUST_NIVELES = [
  { min: 0, label: "Semilla", tone: "pending", desc: "Perfil recién creado" },
  { min: 45, label: "Asesoría", tone: "trust", desc: "En proceso de formalización" },
  { min: 75, label: "Formalizado", tone: "verified", desc: "Máxima confianza" },
];

/** Galería "personas reales" para llenar la landing con imágenes.
 *  foto: deja "" para ver el placeholder animado; pon "/images/xxx.jpg" para tu foto. */
export const PERSONAS = [
  { rol: "Diseñadora de marca", ciudad: "Guayaquil", Icon: Palette, foto: "" },
  { rol: "Veterinario a domicilio", ciudad: "Samborondón", Icon: Stethoscope, foto: "" },
  { rol: "Artesano 3D", ciudad: "Guayaquil", Icon: Box, foto: "" },
  { rol: "Desarrollador de software", ciudad: "Quito", Icon: Code2, foto: "" },
  { rol: "Abogada independiente", ciudad: "Guayaquil", Icon: Scale, foto: "" },
  { rol: "Técnico de mantenimiento", ciudad: "Durán", Icon: Wrench, foto: "" },
];

