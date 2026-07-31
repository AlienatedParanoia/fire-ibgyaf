"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

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
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: form.full_name, school: form.school, grade: form.grade },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // When "Confirm email" is enabled (Supabase default), signUp succeeds with
    // no session — the user must click the email link before they can log in.
    if (!data.session) {
      toast.success("Almost there — check your email to confirm your account.");
      return;
    }
    toast.success("Account created! Welcome to F.I.R.E 🔥");
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
            Free forever. Start finding opportunities in seconds.
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-panel p-6 shadow-hard-card sm:p-8">
          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Supabase isn&apos;t configured yet — add keys to <code>.env.local</code> to enable sign up.
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                required
                placeholder="Tan Wei Jie"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                required
                placeholder="Raffles Institution"
                value={form.school}
                onChange={(e) => update("school", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade / Level</Label>
              <Select
                id="grade"
                value={form.grade}
                onChange={(e) => update("grade", e.target.value)}
              >
                {GRADE_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@school.edu.sg"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading} noParticles>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-coral hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
