"use client";

import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Hides global chrome (navbar/footer) on the full-screen auth pages so the
 * animated shader background can fill the entire viewport. Children are still
 * rendered on the server; this wrapper only decides whether to display them.
 */
export function HideOnAuthRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (AUTH_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
