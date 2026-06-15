import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-fire text-white hover:bg-fire-600 shadow-sm",
        accent: "bg-electric text-white hover:bg-electric-600 shadow-sm",
        outline: "border border-charcoal/15 bg-white text-charcoal hover:bg-muted",
        ghost: "text-charcoal hover:bg-muted",
        subtle: "bg-fire-50 text-fire-700 hover:bg-fire-100",
        destructive: "bg-destructive text-white hover:bg-rose-700 shadow-sm",
        link: "text-electric underline-offset-4 hover:underline",
        white: "bg-white text-fire hover:bg-white/90 shadow-sm",
        outlineLight: "border border-white/50 bg-transparent text-white hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
