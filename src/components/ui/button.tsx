"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

/**
 * SSR-safe prefers-reduced-motion hook. Implemented locally (not via
 * framer-motion's useReducedMotion) so the base Button's server-render path
 * invokes no framer-motion function — its optimized import resolves to
 * undefined in the server chunk and breaks prerendering.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Disable the click particle burst. Use for buttons that already have their
   * own click/motion animation, or where the burst would be distracting.
   */
  noParticles?: boolean;
}

/**
 * A short burst of particles emanating from the center of `originRef`.
 * Rendered in a fixed overlay so it is never clipped by the button's container.
 */
export function SuccessParticles({
  originRef,
}: {
  originRef: React.RefObject<HTMLElement>;
}) {
  const rect = originRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed z-[9999] h-1.5 w-1.5 rounded-full bg-ember"
          style={{ left: centerX, top: centerY }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
            y: [0, -Math.random() * 50 - 20],
          }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, noParticles, onClick, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);
    const prefersReduced = usePrefersReducedMotion();
    // No celebratory burst on destructive actions (Delete/Remove/Reject).
    const particlesOff = noParticles || variant === "destructive";

    const [show, setShow] = React.useState(false);
    const [burst, setBurst] = React.useState(0);
    const timer = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => () => clearTimeout(timer.current), []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!particlesOff && !prefersReduced && !props.disabled) {
        setShow(true);
        setBurst((b) => b + 1);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setShow(false), 1200);
      }
      onClick?.(e);
    };

    return (
      <>
        {show && !particlesOff && <SuccessParticles key={burst} originRef={innerRef} />}
        <button
          ref={innerRef}
          onClick={handleClick}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </button>
      </>
    );
  }
);
Button.displayName = "Button";

export { Button };
