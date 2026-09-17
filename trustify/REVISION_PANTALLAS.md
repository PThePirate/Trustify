# Revisión de Trustify: frontend y backend

Fecha: 16 de septiembre de 2026.

Comparación del código local con `Trustify_Especificacion_Pantallas.md`. El documento se usa como referencia de alcance: sus instrucciones de diseño o planificación no autorizan cambios adicionales. Esta entrega implementa el registro solicitado; los demás puntos son un diagnóstico, no funcionalidades nuevas.

Frontend: `C:/Users/USER/Downloads/trustify_frontend/trustify`.
Backend: `C:/Users/USER/Downloads/checkbiz_backend/checkbiz-backend`.

“Implementado” significa que existe código de pantalla y su conexión cuando corresponde. No significa que se haya ejecutado un flujo completo con PostgreSQL, SMS y cuentas reales. La existencia de una entidad o tabla no equivale a una funcionalidad terminada.

## Cambios de esta entrega

- Registro: errores por campo, borde rojo y texto explicativo mientras se escribe, al salir del campo y al intentar enviar. Los errores desaparecen al corregir el valor. Los campos sin tocar no empiezan en rojo.
- Nombre: de 3 a 80 caracteres, manteniendo el mínimo que ya exigía la API.
- Correo: máximo 80 caracteres, `@` y una dirección completa.
- Teléfono: exactamente 10 dígitos. Los caracteres inválidos permanecen visibles para explicar el error; no se elimina ni se trunca silenciosamente lo escrito.
- País del teléfono: Ecuador, Colombia, México y Estados Unidos, con prefijo visible y Ecuador seleccionado inicialmente. No representa nacionalidad ni cambia el documento de identidad requerido. Ampliar el catálogo requerirá definir formatos de teléfono de longitudes distintas.
- Cédula: 10 dígitos y comprobación local equivalente al Módulo 10 existente en Kotlin. Aunque la petición dice “hasta 10”, no se aceptan cédulas incompletas porque la verificación actual requiere los 10. El texto de ayuda habla del documento, no del backend.
- Contraseña: entre 8 y 80 caracteres; botón accesible para mostrar/ocultar con iconos de ojo. Se mantiene el mínimo de 8 que ya tenía la API.
- API: validaciones de tamaño y teléfono alineadas; recibe y devuelve `pais`; errores de validación/duplicado se muestran en el campo correspondiente.
- Persistencia: migración `V2__usuario_pais.sql` agrega `usuarios.pais`; asigna `EC` a cuentas previas del piloto. Se guarda el teléfono local y el país por separado; la integración futura de SMS debe formar el número internacional correctamente.
- Contraseñas nuevas: PBKDF2 de Spring Security para admitir 80 caracteres sin el límite de 72 bytes de BCrypt. Se conservan verificadores para hashes BCrypt anteriores, sin modificar contraseñas existentes. La configuración se comparte con el acceso de administradores. Referencia: [almacenamiento de contraseñas de Spring Security](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html).

## Estado por pantalla

| Pantallas | Estado observado | Qué falta |
|---|---|---|
| A1 / B1: onboarding | Parcial | Hay landing explicativa y selección cliente/emprendedor. Falta el recorrido específico de 2–3 pasos y el onboarding dedicado al emprendedor. |
| A2: registro | Implementación ampliada en esta entrega | El enlace de T&C apunta a la propia página; falta contenido real, accesible y versionado del contrato. La unicidad se consulta al enviar, no mediante una consulta previa. |
| A3: OTP | Parcial, envío simulado | Hay seis casillas, reenvío y verificación en API. Faltan proveedor SMS/WhatsApp, cambiar número y tratamiento completo de errores/cooldown. |
| A3.1: foto | Parcial | Existe carga y revisión administrativa. Falta llevar al comprador a este paso tras OTP, guía visual/encuadre, cámara integrada, plazo de revisión y entrega real de notificaciones. |
| A4 / A5: búsqueda | Parcial y conectada | Hay búsqueda por texto, categoría, ciudad y nivel, resultados y orden por nombre/relevancia. Faltan autocompletado, universidad, rating mínimo, distancia/geolocalización, Premium, anuncios y alternar lista/grid. Las tarjetas muestran Trust Score, no una valoración media con tarifa. |
| A6: perfil público | Parcial y conectado | Tiene portada/logo si hay URL, datos, capas, catálogo básico, WhatsApp y solicitud. Faltan galería, fotos de los ítems, video Premium, reseñas individuales, sellos y QR. La insignia de “Verificado” es incondicional. |
| A7 / A8: solicitud y reseña | Base implementada | Crear solicitud, fecha, confirmar y reseñar están conectados. Falta transición “en conversación”, bandeja del prestador y exigir verificación del comprador en el servicio. |
| A9: perfil comprador | Parcial | Existe “Mis solicitudes” con reseñas; falta pantalla de datos de la cuenta y gestión del perfil. |
| A10 / A11: notificaciones y ayuda | Pendiente en frontend | Hay entidad de notificaciones y generación al revisar fotos, pero no bandeja/API pública de lectura ni entrega push/email. Hay moderación de denuncias, pero no formulario público de reportes/FAQ dedicado. |
| B2: activación emprendedor | Parcial y con cruce simulado | Se guarda aceptación con IP/fecha/user-agent. Falta contrato visible y versionado, integración SENESCYT/SRI y condiciones consistentes de avance de KYC. La categoría se elige posteriormente en el editor. |
| B3 / B4: editor y catálogo | Parcial y conectado | CRUD básico y publicar/despublicar existen. Faltan carga de portada/logo/fotos de productos, vista previa en tiempo real móvil/escritorio, límite de tres productos gratis y contador de cupos por plan. |
| B5: bandeja del emprendedor | Pendiente | No hay pantalla ni endpoints para solicitudes recibidas y cambio a “en conversación”. |
| B6: reputación | Pendiente como módulo | Se muestra el campo Trust Score y se guardan reseñas, pero no se recalcula el puntaje ni existe desglose/lista con respuestas públicas. |
| B7: analítica | Pendiente | Existe `AnaliticaEvento`, pero no captura conectada de eventos, API agregada ni gráficos del negocio. |
| B8: formalización / RIMPE | Pendiente | Existe entidad `RutaFormalizacion`, pero no pantalla, reglas de avance, checklist, simulador ni conexión al consultorio. El simulador de ahorro de marketing no equivale al de formalización. |
| B9: planes | Pendiente como flujo SaaS | Entidades de planes/suscripciones no incluyen un recorrido de contratación, cobro, activación y aplicación de beneficios. |
| B9.1: Elite | Pendiente | Multiusuario, traducción, comparativas, certificado PDF y sincronización WhatsApp Business. |
| B10 / B11: insignias y QR | Pendiente | Existen entidades, pero no gestión de insignias, generación de QR ni pantalla para imprimirlo. |
| B12: cuenta/seguridad | Parcial | Hay cierre de sesión. Faltan edición de cuenta, cambio/recuperación de contraseña y eliminación. |
| C1–C5: universidades | Pendiente | Existen entidades institucionales/alumni, pero no autenticación institucional, permisos, dashboards, egresados, convenios ni reportes. |
| D1–D4: cámaras / B2G | Pendiente | No existen rutas operativas de acceso institucional, panel agregado, detalle anonimizado ni exportación. |
| E1 / E2: admin y KYC | Base implementada | Login, cola de fotos, aprobar/rechazar, búsqueda y ficha de usuario conectados. Faltan pruebas integrales y endurecer acceso a imágenes sensibles. |
| E3: moderación | Parcial | Listado/resolución de denuncias existen. Falta moderación específica de reseñas y el origen público de las denuncias. |
| E4: veto | Parcial | Bloqueo implementado. `listarVetosRecientes()` devuelve `[]`; falta GET e historial real. Revisar la invalidez inmediata de sesiones previas al veto. |
| E5: categorías | Base implementada | Listar, crear y activar/desactivar conectados. |
| E6 / E7: suscripciones e insignias | Pendiente | No hay gestión administrativa conectada de licencias/suscripciones ni configuración co-branded. |
| E8: auditoría | Base implementada | Existe listado de logs y registros para acciones administrativas. Revisar cobertura completa y filtros/exportación si son necesarios. |
| F1: landing | Implementada como marketing | Usa contenido y negocios demo. No confundir estadísticas ni calculadoras de la landing con datos operativos. Verificar los CTA y contenido de alianzas antes de publicar. |
| F2: directorio SEO | Parcial | Se puede navegar sin login, pero faltan trabajo SEO por negocio, metadatos y estrategia de indexación. |
| F3 / F4: páginas explicativas/B2B | Parcial o pendiente | Hay secciones en la landing; faltan las páginas dedicadas y el recorrido institucional. |

## Problemas concretos que conviene resolver primero

1. **El comprador omite la foto.** `OtpVerificationPage.jsx` navega a `/` para cliente y a `/verificar-foto` solo para emprendedor. Contradice el recorrido A3.1 compartido.
2. **La verificación puede aparentar más de lo que comprueba.** `EmprendedorService.consultarSenescytSri()` devuelve siempre `verificado`; la activación solo rechaza foto `no_iniciada` y permite `en_revision` o `rechazada`, elevando `kycLayer` a 4. `MiniLandingPublicaPage.jsx` muestra la insignia “Emprendedor Verificado” sin comprobar ese estado. Debe distinguirse una simulación de una verificación real.
3. **Fotos de identidad expuestas por URL.** `ArchivoService` las guarda en `/uploads`; `SecurityConfig` permite `/uploads/**` públicamente y `WebConfig` sirve ese directorio. Deben separarse fotos públicas del negocio y documentos privados con autorización para propietario/revisor.
4. **El límite de intentos OTP necesita revisión transaccional.** El incremento de `otp.intentos` se guarda y luego se lanza `AppException`, que hereda `RuntimeException`, dentro de métodos `@Transactional`. El rollback puede deshacer el contador. Es una conclusión del código que requiere una prueba de integración con base de datos. También se registra el código OTP en logs incluso fuera de modo desarrollo.
5. **Reseñas “auditadas” incompletas.** `SolicitudService` comprueba propiedad de la solicitud, confirmación y duplicados, pero no KYC del cliente ni evita solicitar/reseñar el propio negocio. La ruta exige autenticación, no esos requisitos.
6. **Trust Score está almacenado, pero no calculado.** Búsqueda en servicios y migraciones no encontró asignación de puntaje ni trigger de cálculo; el campo nace en cero. La calculadora de marketing no actualiza negocios.
7. **Contratos inaccesibles desde registro.** El enlace `to="#"` no permite leer aquello que se acepta. El registro de IP/fecha no sustituye disponer del contenido aceptado y su versión.
8. **Errores de red y navegación.** Resultados no captura fallos de carga; el editor interpreta cualquier fallo al obtener el negocio como “todavía no existe”. La navegación móvil del emprendedor no incluye los enlaces Mini Landing/Catálogo que sí aparecen en escritorio.

## Orden de trabajo sugerido para completar la demo

1. Cerrar registro → OTP → foto para ambos roles, contrato legible y estados KYC coherentes. Proteger las fotos.
2. Completar editor con imágenes y límite del catálogo gratuito; mostrar la verificación real en el perfil público.
3. Conectar bandeja del emprendedor → conversación → confirmación → reseña y recalcular Trust Score.
4. Construir B8: ruta de formalización y simulador con reglas vigentes verificadas; los valores tributarios del documento no se han validado en esta revisión.
5. Construir D1/D2 con permisos institucionales y datos agregados.
6. Generar B11: QR dinámico que abra el perfil publicado.
7. Completar B7/B9 si se pretende demostrar valor y contratación Premium. Los módulos P2/P3 pueden seguir como pendientes explícitos.

## Validación de esta entrega y puesta en marcha

- Frontend: `node --test src/lib/registroValidation.test.js`, cinco pruebas correctas.
- Frontend: `npm run build`, compilación correcta.
- Backend: Gradle 8.9 con Java 21, tarea `test`, tres pruebas correctas. Incluyen límites y teléfono, contraseña Unicode de 80 caracteres, diferencia en caracteres finales y acceso BCrypt anterior.
- Navegador: se comprobaron los cinco campos inválidos con borde rojo y `aria-invalid=true`, y su recuperación al corregirlos; el ojo cambia el tipo de campo y el país cambia el prefijo.
- No se crearon cuentas ni se enviaron SMS durante estas comprobaciones. No se ejecutó la migración contra la base de datos ni una prueba completa de registro/persistencia.
- Reiniciar el backend con el código actualizado para que Flyway aplique V2 antes de usar el registro nuevo. Si se ejecuta mediante Docker, reconstruir la imagen del servicio backend; no borrar volúmenes de PostgreSQL.
- El nombre de marca sigue mezclando CheckBiz/Trustify en el repositorio; se conserva en esta entrega y conviene unificarlo antes de la demo.
