"use client";

import * as React from "react";
import Link from "next/link";

type Pillar = {
  n: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
  shot: string;
};

const PILLARS: Pillar[] = [
  {
    n: "01",
    eyebrow: "Discover",
    title: "Competitions",
    desc: "Every contest in Singapore in one searchable feed — filter by category, region, format, or how soon it closes.",
    bullets: ["Deadline-urgency colours", "Save straight to your tracker", "Featured & verified listings"],
    cta: "Browse competitions →",
    href: "/competitions",
    shot: "competitions · feed",
  },
  {
    n: "02",
    eyebrow: "Belong",
    title: "Clubs",
    desc: "Join clubs across every school, not just your own. Rich profiles, the competitions they run, and a one-tap join.",
    bullets: ["Cross-school directory", "Filter by category", "See what they compete in"],
    cta: "Explore clubs →",
    href: "/clubs",
    shot: "clubs · directory",
  },
  {
    n: "03",
    eyebrow: "Contribute",
    title: "Submit",
    desc: "Spotted something we're missing? Anyone can suggest a competition or club — no login — and it lands in our review queue.",
    bullets: ["No account needed", "Goes live once approved", "Keeps the list complete"],
    cta: "Submit an opportunity →",
    href: "/submit",
    shot: "submit · form",
  },
  {
    n: "04",
    eyebrow: "Track",
    title: "Tracker",
    desc: "Your status pipeline from Interested to Won, with notes on every entry and a clean CSV export when you need it.",
    bullets: ["Interested → Registered → Won", "Per-item notes", "One-click CSV export"],
    cta: "Open the tracker →",
    href: "/tracker",
    shot: "tracker · pipeline",
  },
  {
    n: "05",
    eyebrow: "Showcase",
    title: "Portfolio",
    desc: "Everything you've done, gathered into a tidy record you can export the moment applications roll around.",
    bullets: ["Auto-built from your activity", "Share or export as PDF", "Ready for uni applications"],
    cta: "Build a portfolio →",
    href: "/portfolio",
    shot: "portfolio · export",
  },
  {
    n: "06",
    eyebrow: "Plan",
    title: "Calendar",
    desc: "Every deadline on one colour-coded month — competitions, clubs and your own dates — with live countdowns.",
    bullets: ["Colour-coded by type", "Live deadline countdowns", "Never double-booked"],
    cta: "See the calendar →",
    href: "/calendar",
    shot: "calendar · month",
  },
];

const GUTTER = "max(24px, calc((100vw - 1280px) / 2 + 24px))";
const EYEBROW_LINE = { width: 30, height: 1.5, background: "#F75C4C" } as const;
const GHOST_NUM: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  fontFamily: "var(--font-serif), Georgia, serif",
  fontWeight: 500,
  fontSize: "clamp(12rem, 34vw, 30rem)",
  lineHeight: 0.7,
  color: "rgba(2,2,2,0.05)",
  zIndex: 0,
  pointerEvents: "none",
  userSelect: "none",
};
const FRAME: React.CSSProperties = {
  border: "1.5px solid rgba(2,2,2,0.12)",
  borderRadius: 16,
  overflow: "hidden",
  background: "#EFEBE1",
};
const SHOT: React.CSSProperties = { display: "block", width: "100%", height: "min(60vh, 520px)" };
const SHOT_LABEL: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  fontFamily: "ui-monospace, monospace",
  fontSize: 11,
  letterSpacing: "0.08em",
  color: "rgba(2,2,2,0.5)",
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(2,2,2,0.12)",
  padding: "4px 9px",
  borderRadius: 6,
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul
      className="u-up"
      style={{ listStyle: "none", margin: "0 0 34px", padding: 0, display: "flex", flexDirection: "column", gap: 12, transitionDelay: ".18s" }}
    >
      {items.map((b) => (
        <li key={b} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "rgba(2,2,2,0.72)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F75C4C", flex: "none" }} />
          {b}
        </li>
      ))}
    </ul>
  );
}

function ShotFrame({ label }: { label: string }) {
  return (
    <div data-parallax="-0.7" className="u-clip" style={{ position: "relative" }}>
      <div style={FRAME}>
        <div style={SHOT} />
      </div>
      <span style={SHOT_LABEL}>{label}</span>
    </div>
  );
}

function PillarText({ p }: { p: Pillar }) {
  return (
    <div>
      <div
        className="u-up"
        style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, letterSpacing: "0.24em", textTransform: "uppercase", color: "#F75C4C", marginBottom: 26 }}
      >
        {p.n} <span style={EYEBROW_LINE} /> {p.eyebrow}
      </div>
      <h2
        style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.02em", fontSize: "clamp(2.8rem, 8.5vw, 7.5rem)", margin: "0 0 28px", color: "#020202" }}
      >
        <span className="u-mask">
          <span>
            {p.title}
            <span style={{ color: "#F75C4C" }}>.</span>
          </span>
        </span>
      </h2>
      <p
        className="u-up"
        style={{ fontSize: "clamp(16px, 1.4vw, 20px)", color: "rgba(2,2,2,0.62)", maxWidth: "42ch", margin: "0 0 30px", transitionDelay: ".1s" }}
      >
        {p.desc}
      </p>
      <Bullets items={p.bullets} />
      <Link
        href={p.href}
        className="fx-cta-link u-up"
        style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#020202", textDecoration: "none", transitionDelay: ".24s" }}
      >
        {p.cta}
      </Link>
    </div>
  );
}

export function LandingExperience() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $$ = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));

    // Hero entrance
    const raf = requestAnimationFrame(() => {
      root.querySelector(".fx-hero")?.classList.add("in");
    });

    // Reveal-on-enter
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    $$("[data-reveal]").forEach((el) => io.observe(el));

    // Scroll-driven parallax + active rail + progress
    const pillars = $$<HTMLElement>(".fx-pillar");
    const rail = $$<HTMLElement>(".fx-rail-item");
    const parallaxEls = $$<HTMLElement>("[data-parallax]");
    const progFill = root.querySelector<HTMLElement>(".fx-prog-fill");
    const pillarsWrap = root.querySelector<HTMLElement>(".fx-pillars");

    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      const mid = vh / 2;

      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = (c - mid) / vh;
        const s = parseFloat(el.dataset.parallax || "1") || 1;
        const off = (d * 26 * s).toFixed(1);
        el.style.transform = el.dataset.center
          ? `translate3d(0, calc(-50% + ${off}px), 0)`
          : `translate3d(0, ${off}px, 0)`;
      });

      let act = -1;
      let best = 1e9;
      pillars.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (r.top < vh * 0.6 && r.bottom > vh * 0.4) {
          const dist = Math.abs(r.top + r.height / 2 - mid);
          if (dist < best) {
            best = dist;
            act = i;
          }
        }
      });
      rail.forEach((it, i) => {
        const on = i === act;
        it.style.color = on ? "#F75C4C" : "rgba(2,2,2,0.32)";
        it.style.transform = on ? "scale(1.5)" : "scale(1)";
        it.style.fontWeight = on ? "700" : "400";
      });

      if (progFill && pillarsWrap) {
        const r = pillarsWrap.getBoundingClientRect();
        const total = r.height - vh;
        const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
        progFill.style.transform = `scaleY(${p})`;
      }

      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    run();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="fx-root" style={{ position: "relative", background: "#FAF9F5", color: "#020202" }}>
      <style>{FX_CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        id="top"
        className="fx-hero"
        style={{ position: "relative", background: "#FAF9F5", color: "#020202", minHeight: "calc(100vh - 74px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: `60px ${GUTTER} 80px` }}
      >
        <div className="u-up" style={{ fontFamily: "var(--font-hand), cursive", fontSize: 26, color: "#F75C4C", marginBottom: 20, transform: "rotate(-1.5deg)" }}>
          for students who keep missing out ✶
        </div>
        <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 500, lineHeight: 0.86, letterSpacing: "-0.025em", margin: 0, fontSize: "clamp(3.4rem, 13vw, 12.5rem)" }}>
          <span className="u-mask">
            <span>Catch every</span>
          </span>
          <span className="u-mask">
            <span style={{ fontStyle: "italic" }}>
              opportunity<span style={{ color: "#F75C4C", fontStyle: "normal" }}>.</span>
            </span>
          </span>
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginTop: 42 }}>
          <p className="u-up" style={{ maxWidth: "46ch", fontSize: "clamp(17px, 1.5vw, 21px)", color: "#44413B", margin: 0, transitionDelay: ".15s" }}>
            A student-built directory of every competition and club in Singapore — with reminders, so the good ones never slip past you. Free, non-profit, no catch.
          </p>
          <div className="u-up" style={{ display: "flex", gap: 14, transitionDelay: ".25s" }}>
            <Link className="fx-btn" href="/competitions" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 28px", borderRadius: 100, fontSize: 16, fontWeight: 600, background: "#020202", color: "#FAF9F5", textDecoration: "none" }}>
              Browse competitions →
            </Link>
            <Link className="fx-btn" href="/signup" style={{ display: "inline-flex", alignItems: "center", height: 52, padding: "0 28px", borderRadius: 100, fontSize: 16, fontWeight: 600, background: "transparent", color: "#020202", border: "1.5px solid #020202", textDecoration: "none" }}>
              Sign up free
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 30, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#837D70", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>Scroll to explore</span>
          <span style={{ fontSize: 18, animation: "fx-bob 1.8s ease-in-out infinite", color: "#F75C4C" }}>↓</span>
        </div>
      </section>

      {/* ── CORAL MARQUEE DIVIDER ────────────────────────────── */}
      <div style={{ background: "#F75C4C", color: "#020202", overflow: "hidden", padding: "18px 0", borderTop: "1.5px solid #020202", borderBottom: "1.5px solid #020202" }}>
        <div style={{ display: "flex", width: "max-content", animation: "fx-marq 24s linear infinite", fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontSize: 34, fontWeight: 500, whiteSpace: "nowrap" }}>
          <MarqueeRun />
          <MarqueeRun ariaHidden />
        </div>
      </div>

      {/* ── PILLARS ──────────────────────────────────────────── */}
      <div className="fx-pillars" style={{ position: "relative", background: "#FAF9F5" }}>
        {PILLARS.map((p, i) => {
          const imageLeft = i % 2 === 1;
          return (
            <section
              key={p.n}
              id={`p${i + 1}`}
              className="fx-pillar"
              style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", padding: `84px ${GUTTER}`, overflow: "hidden" }}
            >
              <div data-parallax="2.1" data-center="1" style={{ ...GHOST_NUM, ...(imageLeft ? { left: "-2vw" } : { right: "-2vw" }) }}>
                {p.n}
              </div>
              <div
                className="fx-grid"
                data-reveal
                style={{ position: "relative", zIndex: 1, width: "100%", display: "grid", gridTemplateColumns: imageLeft ? "0.95fr 1.05fr" : "1.05fr 0.95fr", gap: "clamp(32px, 6vw, 90px)", alignItems: "center" }}
              >
                {imageLeft ? (
                  <>
                    <div style={{ order: 1 }}>
                      <ShotFrame label={p.shot} />
                    </div>
                    <div style={{ order: 2 }}>
                      <PillarText p={p} />
                    </div>
                  </>
                ) : (
                  <>
                    <PillarText p={p} />
                    <ShotFrame label={p.shot} />
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="cta" data-reveal style={{ position: "relative", background: "#FAF9F5", color: "#020202", padding: `120px ${GUTTER}`, textAlign: "center" }}>
        <div className="u-up" style={{ fontFamily: "var(--font-hand), cursive", fontSize: 26, color: "#F75C4C", marginBottom: 18 }}>
          ready when you are —
        </div>
        <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 500, lineHeight: 0.92, letterSpacing: "-0.025em", fontSize: "clamp(3rem, 11vw, 10rem)", margin: 0 }}>
          <span className="u-mask">
            <span>Come find</span>
          </span>
          <span className="u-mask">
            <span style={{ fontStyle: "italic" }}>
              your fire<span style={{ color: "#F75C4C", fontStyle: "normal" }}>.</span>
            </span>
          </span>
        </h2>
        <p className="u-up" style={{ margin: "34px auto 40px", fontSize: "clamp(16px, 1.5vw, 20px)", color: "rgba(2,2,2,0.6)", maxWidth: "44ch", transitionDelay: ".15s" }}>
          It&apos;s free, it takes a minute, and there&apos;s a lot waiting for you.
        </p>
        <Link className="fx-btn u-up" href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 56, padding: "0 34px", borderRadius: 100, fontSize: 17, fontWeight: 600, background: "#F75C4C", color: "#FAF9F5", textDecoration: "none", transitionDelay: ".22s" }}>
          Sign up free →
        </Link>
      </section>

      {/* section rail + scroll progress */}
      <div className="fx-rail" style={{ position: "fixed", right: 26, top: "50%", transform: "translateY(-50%)", zIndex: 45, display: "flex", flexDirection: "column", gap: 13 }}>
        {PILLARS.map((p, i) => (
          <a key={p.n} className="fx-rail-item" href={`#p${i + 1}`} style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.05em", color: "rgba(2,2,2,0.32)", textDecoration: "none" }}>
            {p.n}
          </a>
        ))}
      </div>
      <div className="fx-prog" style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 3, zIndex: 45, background: "rgba(2,2,2,0.08)" }}>
        <div className="fx-prog-fill" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "#F75C4C", transform: "scaleY(0)", transformOrigin: "top" }} />
      </div>
    </div>
  );
}

function MarqueeRun({ ariaHidden }: { ariaHidden?: boolean }) {
  const items = ["IBGYAF Winning Project", "Festival of Hope", "Launched in GIIS", "Student Initiative"];
  const doubled = [...items, ...items];
  return (
    <span aria-hidden={ariaHidden} style={{ display: "flex", gap: 34, paddingRight: 34 }}>
      {doubled.map((t, i) => (
        <React.Fragment key={i}>
          <span>{t}</span>
          <span>✶</span>
        </React.Fragment>
      ))}
    </span>
  );
}

const FX_CSS = `
.fx-root{overflow-x:clip;}
.fx-root ::selection{background:#F75C4C;color:#FAF9F5;}
.fx-root .u-mask{display:block;overflow:hidden;padding:.16em .05em .26em;}
.fx-root .u-mask>span{display:block;transform:translateY(116%);transition:transform 1.05s cubic-bezier(.16,.84,.44,1);}
.fx-root .u-up{opacity:0;transform:translateY(42px);transition:opacity .9s ease,transform 1s cubic-bezier(.16,.84,.44,1);}
.fx-root .u-clip{clip-path:inset(0 0 100% 0);transition:clip-path 1.15s cubic-bezier(.16,.84,.44,1);}
.fx-root .in .u-mask>span{transform:none;}
.fx-root .in .u-up{opacity:1;transform:none;}
.fx-root .in .u-clip{clip-path:inset(0 0 0 0);}
@keyframes fx-marq{to{transform:translateX(-50%);}}
@keyframes fx-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(7px);}}
.fx-root .fx-cta-link{position:relative;}
.fx-root .fx-cta-link::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:1.5px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.16,.84,.44,1);}
.fx-root .fx-cta-link:hover::after{transform:scaleX(1);}
.fx-root .fx-btn{transition:transform .2s,background .2s,color .2s;}
.fx-root .fx-btn:hover{transform:translateY(-2px);}
.fx-root .fx-rail-item{transition:color .3s,transform .3s;}
@media(max-width:900px){.fx-root .fx-rail,.fx-root .fx-prog{display:none!important;}.fx-root .fx-grid{grid-template-columns:1fr!important;}}
@media(prefers-reduced-motion:reduce){.fx-root .u-mask>span,.fx-root .u-up,.fx-root .u-clip{transition:none!important;transform:none!important;opacity:1!important;clip-path:none!important;}}
`;
