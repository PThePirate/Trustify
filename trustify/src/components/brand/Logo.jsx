import { cn } from "@/lib/utils";

/** Marca oficial compartida por las páginas y paneles de CheckBiz. */
export default function Logo({ className, showText = true, markClassName }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <img
        src="/brand/checkbiz-mark.png"
        alt={showText ? "" : "CheckBiz"}
        width="44"
        height="40"
        className={cn("h-10 w-11 shrink-0 rounded-lg object-contain", markClassName)}
      />
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight">CheckBiz</span>
      )}
    </div>
  );
}
