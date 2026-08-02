import { redirect } from "next/navigation";
import { getCurrentUser } from "./supabase/server";
import type { UserRole } from "./types";

/**
 * Guard a server component. Redirects to /login when unauthenticated, or to the
 * homepage when the role is not permitted. Returns the profile otherwise.
 */
export async function requireUser(allowed?: UserRole[]) {
  const { authUser, profile, supabase, profileError } = await getCurrentUser();

  // When Supabase isn't configured we can't authenticate — send to login,
  // which shows a setup notice.
  if (!supabase || !authUser) redirect("/login");

  // A failed lookup is not a missing profile. Surface it and keep the session —
  // signing someone out over a transient database error would be worse.
  if (profileError) throw new Error(`Could not load your profile: ${profileError.message}`);

  // A live session with no profile row (admin deleted the user) can't reach a
  // single guarded page, so end the session rather than redirect into one.
  if (!profile) redirect("/auth/signout?reason=no-profile");

  // Not /dashboard — that guards itself with requireUser() and would loop.
  if (allowed && !allowed.includes(profile.role)) redirect("/");

  return { authUser, profile, supabase };
}
