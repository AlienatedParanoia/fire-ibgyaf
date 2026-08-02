import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Server-side sign-out, reachable by GET as well as POST so a server guard can
 * simply redirect here. The sign-out control in the navbar is no use to a
 * session that can't render a page — e.g. one whose profile row has been
 * deleted — because every guarded page bounces it straight back.
 */

/**
 * Looked up, not echoed, so /login can't be made to toast arbitrary text. A Map
 * rather than an object literal: `?reason=constructor` would otherwise resolve
 * off the prototype and toast native function source.
 */
const REASONS = new Map([
  ["no-profile", "Your account is no longer set up. Log in again, or ask an admin for help."],
]);

async function signOut(request: NextRequest) {
  // Session cookies are SameSite=Lax, so they ride a top-level cross-site GET —
  // without this, any page could log our users out with a plain link.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.redirect(new URL("/", request.url), 303);
  }

  const supabase = getSupabaseServer();
  try {
    if (supabase) await supabase.auth.signOut();
  } catch {
    // This is the only way out of a guard that keeps bouncing the user here, so
    // it has to answer with cleared cookies even when Supabase is unreachable.
  }

  // Only an involuntary sign-out has something to explain; logging out on
  // purpose should not land on /login wearing an error toast.
  const reason = request.nextUrl.searchParams.get("reason");
  const message = reason && REASONS.get(reason);
  const dest = new URL(message ? "/login" : "/", request.url);
  if (message) dest.searchParams.set("error", message);

  // 303, not the default 307: 307 preserves the method, so the POST caller
  // would re-POST to /login, which as a page only answers GET.
  const response = NextResponse.redirect(dest, 303);
  // Clear the session cookies on the redirect itself too: if the sign-out
  // write never lands, /login just bounces back into the guard we came from.
  for (const { name } of request.cookies.getAll()) {
    if (name.startsWith("sb-")) response.cookies.delete(name);
  }
  return response;
}

export async function GET(request: NextRequest) {
  return signOut(request);
}

export async function POST(request: NextRequest) {
  return signOut(request);
}
