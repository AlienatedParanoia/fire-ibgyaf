/**
 * F.I.R.E — club sync check
 * --------------------------------
 * Compares the public club lists of the Lovable app
 * (app.find-involve-reach-engage.com) and this app (projectfire.dev), by id.
 * Reports clubs missing on either side and any field that differs.
 * Read-only, anon keys only (contact details are hidden from anon on both sides).
 *
 * Env (shell or .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY   this app
 *   LOVABLE_SUPABASE_URL / LOVABLE_SUPABASE_ANON_KEY           the Lovable app's
 *       Supabase project (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in its .env)
 *
 * Usage:  node scripts/check-club-sync.mjs        (exit code 1 when out of sync)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on real env */
}

const FIELDS = [
  "name", "category", "vision", "mission", "president", "vice_president", "secretary",
  "treasurer", "instagram", "linkedin", "website", "grade_requirements", "is_open", "school",
];
// description is compared loosely: this app falls back to mission/vision when it's empty.
const SELECT = ["id", "description", ...FIELDS].join(",");

async function load(label, url, key, approvedFilter = "is_approved=eq.true") {
  if (!url || !key) {
    console.error(`Missing credentials for ${label}.`);
    process.exit(2);
  }
  const res = await fetch(`${url}/rest/v1/clubs?select=${SELECT}&${approvedFilter}&order=name&limit=1000`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.error(`${label}: HTTP ${res.status} ${await res.text()}`);
    process.exit(2);
  }
  return new Map((await res.json()).map((c) => [c.id, c]));
}

const mine = await load("this app", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
if (!process.env.LOVABLE_SUPABASE_URL || !process.env.LOVABLE_SUPABASE_ANON_KEY) {
  console.error("Missing LOVABLE_SUPABASE_URL / LOVABLE_SUPABASE_ANON_KEY.");
  process.exit(2);
}
// The Lovable app marks approval with `status = 'approved'` instead of `is_approved`.
const theirs = await load("Lovable app", process.env.LOVABLE_SUPABASE_URL, process.env.LOVABLE_SUPABASE_ANON_KEY, "status=eq.approved");

const norm = (v) => (v === undefined || v === "" ? null : v);
let problems = 0;

for (const [id, c] of theirs) {
  const m = mine.get(id);
  if (!m) {
    console.log(`MISSING here   ${c.name}  (${id})`);
    problems++;
    continue;
  }
  for (const f of FIELDS) {
    if (norm(c[f]) !== norm(m[f])) {
      console.log(`DIFFERS        ${c.name} · ${f}: lovable=${JSON.stringify(c[f])} here=${JSON.stringify(m[f])}`);
      problems++;
    }
  }
}
for (const [id, m] of mine) {
  if (!theirs.has(id)) console.log(`ONLY here      ${m.name}  (${id})  — not in the Lovable app (fine for placeholders)`);
}

console.log(
  problems === 0
    ? `\n✓ In sync: all ${theirs.size} Lovable clubs are present here with matching fields.`
    : `\n✗ ${problems} difference(s). Re-run supabase/migration-lovable-clubs.sql or edit the club in Admin.`
);
process.exit(problems === 0 ? 0 : 1);
