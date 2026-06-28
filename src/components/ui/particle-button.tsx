"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import { Button, SuccessParticles, usePrefersReducedMotion, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
  /** Show the MousePointerClick affordance icon. Off by default. */
  showIcon?: boolean;
}

/**
 * Button variant that emits a particle burst and a brief press-scale on click.
 *
 * Note: the base `Button` already emits the particle burst on every click, so
 * most of the app gets this effect for free. Reach for `ParticleButton` only
 * when you also want the optional click icon or the `onSuccess` callback.
 */
function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  showIcon = false,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (prefersReduced) {
      onSuccess?.();
      return;
    }
    setShowParticles(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowParticles(false);
      onSuccess?.();
    }, successDuration);
  };

  return (
    <>
      {showParticles && <SuccessParticles originRef={buttonRef} />}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        // The wrapper owns the burst, so suppress the base button's own burst.
        noParticles
        className={cn("relative transition-transform duration-100", showParticles && "scale-95", className)}
        {...props}
      >
        {children}
        {showIcon && <MousePointerClick className="h-4 w-4" />}
      </Button>
    </>
  );
}

export { ParticleButton };
