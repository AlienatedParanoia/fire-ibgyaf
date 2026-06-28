"use client";

import * as React from "react";
import { LandingExperience } from "@/components/landing/landing-experience";
import { ensureStarshipShader, type StarshipShaderElement } from "@/components/landing/starship-shader";

/*
 * Landing (Paginated) — implementation of the Claude Design template
 * templates/landing-paginated/LandingPaginated.dc.html.
 *
 * The FIRE LandingExperience with:
 *  - page breaks before the first feature section (#f1) and the CTA band (#cta),
 *  - an animated Starship shader behind the hero (#top) on the first page,
 *  - a contrast adapter that samples the shader's luminance behind each hero
 *    text element and crossfades its colour (light <-> dark) + adaptive halo so
 *    the copy stays legible over the moving animation.
 */

const LP_CSS = `
/* page break before the first feature section (#f1) and the CTA band (#cta). */
.lp-root #f1, .lp-root #cta { break-before: page; page-break-before: always; }

/* First page only: animated Starship shader behind the hero (#top). */
.lp-root #top > starship-shader.starship-bg { position: absolute; inset: 0; z-index: 0; background: #000; }
.lp-root #top > :not(.starship-bg) { position: relative; z-index: 1; }

/* First page fills the viewport; the full-bleed coral marquee band (the hero's
   next sibling) then lands flush at the bottom, acting as the bottom border of
   page one. 86px = band height. */
.lp-root #top {
  min-height: calc(100vh - 86px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Lift hero copy to light so it reads over the black shader (the contrast
   adapter then refines this per-frame). Coral accent spans keep inline color. */
.lp-root #top h1 { color: #FAF9F5 !important; }
.lp-root #top p  { color: rgba(250,249,245,.82) !important; }

@media print {
  .lp-root #top > starship-shader.starship-bg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

export default function LandingPaginatedPage() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ensureStarshipShader();
    const root = rootRef.current;
    if (!root) return;

    let iv = 0;
    let raf = 0;
    let to = 0;
    let cancelled = false;
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dynamically recolour the hero copy each frame so the animated shader never
    // washes it out: sample the luminance directly behind each text element and
    // crossfade its colour (light <-> dark) plus an adaptive halo.
    const startContrastAdapter = (top: HTMLElement, sh: StarshipShaderElement) => {
      const grid = top.querySelector<HTMLElement>(".ed-hero-grid");
      const leftCol = (grid && (grid.children[0] as HTMLElement)) || top;
      const colorEls = [...leftCol.querySelectorAll<HTMLElement>("h1, p, .ed-stat")];
      const haloEls = [...leftCol.querySelectorAll<HTMLElement>(".r-up")].filter(
        (el) => !el.matches("h1, p, .ed-stat")
      );
      const LIGHT = [250, 249, 245],
        DARK = [11, 11, 11];
      const ema = new Map<HTMLElement, number>();
      const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
      const smooth = (e0: number, e1: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
        return t * t * (3 - 2 * t);
      };
      const lumOf = (el: HTMLElement, sb: DOMRect): number | null => {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        const l = sh.sampleRegion(r.left - sb.left, r.top - sb.top, r.width, r.height);
        let s = ema.get(el);
        s = s == null ? l : s + (l - s) * 0.4;
        ema.set(el, s);
        return s;
      };
      const tick = () => {
        if (cancelled) return;
        if (!sh.isConnected || typeof sh.sampleRegion !== "function") {
          raf = requestAnimationFrame(tick);
          return;
        }
        const sb = sh.getBoundingClientRect();
        for (const el of colorEls) {
          const s = lumOf(el, sb);
          if (s == null) continue;
          const t = smooth(0.42, 0.62, s); // 0 = dark bg -> light text, 1 = bright bg -> dark text
          el.style.setProperty(
            "color",
            `rgb(${mix(LIGHT[0], DARK[0], t)},${mix(LIGHT[1], DARK[1], t)},${mix(LIGHT[2], DARK[2], t)})`,
            "important"
          );
          const halo = t > 0.5 ? "250,249,245" : "0,0,0";
          const a = (0.5 * 4 * t * (1 - t) + 0.16).toFixed(2); // strongest at the crossover
          el.style.textShadow = `0 0 12px rgba(${halo},${a}), 0 0 2px rgba(${halo},${a})`;
        }
        for (const el of haloEls) {
          const s = lumOf(el, sb);
          if (s == null) continue;
          el.style.textShadow =
            s > 0.45 ? "0 0 9px rgba(0,0,0,.6)" : "0 1px 10px rgba(250,249,245,.3)";
        }
        // Under reduced motion the shader is a single static frame, so one
        // pass suffices — don't loop continuous GPU readbacks.
        if (!reduce) {
          raf = requestAnimationFrame(() => {
            to = window.setTimeout(tick, 60);
          });
        }
      };
      tick();
    };

    const inject = (): boolean => {
      const top = root.querySelector<HTMLElement>("#top");
      if (!top) return false;
      let sh = top.querySelector<StarshipShaderElement>(":scope > starship-shader.starship-bg");
      if (!sh) {
        sh = document.createElement("starship-shader") as StarshipShaderElement;
        sh.className = "starship-bg";
        top.insertBefore(sh, top.firstChild);
      }
      startContrastAdapter(top, sh);
      return true;
    };

    // LandingExperience mounts #top synchronously, but retry briefly in case.
    if (!inject()) {
      iv = window.setInterval(() => {
        if (inject()) window.clearInterval(iv);
      }, 150);
      window.setTimeout(() => window.clearInterval(iv), 20000);
    }

    return () => {
      cancelled = true;
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      window.clearTimeout(to);
      // Remove the injected shader so a remount (e.g. React StrictMode in dev)
      // starts clean instead of stacking canvases.
      root.querySelector(":scope #top > starship-shader.starship-bg")?.remove();
    };
  }, []);

  return (
    <div ref={rootRef} className="lp-root">
      <style dangerouslySetInnerHTML={{ __html: LP_CSS }} />
      <LandingExperience />
    </div>
  );
}
