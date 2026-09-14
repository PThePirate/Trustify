import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        trust:
          "border border-action bg-action text-[hsl(var(--action-ink))] shadow-glow hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        verified:
          "bg-verified text-[hsl(var(--primary-ink))] font-semibold hover:brightness-110 shadow-glow-verified hover:-translate-y-0.5 active:scale-[0.98]",
        outline:
          "border border-trust bg-transparent text-trust hover:bg-trust/10 hover:-translate-y-0.5",
        ghost: "hover:bg-muted/60 text-foreground",
        secondary: "bg-muted text-foreground hover:bg-muted/70",
        link: "text-trust underline-offset-4 hover:underline",
        danger: "bg-danger text-white hover:brightness-110",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "trust", size: "default" },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
