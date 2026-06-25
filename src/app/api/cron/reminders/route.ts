import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lead-times (days before deadline) at which we remind a student.
const BUCKETS = [7, 3, 1];

/**
 * Daily cron (see vercel.json). For each saved/registered competition whose
 * deadline is 7, 3, or 1 days out, sends one reminder: an in-app notification
 * always, plus an email when Resend is configured and the user opted in.
 * Dedup is enforced by a unique (participation_id, days_before) row.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.REMINDER_FROM_EMAIL || "F.I.R.E <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fire-ibgyaf.vercel.app";

  let processed = 0;
  let emailed = 0;
  let skipped = 0;

  const now = new Date();

  for (const bucket of BUCKETS) {
    const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + bucket));
    const targetStr = target.toISOString().slice(0, 10);

    const { data: rows, error } = await admin
      .from("participation")
      .select(
        "id, user_id, status, competitions!inner(id, title, deadline), users!inner(email, full_name, email_reminders)"
      )
      .in("status", ["interested", "registered"])
      .eq("competitions.deadline", targetStr);

    if (error || !rows) continue;

    for (const r of rows as Array<Record<string, unknown>>) {
      const comp = r.competitions as { id: string; title: string; deadline: string };
      const usr = r.users as { email: string | null; full_name: string | null; email_reminders: boolean };

      // Claim this (participation, bucket) — unique constraint blocks duplicates.
      const { error: claimErr } = await admin
        .from("reminders_sent")
        .insert({ participation_id: r.id as string, days_before: bucket });
      if (claimErr) { skipped++; continue; }

      processed++;
      const title = `${bucket} day${bucket === 1 ? "" : "s"} left: ${comp.title}`;
      const body = `Registration for ${comp.title} closes on ${comp.deadline}.`;
      const link = `/competitions?c=${comp.id}`;

      await admin.from("notifications").insert({
        user_id: r.user_id as string,
        type: "deadline",
        title,
        body,
        link,
      });

      if (resendKey && usr.email_reminders && usr.email) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: fromEmail,
              to: usr.email,
              subject: title,
              html:
                `<p>Hi ${usr.full_name || "there"},</p>` +
                `<p>${body}</p>` +
                `<p><a href="${siteUrl}${link}">View competition &rarr;</a></p>` +
                `<p style="color:#888;font-size:12px">You're getting this because you saved this competition on F.I.R.E. ` +
                `Manage reminders from the notification bell.</p>`,
            }),
          });
          if (res.ok) emailed++;
        } catch {
          // email is best-effort; the in-app notification already landed
        }
      }
    }
  }

  return NextResponse.json({ ok: true, processed, emailed, skipped });
}
