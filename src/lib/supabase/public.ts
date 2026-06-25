import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anonymous Supabase client for caching public reads.
 *
 * The regular server client (server.ts) is bound to request cookies, so it
 * can't be used inside `unstable_cache` (cookies aren't available there).
 * This client reads only RLS-public data (e.g. approved competitions/clubs)
 * and is safe to call from a cached function. Returns null when unconfigured.
 */
export function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
