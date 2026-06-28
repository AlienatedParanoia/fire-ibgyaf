"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function SubmitPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<"competition" | "club">("competition");
  const [allowed, setAllowed] = React.useState(true);
  const [gateLoading, setGateLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) { setGateLoading(false); return; }
      // Respect the admin "allow community submissions" setting (fail open).
      const { data } = await supabase.from("site_settings").select("allow_submissions").eq("id", 1).maybeSingle();
      if (data && data.allow_submissions === false) setAllowed(false);
      setGateLoading(false);
    })();
  }, []);
  const [form, setForm] = React.useState({
    submitted_by_name: "",
    submitted_by_email: "",
    title: "",
    description: "",
    category: "STEM",
    deadline: "",
    registration_link: "",
    organizer: "",
    eligibility: "",
  });

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  if (gateLoading) {
    return (
      <div className="container flex min-h-[40vh] items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-ink-faint" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-md rounded-2xl border border-ink/10 bg-panel p-8 text-center shadow-hard-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/5 text-ink-faint">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-medium text-ink">Submissions are closed</h1>
          <p className="mt-2 text-ink-soft">
            Community submissions are paused right now. Please check back later.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/competitions" className={buttonVariants({})}>Browse competitions</Link>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase not configured — add keys to .env.local.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("community_submissions").insert({
      submitted_by_name: form.submitted_by_name,
      submitted_by_email: form.submitted_by_email,
      type,
      title: form.title,
      description: form.description,
      category: form.category,
      deadline: type === "competition" && form.deadline ? form.deadline : null,
      registration_link: form.registration_link || null,
      organizer: form.organizer || null,
      eligibility: form.eligibility || null,
      status: "pending",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
    toast.success("Submission received — thank you!");
  }

  if (submitted) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-2xl border border-ink/10 bg-panel p-8 text-center shadow-hard-card"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Thank you! 🎉</h1>
          <p className="mt-2 text-muted-foreground">
            Your {type} suggestion has been sent to our team for review. Once approved, it&apos;ll
            appear on F.I.R.E for everyone to discover.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm((f) => ({ ...f, title: "", description: "", deadline: "", registration_link: "" }));
              }}
              className={buttonVariants({ variant: "outline" })}
            >
              Submit another
            </button>
            <Link href="/competitions" className={buttonVariants({})}>
              Browse competitions
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-sm font-medium text-coral">
          <Sparkles className="h-4 w-4" /> Community powered
        </div>
        <h1 className="font-heading text-3xl font-medium text-ink sm:text-4xl">
          Suggest an Opportunity<span className="text-coral">.</span>
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-ink-soft">
          Know a competition or club that should be on F.I.R.E? Submit it below — no account needed.
          Our team reviews every entry.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-ink/10 bg-panel p-6 shadow-hard-card sm:p-8"
      >
        {/* type toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          {(["competition", "club"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                type === t ? "bg-paper text-coral shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Your name *</Label>
            <Input
              id="name"
              required
              value={form.submitted_by_name}
              onChange={(e) => update("submitted_by_name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Your email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.submitted_by_email}
              onChange={(e) => update("submitted_by_email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="title">{type === "competition" ? "Competition" : "Club"} title *</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="desc">Description *</Label>
          <Textarea
            id="desc"
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What is it about? Who is it for?"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          {type === "competition" && (
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="organizer">Organiser / Contact</Label>
            <Input
              id="organizer"
              value={form.organizer}
              onChange={(e) => update("organizer", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="link">Registration / info link</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://"
              value={form.registration_link}
              onChange={(e) => update("registration_link", e.target.value)}
            />
          </div>
        </div>

        {type === "competition" && (
          <div>
            <Label htmlFor="elig">Eligibility</Label>
            <Input
              id="elig"
              placeholder="e.g. Secondary 1–4"
              value={form.eligibility}
              onChange={(e) => update("eligibility", e.target.value)}
            />
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Submitting…" : "Submit for review"}
        </Button>
      </form>
    </div>
  );
}
