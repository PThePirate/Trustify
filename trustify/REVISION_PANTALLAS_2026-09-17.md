# Revisión de pantallas Trustify — 17 de septiembre de 2026

Referencia: `C:/Users/USER/Downloads/Trustify_Especificacion_Pantallas.md`.

Se compararon rutas, pantallas, clientes API, controladores, servicios, entidades, repositorios y configuración de frontend y backend. El documento adjunto se utilizó como especificación, no como autorización para implementar todo lo que describe. Esta entrega es una revisión; no cambia funcionalidades ni borra datos.

Frontend: `C:/Users/USER/Downloads/trustify_frontend/trustify`.
Backend: `C:/Users/USER/Downloads/checkbiz_backend/checkbiz-backend`.

“Base implementada” significa que existe pantalla y código conectado; no certifica un recorrido completo probado. Una tabla o entidad aislada no equivale a una funcionalidad lista. La revisión anterior del día 16 está desactualizada en onboarding, notificaciones, perfil, denuncias, bandeja, reseñas y Trust Score.

## Hallazgos que bloquean o debilitan los recorridos

1. **Búsqueda pública rota, comprobado en ejecución.** `GET http://localhost:4000/api/negocios`, sin filtros ni autenticación, devolvió **500**. El backend registró `ERROR: function lower(bytea) does not exist`. La consulta con filtros opcionales en `NegocioRepository.buscarPublicados` necesita corregir el tratamiento/tipado de parámetros nulos. No es simplemente que no haya negocios.
2. **Categorías públicas protegidas, comprobado en ejecución.** `GET /api/negocio/categorias-disponibles` sin sesión devolvió **401**. `BuscarPage` y `ResultadosBusquedaPage` usan ese endpoint, pero `SecurityConfig` solo permite públicamente `/api/negocios/**` (plural). Debe existir un acceso público a categorías activas.
3. **Verificación incoherente.** `OtpVerificationPage` manda al cliente a `/bienvenida`, saltando foto. `EmprendedorService.activar` solo impide foto `no_iniciada`: permite pendiente o rechazada, no exige explícitamente OTP completado y eleva `kycLayer` a 4. Su consulta SENESCYT/SRI devuelve siempre `verificado`. `MiniLandingPublicaPage` muestra “Emprendedor Verificado” incondicionalmente. Corregir los estados y no presentar el cruce simulado como una verificación externa real.
4. **Fotos de identidad accesibles sin autorización por su URL.** `ArchivoService` guarda selfies con cédula en `/uploads`; `WebConfig` sirve ese directorio y `SecurityConfig` lo deja público. Separar documentos privados de imágenes comerciales y autorizar propietario/revisor. No se descargaron fotos privadas para esta revisión.
5. **Reseñas propias y de compradores sin verificar.** `SolicitudService.crear` y `dejarResena` no impiden que el propietario solicite y reseñe su propio negocio ni exigen el KYC del comprador. Sí comprueban propiedad de la solicitud, confirmación previa y reseña duplicada. Completar esas reglas antes de llamar a todas las reseñas “auditadas”.
6. **Veto incompleto para sesiones existentes.** `AdminService.vetarCedula` cambia el estado de la cuenta, pero `JwtAuthFilter` acepta los claims sin consultar su estado actual. El veto no invalida de inmediato tokens ya emitidos y la búsqueda pública no excluye explícitamente propietarios vetados. `listarVetosRecientes()` en `adminApi.js` sigue devolviendo `[]`.
7. **Límite OTP con riesgo de rollback.** `OtpService.verificar` incrementa intentos y lanza `AppException` dentro de una transacción; `AuthService.verificarOtp` también es transaccional. Como la excepción es de ejecución, el contador puede revertirse. Falta una prueba real de persistencia de intentos y una política de frecuencia de reenvío. La corrección reciente evita correos automáticos al montar la pantalla, pero no sustituye controles de frecuencia en el servidor.
8. **Lecturas con relaciones diferidas fuera de transacción.** Hay métodos como `obtenerMiNegocio`, `obtenerPublicoPorSlug`, `misSolicitudesRecibidas` y `misSolicitudes` que convierten relaciones LAZY a respuestas sin transacción de lectura ni fetch explícito, con `open-in-view: false`. Riesgo identificado por código de fallos al mostrar negocio, cliente o reseñas; requiere prueba con registros relacionados.
9. **Errores ocultados en interfaz.** El editor interpreta cualquier fallo de carga como “no tienes negocio”; búsqueda y notificaciones tienen promesas sin tratamiento de fallo. `authApi` descarta `error` y detalles de validación, mientras registro intenta leer `err.codigo` y `err.detalles`. Preservar estado HTTP/código/detalles y distinguir ausencia real de fallos de servidor.
10. **País y teléfono desalineados.** Frontend exige 10 números; `RegistroRequest` solo exige longitud 7–15. Registro normaliza el teléfono pero no asigna `req.pais` a la entidad; perfil actualiza el teléfono sin esa normalización. El WhatsApp del perfil público fuerza Ecuador. Alinear almacenamiento, edición y enlaces con el país elegido.
11. **Trust Score ya existe, pero puede quedar desactualizado.** Se recalcula al crear negocio, confirmar solicitud y dejar reseña. No se invoca al aprobar/rechazar foto ni al crear una solicitud nueva, aunque cambia el denominador del porcentaje de cumplimiento. Completar disparadores y definir claramente la fórmula.
12. **Menú móvil incompleto.** `EmprendedorLayout` esconde la navegación lateral en pantallas pequeñas y no ofrece un menú equivalente para catálogo, solicitudes y reputación.

## Estado por pantalla

| Pantalla / prioridad | Estado actual | Pendiente |
|---|---|---|
| A1 — onboarding, P1 | Base implementada: tres pasos en `/bienvenida` | El recorrido actual es posterior al registro; ajustar entrada y CTA si se exige splash antes de crear cuenta. |
| A2 — registro, P1 | Validaciones visuales, país, ojo, unicidad y aceptación | Contrato y T&C legibles: enlace actual `#`. Conectar el documento aceptado a su versión; existe campo `versionDocumento`, pero no contenido accesible. Alinear errores de API. |
| A3 — OTP, P1 | Correo real confirmado por el usuario; seis casillas, pegado y reenvío | La decisión actual es correo, en lugar de SMS/WhatsApp del MD; no contar el correo como teléfono verificado. Cambiar correo/canal de recuperación, espera entre reenvíos, límites del servidor y confirmación visual dedicada. |
| A3.1 — foto, P1 | Carga, vista previa, estado enviado y revisión admin | Incluir comprador, ejemplo visual/guía, plazo estimado, retorno claro tras rechazo y aviso externo email/push. La carga de archivo satisface la alternativa del MD; cámara integrada es una mejora opcional. Proteger archivos. |
| A4 — búsqueda, P1 | Texto y categorías; consulta conectada | Resolver 500/401; autocompletado, universidad, rating mínimo, geolocalización/cercanía, destacados Premium y pauta. |
| A5 — resultados, P1 | Grid, categoría/ciudad/nivel, orden por nombre o relevancia | Errores y reintento, lista alternativa, rating/tarifa en tarjeta, orden por rating/distancia. |
| A6 — perfil público, P1 | Portada/logo desde URL, capas, score, catálogo, reseñas y respuestas, WhatsApp, solicitud y reporte | Carga de imágenes desde editor, fotos de catálogo/galería, video Premium visible con permisos, sellos, QR y estado de verificación real. |
| A7 — solicitud, P1 | Formulario, fecha y aviso de pago externo; estados conectados | Validación de identidad, impedir autosolicitudes, avisos al prestador/cliente y prueba integral. |
| A8 — confirmar/reseñar, P1 | Confirmación, estrellas/comentario y bloqueo de duplicados | Impedir autorreseñas y exigir verificación; asegurar actualización consistente de reputación. |
| A9 — perfil, P2 | Datos, edición de nombre/teléfono, cédula de lectura y capas; historial en Mis solicitudes | Alinear validaciones y país/teléfono; mejorar acceso conjunto a historial/reseñas. |
| A10 — notificaciones, P2 | Bandeja, contador y marcar leídas con API | Actualmente se generan al decidir fotos. Faltan eventos de solicitud/respuesta, avisos externos y manejo de fallos. |
| A11 — ayuda/reportar, P2 | Reporte desde negocio y moderación conectados | Centro FAQ/ayuda dedicado, seguimiento del reporte y comunicación de resolución. |
| B1 — onboarding emprendedor, P1 | Explicaciones en landing/activación | Recorrido específico de los cuatro pilares. |
| B2 — KYC y contrato, P1 | Activación de rol y registro de contrato con IP/fecha/versión | Reglas de avance coherentes, contrato y declaración visibles, aceptación validada en servidor, cruce SENESCYT/SRI real o explícitamente simulado. |
| B3 — editor, P1 | Crear/editar nombre, categoría, descripción, ciudad, WhatsApp y publicar | Subir portada/logo, vista previa móvil/escritorio en vivo y distinguir fallos de carga de ausencia de negocio. |
| B4 — catálogo, P1 | Alta/edición/baja de nombre y precio | Fotos, límite de tres gratis aplicado en servidor, contador de cupos y beneficios por plan. |
| B5 — solicitudes recibidas, P1 | Bandeja, estados y WhatsApp | Notificaciones, coherencia de transiciones y verificación del recorrido con cuentas distintas. |
| B6 — reputación, P1 | Medidor, métricas, cálculo, listado de reseñas y respuesta pública | Actualización ante todos los cambios de sus factores, reglas contra manipulación y desglose de puntos. Antigüedad se muestra, no participa en la fórmula actual. |
| B7 — analítica, P1 | Entidad de eventos | Capturar visitas/clics, agregación, conversión, gráficos y comparativas temporales. |
| B8 — formalización/RIMPE, P1 | Entidad de ruta | Pantalla, checklist, avance, simulador y contacto con consultorio. El simulador comercial de ahorro no cubre esto. El importe tributario del MD no fue validado y no debe asumirse vigente. |
| B9 — planes, P1 | Entidades/semillas y contenido comercial | Comparativa Básico/Pro/Elite conectada, contratación, cobro SaaS, activación y restricciones por plan. |
| B9.1 — Elite, P2 | Sin flujo operativo | Multiusuario/permisos, traducción, comparativas, certificado PDF y WhatsApp Business. |
| B10 — insignias, P2 | Entidades | Reglas de otorgamiento, galería real y progreso. |
| B11 — QR, P1 | Entidad | Generar QR del perfil publicado, mostrar, descargar/imprimir y probar escaneo. |
| B12 — cuenta/seguridad, P2 | Perfil compartido y cierre de sesión | Cambiar/recuperar contraseña y eliminar cuenta con tratamiento de dependencias. |
| C1 — login universidad, P2 | Entidades institucionales | Login, rol y permisos institucionales. |
| C2 — indicadores CACES, P2 | Sin pantalla/API operativa | KPIs reales y gráficos por facultad/carrera. |
| C3 — alumni, P2 | Entidades | Listado filtrable, estados y asociación/verificación de egresados. |
| C4 — convenios, P3 | Sin flujo | Contratos institucionales, renovaciones y facturación. |
| C5 — reportes, P3 | Sin flujo | Exportaciones PDF/Excel. |
| D1 — login cámara, P1 | Sin pantalla/API operativa | Autenticación y permisos propios sin exponer datos sensibles. |
| D2 — panel B2G, P1 | Sin pantalla/API operativa | Totales por nivel/sector y proyección agregada con reglas definidas. |
| D3 — detalle, P2 | Sin flujo | Listados agregados/anonimizados y control de consentimiento cuando corresponda. |
| D4 — reportes, P2 | Sin flujo | Exportaciones institucionales. |
| E1 — login admin, P1 | Base implementada | Verificación integral de acceso y sesiones. |
| E2 — usuarios/KYC, P1 | Búsqueda/ficha, cola y aprobar/rechazar | Fotos privadas, consistencia de revisión y alertas de duplicidad. |
| E3 — moderación, P2 | Denuncias conectadas | Moderación específica de reseñas y avisos al reportante. |
| E4 — veto, P1 | Alta de veto y bloqueo de registro/login | Historial real, efecto inmediato en sesiones y negocios publicados. |
| E5 — categorías, P2 | Listar, crear y activar/desactivar | Resolver acceso público de consulta sin abrir permisos administrativos. |
| E6 — suscripciones/licencias, P2 | Sin flujo operativo | Administración de planes contratados, cobros y licencias. |
| E7 — insignias co-branded, P3 | Entidades | Gestión administrativa y asignación. |
| E8 — auditoría, P3 | Listado y registro de acciones admin | Revisar cobertura; filtros/exportación como mejoras. |
| F1 — landing, P1 | Implementada como marketing | Verificar CTA, alianzas y distinguir métricas/negocios de ejemplo de datos reales. Unificar CheckBiz/Trustify. |
| F2 — directorio SEO, P2 | Rutas públicas de búsqueda/perfil | Resolver búsquedas y completar metadatos por negocio, indexación y sitemap. |
| F3 — cómo funciona, P2 | Sección de landing | Página dedicada con recorrido completo. |
| F4 — universidades, P3 | Sin recorrido institucional dedicado | Página B2B y llamada a contacto. |

## Diseño transversal

Hay tema claro/oscuro, Lucide, Framer Motion, tarjetas e identidad visual compartida. `ThemeProvider` inicia en claro, mientras el MD pide oscuro por defecto. Faltan gráficas operativas y componentes/estados consistentes de error, vacío y carga en varias páginas. La paleta actual difiere de la propuesta original; tratarlo como decisión visual por confirmar, no como fallo funcional que deba cambiarse automáticamente.

## Orden de trabajo

1. Corregir búsqueda y categorías públicas, lecturas de relaciones y manejo de errores.
2. Cerrar KYC de ambos roles, documentos privados, contrato legible, límites OTP y veto efectivo.
3. Completar imágenes del negocio/catálogo, límite gratuito y navegación móvil.
4. Probar con cliente y emprendedor distintos: publicar → buscar → solicitar → conversar → confirmar → reseñar → responder; cerrar reglas y score.
5. Construir formalización/RIMPE, acceso/panel B2G y QR: son pendientes del camino crítico del MD.
6. Completar analítica y planes, también P1 en el documento. Después, P2/P3 institucionales y Elite.

## Alcance de comprobación

En esta revisión se realizaron consultas HTTP de lectura y consulta de los errores recientes del contenedor. Se confirmaron 401 de categorías y 500 de búsqueda. No se crearon cuentas, no se enviaron correos, no se modificó PostgreSQL y no se ejercieron acciones administrativas.

La compilación del frontend y sus cinco pruebas de validación habían pasado en la corrección inmediatamente anterior del OTP; no prueban los módulos faltantes ni los recorridos descritos aquí. No se volvió a ejecutar Gradle ni se realizó una prueba visual completa de todas las pantallas en esta revisión. Los riesgos deducidos del código se distinguen arriba de los fallos comprobados en ejecución.
