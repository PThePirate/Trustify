import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/50 text-muted-foreground",
        trust:
          "border-trust/30 bg-trust/10 text-trust",
        verified:
          "border-verified/30 bg-verified/10 text-verified",
        pending:
          "border-pending/30 bg-pending/10 text-pending",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
