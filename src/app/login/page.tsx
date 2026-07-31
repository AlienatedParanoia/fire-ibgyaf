"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // /auth/confirm redirects here with ?error=… when a confirmation link is
  // expired, already used, or missing its token — otherwise those failures are
  // silent. Read it straight off the URL rather than via useSearchParams so the
  // page needs no Suspense boundary, then strip it so a refresh won't re-toast.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("error");
    if (!message) return;
    toast.error(message);
    params.delete("error");
    const query = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase is not configured. Add your keys to .env.local.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="F.I.R.E home" className="inline-flex">
            <Flame className="h-10 w-10 text-coral" fill="currentColor" strokeWidth={1.5} />
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            F.I.R.E <span className="font-normal text-ink-soft">— Achieve your dreams</span>
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Log in to track your opportunities and clubs.
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-panel p-6 shadow-hard-card sm:p-8">
          {!isSupabaseConfigured && <SetupNotice />}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@school.edu.sg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading} noParticles>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-soft">
            No account?{" "}
            <Link href="/signup" className="font-medium text-coral hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <p className="font-semibold">Demo mode</p>
      <p className="mt-0.5">
        Supabase isn&apos;t configured yet. Add keys to <code>.env.local</code> and run the seed script.
        Demo login: <code>student@fire.sg</code> / <code>FirePass123!</code>
      </p>
    </div>
  );
}
