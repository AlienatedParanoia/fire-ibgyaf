/**
 * F.I.R.E — remove everything created by scripts/seed-demo.mjs
 * ------------------------------------------------------------
 * Deletes every account tagged app_metadata.demo = true (their profiles, club memberships
 * and leader links go with them) and un-assigns any club they led. As a second guard it
 * only touches addresses on @projectfire.dev, so a real student's account is never deleted.
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (.env.local or the shell).
 * Usage:  node scripts/remove-demo.mjs          (preview)
 *         node scripts/remove-demo.mjs --yes    (delete)
 */
import { createClient } from "@supabase/supabase-js";
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

const DEMO_SUFFIX = "@projectfire.dev";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(2);
}
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const GO = process.argv.includes("--yes");

// Page through every auth user and keep the tagged ones.
const ids = [];
for (let page = 1; ; page++) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  const users = data?.users ?? [];
  for (const u of users) {
    if (u.app_metadata?.demo === true && (u.email ?? "").toLowerCase().endsWith(DEMO_SUFFIX)) ids.push(u.id);
  }
  if (users.length < 1000) break;
}
console.log(`Found ${ids.length} demo accounts.`);
if (!ids.length) process.exit(0);
if (!GO) {
  console.log("Preview only. Add --yes to delete them.");
  process.exit(0);
}

// Un-assign demo leaders first so no club is left pointing at a deleted account.
await admin.from("clubs").update({ leader_id: null }).in("leader_id", ids);

let removed = 0;
for (const id of ids) {
  const { error: dErr } = await admin.auth.admin.deleteUser(id);
  if (dErr) console.warn(`Could not delete ${id}: ${dErr.message}`);
  else removed++;
}
console.log(`Removed ${removed} of ${ids.length} demo accounts (memberships went with them).`);
