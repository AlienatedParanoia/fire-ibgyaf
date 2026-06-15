import { redirect } from "next/navigation";
import { getCurrentUser } from "./supabase/server";
import type { UserRole } from "./types";

/**
 * Guard a server component. Redirects to /login when unauthenticated, or to
 * /dashboard when the role is not permitted. Returns the profile otherwise.
 */
export async function requireUser(allowed?: UserRole[]) {
  const { authUser, profile, supabase } = await getCurrentUser();

  // When Supabase isn't configured we can't authenticate — send to login,
  // which shows a setup notice.
  if (!supabase || !authUser) redirect("/login");
  if (allowed && profile && !allowed.includes(profile.role)) redirect("/dashboard");

  return { authUser, profile, supabase };
}
