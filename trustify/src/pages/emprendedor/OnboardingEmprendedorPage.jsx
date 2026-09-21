import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { PILARES } from "@/data/content";

const TONOS = ["bg-danger/10 text-danger", "bg-trust/10 text-trust", "bg-pending/10 text-pending", "bg-verified/10 text-verified"];

/** B1 — recorrido propio de los 4 pilares del Núcleo Intocable, antes de crear la Mini Landing Page. */
export default function OnboardingEmprendedorPage() {
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();
  const esUltimo = paso === PILARES.length - 1;
  const actual = PILARES[paso];

  function siguiente() {
    if (esUltimo) navigate("/negocio");
    else setPaso((p) => p + 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <Logo />
        <button onClick={() => navigate("/negocio")} className="text-sm text-muted-foreground hover:text-foreground">
          Saltar
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Núcleo Intocable — lo que CheckBiz nunca hará
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={paso}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="max-w-sm"
          >
            <div className={`mx-auto grid size-20 place-items-center rounded-3xl ${TONOS[paso % TONOS.length]}`}>
              <actual.icon className="size-9" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl">{actual.title}</h1>
            <p className="mt-3 text-muted-foreground">{actual.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-2">
          {PILARES.map((_, i) => (
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
            <><Sparkles className="size-4" /> Crear mi Mini Landing Page</>
          ) : (
            <>Siguiente <ArrowRight className="size-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
