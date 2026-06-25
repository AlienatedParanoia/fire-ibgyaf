import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for trusted server-side jobs (e.g. the reminders
 * cron). Bypasses RLS — never import this into client components or expose it.
 * Returns null when the service-role key isn't configured.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
