# Trustify — Frontend

Marketplace de identidad digital verificada. Prototipo para Business Week (UEES),
competencia estilo Shark Tank. **Deadline del pitch: 23 de septiembre.**

Stack: **React + Vite + Tailwind CSS + Framer Motion + Lucide** (base para Shadcn UI).
Tema **claro/oscuro** con estética neón futurista (celeste + azul + verde).

---

## Cómo correrlo en VS Code

Necesitas **Node.js 18+**. Abre la carpeta raíz `trustify` (NO la subcarpeta `src`).

```bash
npm install     # solo la primera vez
npm run dev      # abre http://localhost:5173
```

> Si al instalar te aparece que bloqueó el script de `esbuild` (npm 12+),
> corre una vez: `npm install-scripts approve --all` y luego `npm install`.

El servidor está en `host: true`, así que también lo puedes abrir desde el
**celular en la misma red** o vía Ngrok para la demo con QR.

```bash
npm run build     # compila a /dist
npm run preview   # sirve el build compilado
```

---

## Rutas disponibles

| Ruta | Pantalla |
|------|----------|
| `/` | Landing pública (F1) |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta (con selección de rol) |

---

## Estructura del proyecto

```
src/
├─ index.css                 → Sistema de diseño (tokens, glass, neón, animaciones)
├─ App.jsx                   → Router + ThemeProvider
├─ main.jsx                  → Punto de entrada
├─ lib/utils.js              → cn()
├─ data/content.js           → Contenido (pilares, capas, métricas, FAQ, etc.)
├─ components/
│  ├─ ui/                    → Button, Card, Badge, Input, Label,
│  │                            Reveal, Counter, AuroraBackground, Marquee
│  ├─ brand/                 → VerificationSeal, Logo, MiniLandingPreview
│  ├─ theme/                 → ThemeProvider, ThemeToggle (claro/oscuro)
│  └─ layout/                → PublicNav, PublicFooter
└─ pages/
   ├─ public/LandingPage.jsx → MÓDULO F1
   └─ auth/                  → AuthLayout, LoginPage, RegisterPage
```

## Sistema de diseño

- **Tema:** claro/oscuro con toggle (persistencia en localStorage).
- **Paleta neón:** *trust* (celeste/cian), *trust-soft* (azul), *verified* (verde),
  *pending* (ámbar). Todo en variables CSS: edita `:root` / `.light` en `index.css`.
- **Sello de verificación** animado = símbolo central de marca.
- **Animaciones:** aurora de fondo, contadores, marquee, reveal al scroll, glows,
  bordes neón. Respeta `prefers-reduced-motion`.

---

## Roadmap de construcción (camino crítico del 23 sept)

- [x] **Paso 0** — Sistema de diseño + Landing pública (F1)
- [x] **Paso 0.5** — Landing enriquecida + modo claro/oscuro + Login + Registro
- [x] **Paso 0.7** — Widgets interactivos: calculadora Trust Score, simulador de ahorro, tilt 3D en capas, scanline biométrico, marquee de aliados
- [ ] **Paso 1** — Validador de cédula Módulo 10 en vivo + KYC en capas (A2 + A3 + A3.1)
- [ ] **Paso 2** — Registro emprendedor + contrato + editor Mini Landing (B2 + B3)
- [ ] **Paso 3** — Búsqueda → resultados → Mini Landing Page (A4 + A5 + A6)
- [ ] **Paso 4** — Solicitud + confirmación + Trust Score (A7 + A8)
- [ ] **Paso 5** — Ruta de Formalización + Simulador RIMPE (B8)
- [ ] **Paso 6** — Panel B2G agregado (D2) + QR de verificación (B11)
- [ ] **Backend** — API local (a definir con el equipo)
