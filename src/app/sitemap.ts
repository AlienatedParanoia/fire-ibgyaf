import type { MetadataRoute } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://projectfire.dev";

const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/competitions", priority: 0.9 },
  { path: "/clubs", priority: 0.8 },
  { path: "/profiles", priority: 0.7 },
  { path: "/submit", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority,
  }));

  // Without Supabase configured the static routes are still a valid sitemap.
  const supabase = getSupabaseServer();
  if (!supabase) return entries;

  // Anon RLS already hides unapproved and private rows; the filters keep the
  // queries narrow and the selects carry only what the sitemap prints.
  const [clubs, comps, portfolios] = await Promise.all([
    supabase.from("clubs").select("id, created_at").eq("is_approved", true),
    supabase.from("competitions").select("id, created_at").eq("is_approved", true),
    supabase.from("public_portfolios").select("id"),
  ]);

  for (const club of (clubs.data ?? []) as { id: string; created_at: string }[]) {
    entries.push({
      url: `${SITE_URL}/clubs/${club.id}`,
      lastModified: new Date(club.created_at),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Competitions have no page of their own — ?c= is the shareable deep link.
  for (const comp of (comps.data ?? []) as { id: string; created_at: string }[]) {
    entries.push({
      url: `${SITE_URL}/competitions?c=${comp.id}`,
      lastModified: new Date(comp.created_at),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const p of (portfolios.data ?? []) as { id: string }[]) {
    entries.push({
      url: `${SITE_URL}/portfolio/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return entries;
}
