"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * "Continue with Google". Goes through Supabase OAuth (the Google provider has to
 * be enabled in the Supabase dashboard); /auth/confirm exchanges the returned
 * code for a session cookie. Works for both log in and sign up.
 */
export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [loading, setLoading] = React.useState(false);

  async function go() {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase is not configured. Add your keys to .env.local.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard` },
    });
    // On success the browser is already navigating to Google.
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      <Button type="button" variant="sketch" size="lg" className="w-full" onClick={go} disabled={loading} noParticles>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.4a12 12 0 0 0 0 11l4-3.1Z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
          </svg>
        )}
        {label}
      </Button>
      <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-ink-faint">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
    </>
  );
}
