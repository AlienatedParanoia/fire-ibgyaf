"use client";

import { usePathname } from "next/navigation";

/**
 * Enter-only page transition. We intentionally avoid exit animations here:
 * with the App Router (streaming + loading.tsx), waiting for an exit animation
 * before mounting the next route causes blank-page flashes. Keying a single
 * div on the pathname re-runs the enter animation on every navigation without
 * ever unmounting into an empty state.
 *
 * The fade is plain CSS because this wrapper sits in the root layout — an
 * animation library imported here would ship on every route, landing included.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <style>{PT_CSS}</style>
      <div key={pathname} className="page-fade">
        {children}
      </div>
    </>
  );
}

const PT_CSS = `
.page-fade{animation:page-fade-in .15s ease-out both;}
@keyframes page-fade-in{from{opacity:0;}to{opacity:1;}}
@media (prefers-reduced-motion: reduce){
  .page-fade{animation:none;}
}
`;
