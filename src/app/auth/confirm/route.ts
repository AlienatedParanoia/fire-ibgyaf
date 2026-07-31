import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Landing point for the links Supabase emails out — signup confirmation,
 * password recovery, email change, invites.
 *
 * Supabase sends the recipient to its own /auth/v1/verify endpoint, which then
 * redirects here with either a PKCE `code` (what @supabase/ssr's browser client
 * issues) or a `token_hash` + `type` pair. Either has to be exchanged
 * server-side before a session cookie exists — pointing `emailRedirectTo` at a
 * plain page instead just drops the token and leaves the user logged out.
 */

/** Only same-origin absolute paths — never "//evil.com" or a full URL. */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

function failed(request: NextRequest, message: string) {
  const dest = new URL("/login", request.url);
  dest.searchParams.set("error", message);
  return NextResponse.redirect(dest);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));

  // Supabase reports its own failures (expired or already-used link) this way.
  const reported = searchParams.get("error_description") ?? searchParams.get("error");
  if (reported) return failed(request, reported);

  const supabase = getSupabaseServer();
  if (!supabase) return failed(request, "Supabase is not configured.");

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failed(request, error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return failed(request, error.message);
  } else {
    return failed(request, "That confirmation link is missing its token.");
  }

  return NextResponse.redirect(new URL(next, request.url));
}
