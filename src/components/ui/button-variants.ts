import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button class variants. Kept in a NON-client module so server components can
 * call `buttonVariants(...)` directly (e.g. to style a <Link> as a button).
 * The interactive `Button` lives in the "use client" button.tsx.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-ember text-white border-transparent shadow-[3px_3px_0_#211E18] hover:bg-ember-deep hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#211E18]",
        ember:
          "bg-ember text-white border-transparent shadow-[3px_3px_0_#211E18] hover:bg-ember-deep hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#211E18]",
        sketch:
          "bg-transparent text-ink border-[1.5px] border-ink shadow-[3px_3px_0_rgba(33,30,24,.18)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(33,30,24,.28)]",
        outline:
          "border border-ink/15 bg-panel text-ink hover:bg-paper",
        ghost:
          "text-ink hover:bg-paper",
        subtle:
          "bg-ember/10 text-ember hover:bg-ember/15",
        destructive:
          "bg-destructive text-white hover:bg-rose-700 shadow-sm",
        link:
          "text-pen underline-offset-4 hover:underline",
        white:
          "bg-white text-ember hover:bg-white/90 shadow-sm",
        outlineLight:
          "border border-white/50 bg-transparent text-white hover:bg-white/10",
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

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
