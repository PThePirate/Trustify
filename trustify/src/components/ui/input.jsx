import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-xl border border-input bg-card/50 px-4 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/70 focus-visible:border-trust/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust/30 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
