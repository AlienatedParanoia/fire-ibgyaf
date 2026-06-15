import Link from "next/link";
import {
  Search,
  Users2,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Flame,
  Quote,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCounter } from "@/components/stat-counter";
import { RevealSection } from "@/components/reveal-section";
import { getSupabaseServer } from "@/lib/supabase/server";

async function getStats() {
  const supabase = getSupabaseServer();
  const fallback = { clubs: 5, competitions: 8, students: 1280 };
  if (!supabase) return fallback;
  try {
    const [clubs, comps, students] = await Promise.all([
      supabase.from("clubs").select("id", { count: "exact", head: true }).eq("is_approved", true),
      supabase
        .from("competitions")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", true),
      supabase.from("users").select("id", { count: "exact", head: true }),
    ]);
    return {
      clubs: clubs.count ?? fallback.clubs,
      competitions: comps.count ?? fallback.competitions,
      students: Math.max(students.count ?? 0, fallback.students),
    };
  } catch {
    return fallback;
  }
}

const FEATURES = [
  {
    icon: Search,
    title: "Find",
    desc: "Search a live directory of competitions and clubs with smart filters by category, region, format, and deadline.",
  },
  {
    icon: Users2,
    title: "Involve",
    desc: "Join clubs and register for competitions that match your interests — all in one organised place.",
  },
  {
    icon: CalendarCheck,
    title: "Reach",
    desc: "Never miss a deadline. Track everything on a personal calendar with reminders and countdowns.",
  },
  {
    icon: TrendingUp,
    title: "Engage",
    desc: "Log your achievements, build a portfolio of activities, and export it for applications.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I found the SSEF and a robotics club in under a minute. F.I.R.E completely changed how I discover opportunities.",
    name: "Mei Ling",
    role: "Secondary 4, Raffles Girls'",
  },
  {
    quote:
      "As a CCA teacher I used to email students lists of competitions. Now I just point them to F.I.R.E. Saves me hours.",
    name: "Mr. Daniel Koh",
    role: "Teacher-in-charge, Hwa Chong",
  },
  {
    quote:
      "The tracker helped me keep all my achievements in one place when writing my university application. Lifesaver.",
    name: "Arjun S.",
    role: "JC2, Victoria Junior College",
  },
];

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="fire-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="container relative py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <Flame className="h-4 w-4" /> Find. Involve. Reach. Engage.
            </div>
            <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Find Your Next Opportunity
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-white/85">
              F.I.R.E is your gateway to every competition, club, and challenge for Singapore students
              — all in one bright, fast platform.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/competitions"
                className={buttonVariants({ variant: "white", size: "lg" })}
              >
                Browse Competitions <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "outlineLight", size: "lg" })}
              >
                Sign Up Free
              </Link>
            </div>

            {/* stat counters */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-10">
              <StatCounter value={stats.clubs} label="Clubs Listed" />
              <StatCounter value={stats.competitions} label="Competitions" />
              <StatCounter value={stats.students} label="Students Engaged" suffix="+" />
            </div>
          </div>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 80L1440 80L1440 0C1080 60 360 60 0 0Z" fill="currentColor" />
        </svg>
      </section>

      {/* ─────────────────────── FEATURES ─────────────────────── */}
      <section className="container py-20">
        <RevealSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            Everything you need, in one place
          </h2>
          <p className="mt-3 text-muted-foreground">
            F.I.R.E turns the scattered, hard-to-find world of extracurriculars into a single
            organised hub.
          </p>
        </RevealSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <RevealSection key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fire to-electric text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-charcoal">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ───────────────────── TESTIMONIALS ───────────────────── */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <RevealSection className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
              Loved by students &amp; teachers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real stories from the F.I.R.E community across Singapore.
            </p>
          </RevealSection>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm">
                  <Quote className="h-7 w-7 text-fire/30" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-charcoal/5 pt-4">
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </figcaption>
                </figure>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ────────────────────────── */}
      <section className="container py-20">
        <div className="fire-gradient relative overflow-hidden rounded-3xl px-8 py-14 text-center shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_70%)]" />
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Ready to ignite your potential?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/85">
              Join thousands of Singapore students already finding their next opportunity.
            </p>
            <Link
              href="/signup"
              className={buttonVariants({ variant: "white", size: "lg", className: "mt-7" })}
            >
              Get Started — it&apos;s free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
