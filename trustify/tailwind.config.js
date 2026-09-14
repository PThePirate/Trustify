import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores semánticos de CheckBiz
        trust: {
          DEFAULT: "hsl(var(--trust))",       // celeste/cian eléctrico
          soft: "hsl(var(--trust-soft))",     // azul
        },
        verified: "hsl(var(--verified))",      // verde neón = verificado
        action: "hsl(var(--action))",          // terracota = CTA principal
        pending: "hsl(var(--pending))",        // ámbar = pendiente
        danger: "hsl(var(--danger))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        display: ["Sora", "Avenir Next", "Segoe UI", "sans-serif"],
        sans: ["Manrope", "Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 8px 24px -16px hsl(var(--foreground) / 0.22)",
        "glow-verified":
          "0 8px 24px -16px hsl(var(--verified) / 0.36)",
        "glow-lg": "0 12px 32px -18px hsl(var(--foreground) / 0.28)",
      },
      keyframes: {
        "seal-spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.55" },
          "70%": { transform: "scale(1.25)", opacity: "0" },
          "100%": { transform: "scale(1.25)", opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(8px)" },
        },
        aurora: {
          "0%": { transform: "translate(-10%, -10%) rotate(0deg)" },
          "50%": { transform: "translate(10%, 10%) rotate(180deg)" },
          "100%": { transform: "translate(-10%, -10%) rotate(360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "border-beam": {
          "0%": { "offset-distance": "0%" },
          "100%": { "offset-distance": "100%" },
        },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "seal-spin": "seal-spin 24s linear infinite",
        "seal-spin-rev": "seal-spin 30s linear infinite reverse",
        "pulse-ring": "pulse-ring 3s ease-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        aurora: "aurora 22s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        blink: "blink 1.4s ease-in-out infinite",
        "scale-in": "scale-in 0.5s ease-out both",
      },
    },
  },
  plugins: [animate],
};
