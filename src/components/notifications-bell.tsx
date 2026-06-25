"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import type { Notification } from "@/lib/types";

/** Navbar bell: unread count, recent notifications, and the email-reminder toggle. */
export function NotificationsBell({
  userId,
  emailReminders,
}: {
  userId: string;
  emailReminders: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Notification[]>([]);
  const [emails, setEmails] = React.useState(emailReminders);
  const ref = React.useRef<HTMLDivElement>(null);

  const unread = items.reduce((n, x) => n + (x.read ? 0 : 1), 0);

  const load = React.useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data ?? []) as Notification[]);
  }, [userId]);

  React.useEffect(() => { load(); }, [load]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function markAllRead() {
    const supabase = getSupabaseBrowser();
    if (!supabase || unread === 0) return;
    setItems((l) => l.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
  }

  async function markRead(n: Notification) {
    if (n.read) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setItems((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    await supabase.from("notifications").update({ read: true }).eq("id", n.id);
  }

  async function toggleEmails() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const next = !emails;
    setEmails(next);
    const { error } = await supabase.from("users").update({ email_reminders: next }).eq("id", userId);
    if (error) { setEmails(!next); toast.error(error.message); return; }
    toast.success(next ? "Email reminders on" : "Email reminders off");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); if (!open) load(); }}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(33,30,24,0.12)] text-ink-soft transition-colors hover:bg-paper hover:text-ink"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-[rgba(33,30,24,0.12)] bg-panel shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[rgba(33,30,24,0.08)] px-3 py-2.5">
              <span className="text-sm font-semibold text-ink">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-ink-faint transition-colors hover:text-ember"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-ink-faint">
                  No notifications yet. We&apos;ll nudge you before saved deadlines.
                </p>
              ) : (
                items.map((n) => {
                  const inner = (
                    <div
                      className={cn(
                        "flex gap-2.5 px-3 py-3 transition-colors hover:bg-paper",
                        !n.read && "bg-ember/[0.04]"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          n.read ? "bg-transparent" : "bg-ember"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        {n.body && <p className="mt-0.5 text-xs text-ink-soft">{n.body}</p>}
                        <p className="mt-1 text-[11px] text-ink-faint">{formatDate(n.created_at)}</p>
                      </div>
                    </div>
                  );
                  return n.link ? (
                    <Link key={n.id} href={n.link} onClick={() => { markRead(n); setOpen(false); }}>
                      {inner}
                    </Link>
                  ) : (
                    <button key={n.id} onClick={() => markRead(n)} className="block w-full text-left">
                      {inner}
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={toggleEmails}
              className="flex w-full items-center justify-between border-t border-[rgba(33,30,24,0.08)] px-3 py-2.5 text-sm transition-colors hover:bg-paper"
            >
              <span className="flex items-center gap-2 text-ink-soft">
                <Mail className="h-4 w-4" /> Email reminders
              </span>
              <span
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors",
                  emails ? "bg-ember" : "bg-ink/20"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
                    emails ? "left-[18px]" : "left-0.5"
                  )}
                />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
