"use client";

import * as React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { InterestsDialog } from "@/components/interests-dialog";

/**
 * Dashboard nudge shown when a student hasn't picked any interests yet.
 * Disappears once interests are saved.
 */
export function InterestsPrompt({ initialInterests }: { initialInterests: string[] }) {
  const [interests, setInterests] = React.useState<string[]>(initialInterests);
  const [open, setOpen] = React.useState(false);

  if (interests.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ember/30 bg-ember/5 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/15 text-ember">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold text-ink">Personalise your feed</p>
          <p className="text-sm text-ink-soft">
            Tell us which categories you care about and we&apos;ll surface the right competitions for you.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ember/90"
        >
          Pick your interests <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <InterestsDialog
        open={open}
        onClose={() => setOpen(false)}
        initialInterests={interests}
        onSaved={setInterests}
      />
    </div>
  );
}
