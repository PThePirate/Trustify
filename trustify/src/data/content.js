import {
  Ban, Percent, Truck, UserCheck,
  Search, ShieldCheck, MessageCircle,
  Hash, Smartphone, Camera, Database, ScanFace,
  Palette, Code2, Stethoscope, Box, Scale, Sparkles, GraduationCap, Wrench,
  Star, TrendingUp, QrCode, FileCheck2, Building2, Languages,
} from "lucide-react";

/** Los 4 pilares del "Núcleo Intocable" (propuesta, sección 1.2). */
export const PILARES = [
  { icon: Ban, title: "No procesa dinero", desc: "El pago se acuerda libremente entre las partes, fuera de la app. CheckBiz nunca retiene fondos." },
  { icon: Percent, title: "No cobra comisiones", desc: "Cero comisión sobre la mano de obra o el producto final. Monetizamos la confianza, no la transacción." },
  { icon: Truck, title: "No hace logística", desc: "Sin entregas, despachos ni garantías. Eliminamos toda la carga operativa." },
  { icon: UserCheck, title: "No permite anonimato", desc: "KYC bidireccional obligatorio: vendedor y comprador se identifican con cédula." },
];

/** Los 3 pasos del flujo (propuesta, sección 3.1). */
export const PASOS = [
  { icon: Search, title: "Busca", desc: "Filtra por categoría, ciudad o universidad de origen y encuentra al prestador correcto." },
  { icon: ShieldCheck, title: "Verifica", desc: "Revisa el Trust Score, las capas de verificación y las reseñas auditadas del perfil." },
  { icon: MessageCircle, title: "Contacta", desc: "Un clic a WhatsApp y acuerdas presupuesto, entrega y pago directo con la persona." },
];

/** Esquema de identidad en 5 capas (propuesta, sección 9.2). */
export const CAPAS = [
  { n: 1, icon: Hash, title: "Estructura", subtitle: "Módulo 10", desc: "Valida que el número de cédula sea matemáticamente correcto. Filtro instantáneo y sin costo.", estado: "Implementado", tone: "verified" },
  { n: 2, icon: Smartphone, title: "Titularidad telefónica", subtitle: "OTP", desc: "Confirma una línea móvil real asociada a la cédula vía código por SMS o WhatsApp.", estado: "Implementado", tone: "verified" },
  { n: 3, icon: Camera, title: "Foto de verificación", subtitle: "Cédula + rostro", desc: "Selfie sosteniendo la cédula junto al rostro, con revisión manual del equipo en el piloto.", estado: "Prioridad 1", tone: "trust" },
  { n: 4, icon: Database, title: "Bases públicas", subtitle: "SENESCYT / SRI", desc: "Cruza la cédula con actividad real registrada: título académico o RUC activo. En este piloto la consulta a SENESCYT/SRI está simulada — no se conecta a esas bases todavía.", estado: "Simulado en este piloto", tone: "pending" },
  { n: 5, icon: ScanFace, title: "Biometría", subtitle: "Matching facial", desc: "Verificación automática tipo banco/telecom vía alianza con proveedor de KYC.", estado: "Roadmap", tone: "pending" },
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
  { icon: ShieldCheck, title: "Mini Landing Page verificada", desc: "Carta de presentación llave en mano con catálogo, galería y sello de identidad." },
  { icon: TrendingUp, title: "Trust Score en vivo", desc: "Puntaje de reputación calculado con reseñas auditadas y solicitudes confirmadas." },
  { icon: QrCode, title: "QR de verificación física", desc: "Muestra tu identidad verificada en el local o taller. El fin del anonimato, en vivo." },
  { icon: FileCheck2, title: "Contrato de adhesión digital", desc: "Firma con validez legal (registro de IP, fecha y hora) bajo la Ley de Comercio Electrónico." },
  { icon: Building2, title: "Ruta de formalización + RIMPE", desc: "De negocio semilla a formalizado, con simulador de cuota y conexión contable." },
  { icon: Languages, title: "Potencial exportable", desc: "Catálogo con traducción automática ES↔EN e insignia para negocios listos a exportar." },
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
  { q: "¿Por qué no cobran comisión si todos lo hacen?", a: "Cobrar comisión nos convertiría en intermediario financiero regulado. CheckBiz monetiza la confianza —suscripciones, licenciamiento B2B y publicidad— nunca la transacción." },
  { q: "¿Cómo saben que la cédula es realmente de esa persona?", a: "El Módulo 10 es solo la primera de cinco capas: se suma OTP telefónico, foto con cédula, cruce con SENESCYT/SRI y, a futuro, biometría tipo banco." },
  { q: "¿CheckBiz guarda o mueve el dinero de las ventas?", a: "No. El pago se acuerda directo entre las partes por fuera de la app. No retenemos fondos ni gestionamos entregas." },
  { q: "¿Qué gana una universidad o cámara al aliarse?", a: "Indicadores CACES auditables en tiempo real, seguimiento a graduados y un panel agregado de formalización, sin acceso a datos personales sensibles." },
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
