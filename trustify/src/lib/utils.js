import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn(): combina clases condicionales y resuelve conflictos de Tailwind.
 * Uso: cn("px-2", isActive && "bg-trust", className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
