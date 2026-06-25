"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BrandLoader } from "./brand-loader";

/**
 * Shows the branded loading screen on every in-app navigation — not just on
 * data-fetch suspense. The App Router's `loading.tsx` fallback only appears
 * when a route actually suspends, but Next prefetches + client-caches routes,
 * so most navigations are instant and never show it. This listens for clicks
 * on internal links and shows the loader until the route changes.
 *
 * The loader itself fades in only after ~160ms (see BrandLoader), so instant
 * navigations mount → unmount before anything is visible — no flicker.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);

  // Navigation finished (path changed) → hide.
  React.useEffect(() => {
    setActive(false);
  }, [pathname]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      // ignore modified clicks / non-primary button / already-handled
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return; // external / mailto / tel
      if (url.pathname === location.pathname) return; // same page (hash/query only)

      setActive(true);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Safety net: never let the loader stick if a navigation is cancelled.
  React.useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 8000);
    return () => clearTimeout(t);
  }, [active]);

  return active ? <BrandLoader /> : null;
}
