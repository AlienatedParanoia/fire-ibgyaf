import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

async function getStats() {
  const supabase = getSupabaseServer();
  const fallback = { clubs: 5, competitions: 8, recent: 6 };
  if (!supabase) return fallback;
  try {
    const [clubs, comps] = await Promise.all([
      supabase.from("clubs").select("id", { count: "exact", head: true }).eq("is_approved", true),
      supabase.from("competitions").select("id", { count: "exact", head: true }).eq("is_approved", true),
    ]);
    return {
      clubs: clubs.count ?? fallback.clubs,
      competitions: comps.count ?? fallback.competitions,
      recent: fallback.recent,
    };
  } catch {
    return fallback;
  }
}

function Squiggle() {
  return (
    <svg
      viewBox="0 0 200 11"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className="absolute left-0 h-[0.22em] w-full text-ember"
      style={{ bottom: "-0.18em" }}
    >
      <path
        d="M2 7C40 2 70 9 100 5C130 1 160 8 198 4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Find",
    desc: "Search every competition and club in one list — filter by category, region, format, or how soon the deadline is.",
    link: { label: "have a look →", href: "/competitions" },
    rotate: "-rotate-[0.7deg]",
  },
  {
    n: "2",
    title: "Involve",
    desc: "Join clubs and sign up for competitions that actually match what you're into. No more 14 different forms.",
    link: { label: "join something →", href: "/clubs" },
    rotate: "rotate-[0.6deg]",
  },
  {
    n: "3",
    title: "Reach",
    desc: "We'll nudge you before deadlines. Everything sits on one calendar with countdowns, so you show up on time.",
    link: { label: "see the calendar →", href: "/calendar" },
    rotate: "rotate-[0.5deg]",
  },
  {
    n: "4",
    title: "Engage",
    desc: "Keep a running record of everything you've done — then export a tidy portfolio when applications roll around.",
    link: { label: "start a portfolio →", href: "/portfolio" },
    rotate: "-rotate-[0.6deg]",
  },
];

const TESTIMONIALS = [
  {
    quote: "I found the science fair and a robotics club in under a minute. I genuinely had no idea half of these existed.",
    name: "Mei Ling",
    role: "Secondary 4, Raffles Girls'",
  },
  {
    quote: "I used to email students long lists of competitions. Now I just point them here. Saves me hours every week.",
    name: "Mr. Daniel Koh",
    role: "Teacher-in-charge, Hwa Chong",
  },
  {
    quote: "The tracker had all my achievements ready when I sat down to write my uni application. Honestly a lifesaver.",
    name: "Arjun S.",
    role: "JC2, Victoria Junior College",
  },
];

const TODO_ITEMS = [
  { done: true,  text: "Email reminders before deadlines" },
  { done: true,  text: "Club directory across schools" },
  { done: false, text: "Calendar export (.ics) for your phone" },
  { done: false, text: "A proper mobile app" },
  { done: false, text: "Whatever you tell us you need most" },
];

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="bg-paper">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="container py-20 sm:py-24">
        <div
          className="font-hand mb-[18px] inline-block text-[25px] text-pen"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          made by students who kept missing deadlines ✶
        </div>

        <h1
          className="font-heading font-medium leading-[1.04] tracking-[-0.02em] text-ink"
          style={{ fontSize: "clamp(2.6rem, 6vw, 4.7rem)", maxWidth: "16ch" }}
        >
          Stop finding competitions{" "}
          <span className="relative inline-block">
            a day
            <Squiggle />
          </span>{" "}
          <span className="mark">too late.</span>
        </h1>

        <p className="mt-[30px] max-w-[48ch] text-[20px] text-ink-soft">
          F.I.R.E is a student-built directory of every competition and club in Singapore
          — with reminders, so the good ones don&apos;t slip past you.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/competitions" className={cn(buttonVariants({ variant: "ember", size: "lg" }))}>
            Browse competitions <span>→</span>
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ variant: "sketch", size: "lg" }))}>
            Sign up, it&apos;s free
          </Link>
          <span className="font-hand text-[21px] text-pen">
            ↳ non-profit. genuinely no catch.
          </span>
        </div>

        <p className="font-hand mt-10 text-[24px] text-ink-soft">
          <b className="font-heading font-medium text-ink">{stats.competitions}</b> competitions ·{" "}
          <b className="font-heading font-medium text-ink">{stats.clubs}</b> clubs · we added{" "}
          <b className="font-heading font-medium text-ink">{stats.recent}</b> this week
        </p>
      </section>

      {/* ── FROM US ──────────────────────────────────────────── */}
      <section className="pb-[70px]">
        <div className="container" style={{ maxWidth: 640 }}>
          <div
            className="relative border border-[rgba(180,150,40,0.25)] bg-[#FFF6D6] p-7 shadow-[0_10px_26px_-14px_rgba(33,30,24,0.45)]"
            style={{ transform: "rotate(-1.4deg)", borderRadius: 0 }}
          >
            {/* washi tape */}
            <div
              className="absolute left-1/2 -top-3 h-[26px] w-[120px] border border-dashed border-[rgba(204,82,48,0.4)] bg-[rgba(204,82,48,0.22)]"
              style={{ transform: "translateX(-50%) rotate(-2deg)" }}
            />
            <p className="text-[18px] leading-[1.65] text-ink">
              Hi — we&apos;re a few JC students from Singapore. We kept hearing about competitions
              the day <em>after</em> they closed, or never at all. So we spent a bunch of weekends
              building the thing we wished already existed. It&apos;s free, it&apos;s non-profit,
              and it&apos;s very much a work in progress.
            </p>
            <span className="font-hand mt-[14px] block text-[28px] text-ember">
              — the F.I.R.E team
            </span>
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────── */}
      <section className="py-[70px]" id="steps">
        <div className="container">
          <span
            className="font-hand mb-[6px] inline-block text-[25px] text-ember"
            style={{ transform: "rotate(-1deg)" }}
          >
            what it actually does
          </span>
          <h2
            className="font-heading mb-10 font-medium leading-[1.06] text-ink"
            style={{ fontSize: "clamp(2rem, 3.6vw, 2.9rem)", maxWidth: "18ch" }}
          >
            Four things, so nothing falls through the cracks.
          </h2>

          <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={cn(
                  "rounded-[14px] border-[1.5px] border-ink bg-panel p-[30px] shadow-hard-card",
                  s.rotate
                )}
              >
                <div className="mb-3 flex items-baseline gap-[14px]">
                  <span className="font-hand text-[40px] leading-[0.8] text-ember">{s.n}</span>
                  <h3 className="font-heading text-[27px] font-medium text-ink">{s.title}</h3>
                </div>
                <p className="text-[16px] text-ink-soft">{s.desc}</p>
                <Link
                  href={s.link.href}
                  className="font-hand mt-[14px] inline-block text-[20px] text-pen transition-colors hover:text-ember"
                >
                  {s.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKER ──────────────────────────────────────────── */}
      <section className="py-[70px]" id="tracker">
        <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span
              className="font-hand mb-[6px] inline-block text-[25px] text-ember"
              style={{ transform: "rotate(-1deg)" }}
            >
              the bit we&apos;re proudest of
            </span>
            <h2
              className="font-heading font-medium leading-[1.06] text-ink"
              style={{ fontSize: "clamp(2rem, 3.6vw, 2.9rem)", maxWidth: "18ch" }}
            >
              Everything you&apos;ve done, in one place.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[17px] text-ink-soft">
              No more digging through group chats and spreadsheets the night before a deadline.
              Your clubs, competitions, deadlines and wins all live together — and export cleanly
              when you need them.
            </p>
            <Link
              href="/tracker"
              className={cn(buttonVariants({ variant: "sketch", size: "lg" }), "mt-7")}
            >
              See the tracker →
            </Link>
          </div>

          <div className="relative pb-8">
            {/* washi tape */}
            <div
              className="absolute -top-4 right-8 z-10 h-[26px] w-24 border border-dashed border-[rgba(180,150,40,0.55)] bg-[rgba(255,210,94,0.5)]"
              style={{ transform: "rotate(7deg)" }}
            />
            {/* screenshot placeholder */}
            <div
              className="relative overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-paper-2 shadow-[6px_6px_0_rgba(33,30,24,0.12)]"
              style={{
                aspectRatio: "16/11",
                backgroundImage:
                  "repeating-linear-gradient(135deg,transparent,transparent 9px,rgba(33,30,24,0.04) 9px,rgba(33,30,24,0.04) 10px)",
                transform: "rotate(0.8deg)",
              }}
            >
              <span className="absolute bottom-3 left-3 rounded border border-[rgba(33,30,24,0.09)] bg-panel px-[9px] py-1 font-mono text-[11.5px] text-ink-faint">
                screenshot · portfolio tracker
              </span>
            </div>
            <span
              className="font-hand absolute -bottom-2 right-0 w-[170px] text-center text-[21px] text-pen"
              style={{ transform: "rotate(-5deg)" }}
            >
              ↑ still polishing this screen!
            </span>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-[70px]">
        <div className="container">
          <span
            className="font-hand mb-[6px] inline-block text-[25px] text-ember"
            style={{ transform: "rotate(-1deg)" }}
          >
            people actually use it
          </span>
          <h2
            className="font-heading mb-9 font-medium leading-[1.06] text-ink"
            style={{ fontSize: "clamp(2rem, 3.6vw, 2.9rem)", maxWidth: "18ch" }}
          >
            Don&apos;t just take our word for it.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className={cn(
                  "flex flex-col rounded-[12px] border border-[rgba(33,30,24,0.16)] bg-panel p-[26px]",
                  i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"
                )}
              >
                <blockquote className="font-heading flex-1 text-[20px] italic leading-[1.42] text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-[18px]">
                  <div className="font-hand text-[23px] text-ember">{t.name}</div>
                  <div className="text-[13px] text-ink-faint">{t.role}</div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE'RE BUILDING NEXT ─────────────────────────── */}
      <section className="py-[70px]" id="next">
        <div className="container">
          <span
            className="font-hand mb-[6px] inline-block text-[25px] text-ember"
            style={{ transform: "rotate(-1deg)" }}
          >
            we&apos;re not done
          </span>
          <h2
            className="font-heading mb-6 font-medium leading-[1.06] text-ink"
            style={{ fontSize: "clamp(2rem, 3.6vw, 2.9rem)", maxWidth: "18ch" }}
          >
            What we&apos;re building next.
          </h2>

          <div
            className="max-w-[620px] rounded-[14px] border-[1.5px] border-dashed border-ink bg-panel p-9 rotate-[1.1deg]"
          >
            <ul className="m-0 list-none p-0">
              {TODO_ITEMS.map((item, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-[14px] py-[9px] text-[18px]",
                    i < TODO_ITEMS.length - 1
                      ? "border-b border-dashed border-[rgba(33,30,24,0.09)]"
                      : ""
                  )}
                >
                  <span
                    className={cn(
                      "mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border-2 text-[15px] font-bold",
                      item.done
                        ? "border-ember bg-ember text-white"
                        : "border-ink"
                    )}
                  >
                    {item.done && "✓"}
                  </span>
                  <span
                    className={
                      item.done
                        ? "text-ink-faint line-through decoration-ember"
                        : "text-ink"
                    }
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-hand mt-6 text-[23px] text-pen">
              got an idea? tell us →{" "}
              <a href="mailto:hello@fire.sg" className="font-hand text-ember hover:underline">
                hello@fire.sg
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-24 pt-[30px]">
        <div className="container">
          <div
            className="relative rounded-[20px] border-2 border-ink bg-paper-2 px-10 py-[74px] text-center shadow-[7px_7px_0_#211E18] sm:px-16"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            <h2
              className="font-heading font-medium leading-[1.02] text-ink"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)" }}
            >
              Come find <span className="mark">your thing.</span>
            </h2>
            <p className="mt-[18px] text-[18px] text-ink-soft">
              It&apos;s free, it takes a minute, and there&apos;s a lot waiting for you.
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: "ember", size: "lg" }), "mt-[30px]")}
            >
              Sign up →
            </Link>
            <span
              className="font-hand absolute bottom-[30px] right-[54px] hidden text-[26px] text-ember sm:block"
              style={{ transform: "rotate(-7deg)" }}
            >
              see you there!
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
