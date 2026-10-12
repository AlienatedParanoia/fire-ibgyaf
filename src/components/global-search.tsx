"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Users2, Trophy, CornerDownLeft } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Hit {
  key: string;
  kind: "club" | "competition";
  title: string;
  sub: string;
  href: string;
  haystack: string;
}

const MAX_PER_KIND = 6;

/** Cmd/Ctrl+K search across approved clubs and competitions. Data loads on first open. */
export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hits, setHits] = React.useState<Hit[] | null>(null);
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    if (hits) return () => clearTimeout(t);

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setHits([]);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    Promise.all([
      supabase.from("clubs").select("id, name, category, description, school").eq("is_approved", true).limit(500),
      supabase
        .from("competitions")
        .select("id, title, organizer, category, description")
        .eq("is_approved", true)
        .limit(1000),
    ]).then(([clubs, comps]) => {
      if (cancelled) return;
      const out: Hit[] = [];
      for (const c of clubs.data ?? []) {
        out.push({
          key: `club:${c.id}`,
          kind: "club",
          title: c.name,
          sub: [c.category, c.school].filter(Boolean).join(" · "),
          href: `/clubs/${c.id}`,
          haystack: `${c.name} ${c.category ?? ""} ${c.description ?? ""}`.toLowerCase(),
        });
      }
      for (const c of comps.data ?? []) {
        out.push({
          key: `competition:${c.id}`,
          kind: "competition",
          title: c.title,
          sub: [c.organizer, c.category].filter(Boolean).join(" · "),
          href: `/competitions?c=${c.id}`,
          haystack: `${c.title} ${c.organizer ?? ""} ${c.category ?? ""} ${c.description ?? ""}`.toLowerCase(),
        });
      }
      setHits(out);
    });
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, hits]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!hits || !q) return [];
    const words = q.split(/\s+/);
    const match = (h: Hit) => words.every((w) => h.haystack.includes(w));
    const starts = (h: Hit) => (h.title.toLowerCase().startsWith(q) ? 0 : 1);
    const pick = (kind: Hit["kind"]) =>
      hits.filter((h) => h.kind === kind && match(h)).sort((a, b) => starts(a) - starts(b)).slice(0, MAX_PER_KIND);
    return [...pick("club"), ...pick("competition")];
  }, [hits, query]);

  React.useEffect(() => setActive(0), [query]);

  function go(h: Hit) {
    setOpen(false);
    router.push(h.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-10 items-center gap-2 rounded-full border border-[rgba(33,30,24,0.12)] px-3 text-sm text-ink-faint transition-colors hover:bg-paper hover:text-ink"
      >
        <Search className="h-4 w-4" />
        <kbd className="hidden rounded border border-ink/15 px-1.5 text-[11px] font-medium lg:inline">⌘K</kbd>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} label="Search" className="max-w-lg p-4 sm:p-4">
        <div className="flex items-center gap-2 border-b border-ink/10 pb-3 pr-8">
          <Search className="h-5 w-5 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search clubs and competitions…"
            className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        <div className="mt-2 max-h-[50vh] overflow-y-auto">
          {!query.trim() ? (
            <p className="px-2 py-6 text-center text-sm text-ink-faint">Start typing to search.</p>
          ) : hits === null ? (
            <p className="px-2 py-6 text-center text-sm text-ink-faint">Loading…</p>
          ) : results.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-ink-faint">No matches for “{query.trim()}”.</p>
          ) : (
            <ul role="listbox">
              {results.map((h, i) => (
                <li key={h.key} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onClick={() => go(h)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      i === active ? "bg-paper" : ""
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-beige text-ink">
                      {h.kind === "club" ? <Users2 className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium text-ink">{h.title}</span>
                      {h.sub && <span className="block truncate text-xs text-ink-faint">{h.sub}</span>}
                    </span>
                    {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-ink-faint" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </>
  );
}
