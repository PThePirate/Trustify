import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Alias "@/..." apunta a /src para imports limpios (estilo Shadcn).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true, // permite abrir desde el celular en la red local / Ngrok
  },
});
