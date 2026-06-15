"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Enter-only page transition. We intentionally avoid AnimatePresence + exit
 * animations here: with the App Router (streaming + loading.tsx), waiting for
 * an exit animation before mounting the next route causes blank-page flashes.
 * Keying a single motion.div on the pathname re-runs the enter animation on
 * every navigation without ever unmounting into an empty state.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
