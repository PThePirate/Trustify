import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Search, FileCheck2, ArrowRight, ArrowLeft, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";

const PASOS = [
  {
    icon: ShieldCheck,
    tono: "trust",
    titulo: "Confianza verificada, sin anonimato",
    texto: "Cada negocio en CheckBiz está respaldado por una cédula real, verificada en capas — nunca un perfil anónimo.",
  },
  {
    icon: Search,
    tono: "verified",
    titulo: "Busca y compara con criterio",
    texto: "Filtra por categoría, ciudad y nivel de formalización. Cada perfil muestra su Trust Score y reseñas reales.",
  },
  {
    icon: FileCheck2,
    tono: "pending",
    titulo: "Solicita, confirma y reseña",
    texto: "El pago y la entrega se acuerdan directo con el negocio. Solo puedes reseñar después de confirmar que recibiste lo tuyo.",
  },
];

const TONOS = {
  trust: "bg-trust/10 text-trust",
  verified: "bg-verified/10 text-verified",
  pending: "bg-pending/10 text-pending",
};

export default function OnboardingPage() {
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();
  const esUltimo = paso === PASOS.length - 1;
  const actual = PASOS[paso];

  function siguiente() {
    if (esUltimo) navigate("/buscar");
    else setPaso((p) => p + 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <Logo />
        <button onClick={() => navigate("/buscar")} className="text-sm text-muted-foreground hover:text-foreground">
          Saltar
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={paso}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="max-w-sm"
          >
            <div className={`mx-auto grid size-20 place-items-center rounded-3xl ${TONOS[actual.tono]}`}>
              <actual.icon className="size-9" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl">{actual.titulo}</h1>
            <p className="mt-3 text-muted-foreground">{actual.texto}</p>
          </motion.div>
        </AnimatePresence>

        {/* Indicador de pasos */}
        <div className="mt-8 flex gap-2">
          {PASOS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === paso ? "w-6 bg-trust" : "w-1.5 bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 pb-10">
        {paso > 0 ? (
          <Button variant="ghost" onClick={() => setPaso((p) => p - 1)}>
            <ArrowLeft className="size-4" /> Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button variant="trust" size="lg" onClick={siguiente}>
          {esUltimo ? (
            <><Sparkles className="size-4" /> Empezar a explorar</>
          ) : (
            <>Siguiente <ArrowRight className="size-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}