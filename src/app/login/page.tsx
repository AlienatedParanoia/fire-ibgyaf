"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ShaderBackground } from "@/components/ui/lab";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const fieldClass =
  "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/60 focus-visible:ring-offset-transparent";
const labelClass = "text-white/90";

export default function LoginPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
    <div className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated shader background — fills the whole screen */}
      <ShaderBackground className="absolute inset-0 -z-20" />
      {/* Darkening veil to keep the form readable over the shader */}
      <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
          <Link href="/" aria-label="F.I.R.E home" className="inline-flex">
            <Flame
              className="h-10 w-10 text-coral drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            F.I.R.E <span className="font-normal text-white/80">— Achieve your dreams</span>
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Log in to track your opportunities and clubs.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {!isSupabaseConfigured && <SetupNotice />}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className={labelClass}>Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@school.edu.sg"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className={labelClass}>Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-white/70">
            No account?{" "}
            <Link href="/signup" className="font-medium text-fire hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
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
