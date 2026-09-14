import { cn } from "@/lib/utils";

/** Logo de marca: sello verificado + wordmark "CheckBiz". */
export default function Logo({ className, showText = true }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--trust))" />
            <stop offset="1" stopColor="hsl(var(--trust-soft))" />
          </linearGradient>
        </defs>
        <path
          d="M16 4l10 5.5v8c0 6-4.2 10-10 12-5.8-2-10-6-10-12v-8L16 4z"
          fill="hsl(var(--trust) / 0.08)"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 16.4l3 3 6-7"
          fill="none"
          stroke="hsl(var(--verified))"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          CheckBiz
        </span>
      )}
    </div>
  );
}
