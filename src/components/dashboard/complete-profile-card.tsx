"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { GRADE_GROUPS } from "@/lib/grades";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/** Shown when school or grade is blank — e.g. after signing up with Google, which supplies neither. */
export function CompleteProfileCard({
  userId,
  school: initialSchool,
  grade: initialGrade,
}: {
  userId: string;
  school: string | null;
  grade: string | null;
}) {
  const router = useRouter();
  const [school, setSchool] = React.useState(initialSchool ?? "");
  const [grade, setGrade] = React.useState(initialGrade ?? "");
  const [busy, setBusy] = React.useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!school.trim() || !grade) return toast.error("Add your school and grade.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setBusy(true);
    const { error } = await supabase
      .from("users")
      .update({ school: school.trim(), grade })
      .eq("id", userId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <UserRound className="h-5 w-5 text-amber-600" />
        <h2 className="font-heading text-base font-semibold text-charcoal">Finish setting up your profile</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="cp-school">School</Label>
          <Input id="cp-school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Raffles Institution" />
        </div>
        <div>
          <Label htmlFor="cp-grade">Grade / Level</Label>
          <Select id="cp-grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">Select…</option>
            {GRADE_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </div>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </Button>
      </div>
    </form>
  );
}
