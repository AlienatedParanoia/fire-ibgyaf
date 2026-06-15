import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Server-side Supabase client bound to the request cookies.
 * Returns null when env vars are missing so pages can render a setup notice.
 */
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // called from a Server Component — safe to ignore (middleware refreshes)
        }
      },
    },
  });
}

/** Convenience: fetch the current auth user + profile, or null. */
export async function getCurrentUser() {
  const supabase = getSupabaseServer();
  if (!supabase) return { authUser: null, profile: null, supabase: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { authUser: null, profile: null, supabase };
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  return { authUser: user, profile, supabase };
}
