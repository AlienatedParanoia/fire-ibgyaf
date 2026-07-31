"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Flame, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Where Supabase sends people after they click the link in the confirmation
 * email. Must point at the /auth/confirm route handler — it is what turns the
 * token in the link into a session cookie. This exact URL also has to be on the
 * Redirect URLs allow-list in the Supabase dashboard or Supabase ignores it.
 */
const confirmRedirectUrl = () => `${window.location.origin}/auth/confirm?next=/dashboard`;

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
  const [resending, setResending] = React.useState(false);
  // Set once signup succeeds but Supabase withheld a session pending email
  // confirmation. Swaps the form for the "check your inbox" panel.
  const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);
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
        emailRedirectTo: confirmRedirectUrl(),
        data: { full_name: form.full_name, school: form.school, grade: form.grade },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // Email-enumeration protection (on by default) makes signUp report success
    // for an address that already has an account — no error, and crucially no
    // email is sent. The giveaway is an empty identities array. Without this
    // check the UI promises a confirmation mail that will never arrive.
    if (!data.session && data.user?.identities?.length === 0) {
      toast.error("That email already has an account. Try logging in instead.");
      return;
    }
    // With "Confirm email" enabled, signUp succeeds with no session — the user
    // must click the emailed link before they can log in.
    if (!data.session) {
      setPendingEmail(form.email);
      return;
    }
    toast.success("Account created! Welcome to F.I.R.E 🔥");
    router.push("/dashboard");
    router.refresh();
  }

  async function onResend() {
    const supabase = getSupabaseBrowser();
    if (!supabase || !pendingEmail) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo: confirmRedirectUrl() },
    });
    setResending(false);
    if (error) {
      // Surfaces the real reason rather than failing silently — most often
      // Supabase's built-in SMTP rate limit, which is a few sends per hour.
      toast.error(error.message);
      return;
    }
    toast.success("Sent again — give it a minute, and check spam.");
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
          {pendingEmail ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-10 w-10 text-coral" strokeWidth={1.5} />
              <h2 className="mt-3 font-heading text-xl font-semibold text-ink">
                Confirm your email
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                We sent a confirmation link to{" "}
                <span className="font-medium text-ink">{pendingEmail}</span>. Click it and
                you&apos;ll be signed in. Check your spam folder if it hasn&apos;t arrived.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5 w-full"
                onClick={onResend}
                disabled={resending}
                noParticles
              >
                {resending && <Loader2 className="h-4 w-4 animate-spin" />}
                {resending ? "Resending…" : "Resend confirmation email"}
              </Button>
              <p className="mt-5 text-sm text-ink-soft">
                <Link href="/login" className="font-medium text-coral hover:underline">
                  Back to log in
                </Link>
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
