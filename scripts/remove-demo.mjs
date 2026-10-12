/**
 * F.I.R.E — remove everything created by scripts/seed-demo.mjs
 * ------------------------------------------------------------
 * Deletes every account whose email ends in @demo.projectfire.invalid (their profiles,
 * club memberships and leader links go with them) and un-assigns any club they led.
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

const DEMO_SUFFIX = "@demo.projectfire.invalid";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(2);
}
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const GO = process.argv.includes("--yes");

const { data: users, error } = await admin.from("users").select("id, email").like("email", `%${DEMO_SUFFIX}`);
if (error) {
  console.error(error.message);
  process.exit(1);
}
const ids = (users ?? []).map((u) => u.id);
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
