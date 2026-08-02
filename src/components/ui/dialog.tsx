"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Every open modal registers here, innermost last. */
const stack: symbol[] = [];

/**
 * Reference-counted body scroll lock plus Escape handling, so nesting modals
 * keeps the page locked until the last one closes and one Escape press only
 * dismisses the topmost. Exported for modals that render their own overlay.
 */
export function useModalStack(open: boolean, onClose: () => void) {
  const close = React.useRef(onClose);
  React.useEffect(() => {
    close.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    const id = Symbol("modal");
    stack.push(id);
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && stack[stack.length - 1] === id) close.current();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // splice(-1) would drop another modal's entry and unlock the page under it.
      const i = stack.indexOf(id);
      if (i > -1) stack.splice(i, 1);
      if (!stack.length) document.body.style.overflow = "";
    };
  }, [open]);
}

/**
 * Moves focus into the panel while it is open, restores it to whatever was
 * focused before, and returns a keydown handler that cycles Tab inside it.
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const panel = ref.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.focus();
    return () => {
      previous?.focus();
    };
  }, [ref, active]);

  return React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = ref.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      const first = items[0];
      const last = items[items.length - 1];
      const focused = document.activeElement;
      if (!first) {
        e.preventDefault();
        panel.focus();
      } else if (e.shiftKey && (focused === first || focused === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && focused === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [ref]
  );
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Accessible name for a dialog that draws its own heading instead of `title`. */
  label?: string;
}

export function Dialog({ open, onClose, children, className, title, label }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useModalStack(open, onClose);
  const onKeyDown = useFocusTrap(panelRef, open && mounted);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title && label ? label : undefined}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className={cn(
              "relative z-10 my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-charcoal/10 bg-white p-6 shadow-2xl outline-none sm:p-8",
              className
            )}
          >
            {title && (
              <h2 id={titleId} className="mb-4 pr-8 font-heading text-xl font-semibold text-charcoal">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
