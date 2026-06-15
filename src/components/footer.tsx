import Link from "next/link";
import { Logo } from "./logo";

const COLS = [
  {
    title: "Explore",
    links: [
      { href: "/competitions", label: "Competitions" },
      { href: "/clubs", label: "Clubs" },
      { href: "/calendar", label: "Calendar" },
    ],
  },
  {
    title: "Participate",
    links: [
      { href: "/submit", label: "Submit an Opportunity" },
      { href: "/tracker", label: "My Tracker" },
      { href: "/portfolio", label: "My Portfolio" },
      { href: "/signup", label: "Create Account" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/login", label: "Login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Find. Involve. Reach. Engage. — your gateway to every opportunity for Singapore students.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-charcoal">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-fire"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-charcoal/5">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} F.I.R.E. Built by students, for students.</p>
          <p>Find. Involve. Reach. Engage.</p>
        </div>
      </div>
    </footer>
  );
}
