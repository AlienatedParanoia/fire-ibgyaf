"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { ShaderBackground } from "@/components/ui/lab";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const fieldClass =
  "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/60 focus-visible:ring-offset-transparent";
const labelClass = "text-white/90";

const GRADE_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Local (Singapore)",
    options: ["Secondary 1", "Secondary 2", "Secondary 3", "Secondary 4", "Secondary 5", "JC1", "JC2", "Polytechnic", "ITE"],
  },
  {
    label: "International",
    options: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
  },
];

export default function SignupPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    full_name: "",
    school: "",
    grade: "Secondary 3",
    email: "",
    password: "",
  });

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase is not configured. Add your keys to .env.local.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, school: form.school, grade: form.grade },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Welcome to F.I.R.E 🔥");
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
            Free forever. Start finding opportunities in seconds.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Supabase isn&apos;t configured yet — add keys to <code>.env.local</code> to enable sign up.
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name" className={labelClass}>Full name</Label>
              <Input
                id="full_name"
                required
                placeholder="Tan Wei Jie"
                className={fieldClass}
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="school" className={labelClass}>School</Label>
              <Input
                id="school"
                required
                placeholder="Raffles Institution"
                className={fieldClass}
                value={form.school}
                onChange={(e) => update("school", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="grade" className={labelClass}>Grade / Level</Label>
              <Select
                id="grade"
                className={fieldClass}
                value={form.grade}
                onChange={(e) => update("grade", e.target.value)}
              >
                {GRADE_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label} className="text-ink">
                    {group.options.map((g) => (
                      <option key={g} value={g} className="text-ink">
                        {g}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className={labelClass}>Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@school.edu.sg"
                className={fieldClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className={labelClass}>Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="At least 6 characters"
                className={fieldClass}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-fire hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
