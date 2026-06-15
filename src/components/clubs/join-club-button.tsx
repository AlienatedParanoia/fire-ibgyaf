"use client";

import * as React from "react";
import { toast } from "sonner";
import { Users2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function JoinClubButton({ clubId, clubName }: { clubId: string; clubName: string }) {
  const [joined, setJoined] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) return setChecking(false);
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return setChecking(false);
      const { data } = await supabase
        .from("participation")
        .select("id")
        .eq("user_id", auth.user.id)
        .eq("club_id", clubId)
        .maybeSingle();
      setJoined(!!data);
      setChecking(false);
    })();
  }, [clubId]);

  async function join() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Log in to join clubs", {
        action: { label: "Log in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("participation")
      .insert({ user_id: auth.user.id, club_id: clubId, status: "registered" });
    if (!error) {
      await supabase.from("analytics_events").insert({
        event_type: "club_joined",
        user_id: auth.user.id,
        reference_id: clubId,
      });
      setJoined(true);
      toast.success(`You joined ${clubName} 🎉`);
    } else {
      toast.error(error.message);
    }
    setLoading(false);
  }

  if (checking) {
    return (
      <Button size="lg" disabled>
        <Loader2 className="h-4 w-4 animate-spin" /> Loading
      </Button>
    );
  }

  return joined ? (
    <Button size="lg" variant="subtle" disabled>
      <Check className="h-4 w-4" /> You&apos;re a member
    </Button>
  ) : (
    <Button size="lg" onClick={join} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users2 className="h-4 w-4" />}
      Join this club
    </Button>
  );
}
