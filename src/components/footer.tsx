import Link from "next/link";
import { Logo } from "./logo";

const COLS = [
  {
    title: "the site",
    links: [
      { href: "/competitions", label: "Competitions" },
      { href: "/clubs", label: "Clubs" },
      { href: "/calendar", label: "Calendar" },
    ],
  },
  {
    title: "your account",
    links: [
      { href: "/signup", label: "Sign up" },
      { href: "/login", label: "Log in" },
      { href: "/portfolio", label: "Portfolio" },
    ],
  },
  {
    title: "us",
    links: [
      { href: "/submit", label: "Submit an Opportunity" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "mailto:hello@fire.sg", label: "hello@fire.sg" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(2,2,2,0.14)] bg-paper">
      <div className="container flex flex-wrap items-start justify-between gap-10 py-14">
        <div>
          <Logo />
          <p className="mt-3 max-w-[30ch] text-[14.5px] text-ink-faint">
            Find. Involve. Reach. Engage. A student-built directory for Singapore&apos;s extracurricular world.
          </p>
        </div>
        <div className="flex flex-wrap gap-14">
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-hand mb-2 text-[20px] text-ember">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block text-[15px] text-ink-soft transition-colors hover:text-ember"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[rgba(2,2,2,0.09)]">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-5 font-hand text-[20px] text-ink-faint">
          <span>made with too much coffee in Singapore · {new Date().getFullYear()}</span>
          <span>non-profit · by students, for students</span>
        </div>
      </div>
    </footer>
  );
}
