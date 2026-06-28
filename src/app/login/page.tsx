"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ShaderBackground } from "@/components/ui/animated-shader-hero";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const fieldClass =
  "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/50 focus-visible:ring-offset-transparent";
const labelClass = "text-white/90";

export default function LoginPage() {
  const router = useRouter();
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
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated shader background */}
      <ShaderBackground className="absolute inset-0 -z-20" />
      {/* Darkening veil to keep the form readable over the shader */}
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo variant="light" />
          <h1 className="mt-5 font-heading text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/70">
            Log in to track your opportunities and clubs.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
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
