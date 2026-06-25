"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, UserCheck, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Teammate = {
  user_id: string;
  full_name: string | null;
  school: string | null;
  grade: string | null;
  message: string | null;
  created_at: string;
};

/**
 * "Looking for teammates" section shown inside a competition's detail modal.
 * Students opt in to be discoverable; others can see who's looking. Reads come
 * from the `competition_teammates` RPC (safe profile fields only).
 */
export function TeammatesPanel({
  competitionId,
  loggedIn,
}: {
  competitionId: string;
  loggedIn: boolean;
}) {
  const [list, setList] = React.useState<Teammate[]>([]);
  const [uid, setUid] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const load = React.useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { setLoading(false); return; }
    const { data: auth } = await supabase.auth.getUser();
    setUid(auth.user?.id ?? null);
    const { data, error } = await supabase.rpc("competition_teammates", { comp: competitionId });
    if (!error) setList((data ?? []) as Teammate[]);
    setLoading(false);
  }, [competitionId]);

  React.useEffect(() => { load(); }, [load]);

  const mine = uid ? list.find((t) => t.user_id === uid) : undefined;
  const others = uid ? list.filter((t) => t.user_id !== uid) : list;

  async function join() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    if (!uid) { toast.error("Please log in again."); return; }
    setBusy(true);
    const { error } = await supabase
      .from("teammate_signups")
      .insert({ user_id: uid, competition_id: competitionId, message: message.trim() || null });
    if (error) { toast.error(error.message); setBusy(false); return; }
    setMessage("");
    await load();
    setBusy(false);
    toast.success("You're listed — others can now find you");
  }

  async function leave() {
    const supabase = getSupabaseBrowser();
    if (!supabase || !uid) return;
    setBusy(true);
    const { error } = await supabase
      .from("teammate_signups")
      .delete()
      .eq("user_id", uid)
      .eq("competition_id", competitionId);
    if (error) { toast.error(error.message); setBusy(false); return; }
    await load();
    setBusy(false);
    toast.success("Removed from the teammate list");
  }

  return (
    <div className="mt-6 border-t border-ink/10 pt-5">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-medium text-ink">
        <Users className="h-5 w-5 text-coral" /> Looking for teammates
        {!loading && list.length > 0 && (
          <span className="rounded-full bg-beige px-2 py-0.5 text-xs font-semibold text-ink">{list.length}</span>
        )}
      </h3>

      {/* action bar */}
      {!loggedIn ? (
        <p className="text-sm text-ink-faint">
          <a href="/login" className="font-semibold text-coral hover:underline">Log in</a> to find or
          join teammates for this competition.
        </p>
      ) : mine ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <UserCheck className="h-4 w-4" /> You&apos;re listed as looking for a team
          </span>
          <Button variant="sketch" size="sm" onClick={leave} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Stop looking
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Optional: skills, what you're looking for…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={140}
            className="flex-1"
          />
          <Button variant="ember" onClick={join} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            I&apos;m looking for a team
          </Button>
        </div>
      )}

      {/* list */}
      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-faint">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : others.length === 0 ? (
        <p className="mt-3 text-sm text-ink-faint">
          {mine ? "No one else is looking yet — you're first!" : "No one is looking for teammates yet. Be the first."}
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {others.map((t) => (
            <li
              key={t.user_id}
              className={cn(
                "rounded-xl border border-ink/10 bg-paper px-4 py-3"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {(t.full_name ?? "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{t.full_name || "A student"}</p>
                  {(t.school || t.grade) && (
                    <p className="flex items-center gap-1 truncate text-xs text-ink-faint">
                      <GraduationCap className="h-3 w-3" />
                      {[t.school, t.grade].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              {t.message && <p className="mt-2 text-sm text-ink-soft">{t.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
