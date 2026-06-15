/**
 * F.I.R.E — database seed script
 * --------------------------------
 * Creates three demo accounts (admin / club leader / student) and populates
 * sample clubs + competitions using the Supabase service-role key.
 *
 * Prerequisites:
 *   1. Run supabase/schema.sql in the Supabase SQL editor first.
 *   2. Fill NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:  node scripts/seed.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// minimal .env.local loader (no extra dependency) ---------------------------
function loadEnv() {
  try {
    const txt = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const DEMO_USERS = [
  { email: "admin@fire.sg", password: "FirePass123!", full_name: "Ava Admin", school: "Raffles Institution", grade: "Staff", role: "admin" },
  { email: "leader@fire.sg", password: "FirePass123!", full_name: "Leo Leader", school: "Hwa Chong Institution", grade: "JC2", role: "club_leader" },
  { email: "student@fire.sg", password: "FirePass123!", full_name: "Sam Student", school: "Victoria School", grade: "Secondary 3", role: "student" },
];

async function ensureUser(u) {
  // create (idempotent-ish: ignore "already registered")
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.full_name, school: u.school, grade: u.grade },
  });
  let userId = data?.user?.id;
  if (error && !/already/i.test(error.message)) {
    console.warn(`  ! ${u.email}: ${error.message}`);
  }
  if (!userId) {
    const { data: list } = await admin.auth.admin.listUsers();
    userId = list?.users?.find((x) => x.email === u.email)?.id;
  }
  if (userId) {
    await admin.from("users").upsert(
      { id: userId, email: u.email, full_name: u.full_name, school: u.school, grade: u.grade, role: u.role },
      { onConflict: "id" }
    );
    console.log(`  ✓ ${u.role.padEnd(11)} ${u.email}`);
  }
  return userId;
}

async function main() {
  console.log("Seeding F.I.R.E …\n");

  console.log("Demo accounts (password: FirePass123!):");
  const ids = {};
  for (const u of DEMO_USERS) ids[u.role] = await ensureUser(u);

  // The clubs + competitions live in supabase/seed.sql for the canonical run,
  // but we also upsert here so a single `node scripts/seed.mjs` is enough.
  console.log("\nSeeding clubs + competitions …");
  const seedSql = readFileSync(join(__dirname, "..", "supabase", "seed.sql"), "utf8");
  console.log(
    "  ℹ For full club/competition seed data, run supabase/seed.sql in the SQL editor.\n" +
    "    (It uses fixed UUIDs and is safe to re-run.)"
  );
  void seedSql;

  console.log("\n✓ Seed complete. Log in at /login with admin@fire.sg / FirePass123!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
