/**
 * F.I.R.E — demo data for marketing videos / screenshots
 * ------------------------------------------------------
 * Fills the site with obviously-fake GIIS "students" who have joined clubs, plus a
 * demo club leader for every club that has none, so a recording shows a lived-in app.
 *
 *  • Every demo account uses an email ending in @demo.projectfire.invalid — a reserved
 *    domain that can never receive mail and never belongs to a real person. Names are
 *    invented; nothing here uses real students' details.
 *  • Accounts are created pre-confirmed, so NO emails are sent to anyone.
 *  • Only club memberships are created. No views / saves / interactions, so the
 *    popularity scores and For You picks stay driven by real students.
 *  • `node scripts/remove-demo.mjs --yes` deletes all of it again.
 *
 * Needs in .env.local (or the shell):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_PASSWORD (12+ chars; shared by
 *   all demo accounts so you can log in as one on camera)
 *
 * Usage:  node scripts/seed-demo.mjs [--members 120] [--no-leaders] --yes
 *         (without --yes it only prints what it would do)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Progress bar in the Claude Code UI; a no-op anywhere else.
let claudeProgress = () => {};
try {
  ({ claudeProgress } = require(join(process.env.CLAUDE_PROGRESS_DIR, "claude-progress.js")));
} catch {
  /* not running under Claude Code */
}

try {
  for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on real env */
}

const DEMO_DOMAIN = "demo.projectfire.invalid";
const SCHOOL = "GIIS Singapore";
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const MEMBERS = Math.max(0, Math.min(opt("members", 120), 500));
const WITH_LEADERS = !flag("no-leaders");
const GO = flag("yes");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.DEMO_PASSWORD;
if (!url || !key || !password || password.length < 12) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DEMO_PASSWORD (12+ characters).");
  process.exit(2);
}
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const FIRST = [
  "Aarav", "Vihaan", "Aditya", "Arjun", "Reyansh", "Ishaan", "Kabir", "Dhruv", "Rohan", "Krish",
  "Aryan", "Rishi", "Nikhil", "Siddharth", "Yash", "Karan", "Varun", "Pranav", "Neel", "Tejas",
  "Ananya", "Diya", "Saanvi", "Aadhya", "Myra", "Kiara", "Anika", "Riya", "Navya", "Ishita",
  "Meera", "Tara", "Sanya", "Avni", "Kavya", "Aisha", "Pooja", "Nisha", "Trisha", "Zara",
  "Harsh", "Manav", "Veer", "Advait", "Shaurya", "Lakshya", "Samar", "Atharv", "Rudra", "Om",
  "Prisha", "Shreya", "Mahika", "Aarohi", "Ira", "Vanya", "Sia", "Inaya", "Nitya", "Amaira",
];
const LAST = [
  "Sharma", "Verma", "Gupta", "Singh", "Patel", "Mehta", "Shah", "Reddy", "Nair", "Iyer",
  "Menon", "Pillai", "Rao", "Kapoor", "Malhotra", "Bhatia", "Chopra", "Joshi", "Kulkarni", "Desai",
  "Banerjee", "Chatterjee", "Das", "Sen", "Bose", "Agarwal", "Jain", "Saxena", "Khanna", "Sethi",
  "Bhatt", "Trivedi", "Pandey", "Mishra", "Tiwari", "Naidu", "Krishnan", "Subramanian", "Venkatesh", "Hegde",
];
const GRADES = ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const INTERESTS = ["STEM", "Arts", "Business", "Debate", "Sports", "Tech", "Math", "Science"];

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");

async function main() {
  const { data: clubs, error } = await admin
    .from("clubs")
    .select("id, name, president, leader_id, school")
    .eq("is_approved", true)
    .eq("school", SCHOOL);
  if (error) throw new Error(`Could not read clubs: ${error.message}`);
  if (!clubs?.length) throw new Error("No approved GIIS clubs found — run the clubs migration first.");

  const leaderless = WITH_LEADERS ? clubs.filter((c) => !c.leader_id) : [];
  console.log(`Clubs: ${clubs.length} GIIS clubs (${leaderless.length} without a leader)`);
  console.log(`Will create: ${MEMBERS} demo members${WITH_LEADERS ? ` + ${leaderless.length} demo club leaders` : ""}`);
  console.log(`Emails look like: demo-member-0001@${DEMO_DOMAIN} (no mail is ever sent)`);
  if (!GO) {
    console.log("\nDry run. Add --yes to actually create them.");
    return;
  }

  const total = MEMBERS + leaderless.length;
  claudeProgress("-n", "demo-seed", "-t", String(total));
  const realPresidents = new Set(clubs.map((c) => c.president?.toLowerCase()).filter(Boolean));
  const usedEmails = new Set();
  let counter = 0;
  let made = 0;
  let failed = 0;

  async function createDemoUser(role, label) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const first = pick(FIRST);
      const last = pick(LAST);
      const full = `${first} ${last}`;
      if (realPresidents.has(full.toLowerCase())) continue; // never reuse a real student's name
      // Generic on purpose: no names in the address, nothing that looks like a real person's.
      const email = `demo-${role === "club_leader" ? "leader" : "member"}-${String(++counter).padStart(4, "0")}@${DEMO_DOMAIN}`;
      if (usedEmails.has(email)) continue;
      usedEmails.add(email);
      const grade = pick(GRADES);
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full, school: SCHOOL, grade },
      });
      if (error || !data.user) continue;
      const patch = { interests: shuffle(INTERESTS).slice(0, 2 + Math.floor(Math.random() * 2)) };
      if (role === "club_leader") patch.role = "club_leader";
      await admin.from("users").update(patch).eq("id", data.user.id);
      return data.user.id;
    }
    return null;
  }

  // Club leaders first: one per leaderless club.
  for (const club of leaderless) {
    const slugName = slug(club.name).replace(/^the\.|^giis\./, "").slice(0, 18);
    const id = await createDemoUser("club_leader", slugName);
    if (id) {
      await admin.from("clubs").update({ leader_id: id }).eq("id", club.id).is("leader_id", null);
      made++;
    } else failed++;
    claudeProgress("-n", "demo-seed", "+1");
  }

  // Members, who each join 1–3 clubs; some clubs are much more popular than others.
  const weights = new Map(clubs.map((c) => [c.id, 1 + Math.random() * 5]));
  const bag = clubs.flatMap((c) => Array(Math.round(weights.get(c.id) * 2)).fill(c.id));
  const joins = [];
  for (let i = 0; i < MEMBERS; i++) {
    const id = await createDemoUser("student", "");
    if (!id) {
      failed++;
      claudeProgress("-n", "demo-seed", "+1");
      continue;
    }
    made++;
    const want = 1 + Math.floor(Math.random() * 3);
    const chosen = new Set();
    while (chosen.size < Math.min(want, clubs.length)) chosen.add(pick(bag));
    for (const club_id of chosen) joins.push({ user_id: id, club_id, status: "registered" });
    claudeProgress("-n", "demo-seed", "+1");
  }

  let joined = 0;
  for (let i = 0; i < joins.length; i += 100) {
    const { error: jErr } = await admin.from("participation").insert(joins.slice(i, i + 100));
    if (jErr) console.warn("Some memberships failed:", jErr.message);
    else joined += Math.min(100, joins.length - i);
  }

  claudeProgress("-n", "demo-seed", "done", `${made} accounts, ${joined} memberships`);
  console.log(`\nCreated ${made} demo accounts (${failed} failed) and ${joined} club memberships.`);
  console.log(`Log in as any of them with the DEMO_PASSWORD you set; emails end in @${DEMO_DOMAIN}.`);
  console.log("Remove everything later with: node scripts/remove-demo.mjs --yes");
}

main().catch((e) => {
  claudeProgress("-n", "demo-seed", "fail", String(e.message ?? e));
  console.error(e.message ?? e);
  process.exit(1);
});
