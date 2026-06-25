"use client";

import * as React from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   F.I.R.E — Landing (editorial redesign)
   Hero collage · coral marquee · count-up stats · six feature sections each
   with a bespoke animated SVG icon · CTA. The app's global navbar + footer
   (layout.tsx) wrap this page, so neither is rendered here.
   ───────────────────────────────────────────────────────────────────────── */

type Feature = {
  n: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
  tint: string;
  panelHtml: string; // exact icon-panel inner markup (stars + icon + caption)
};

const FEATURES: Feature[] = [
  {
    n: "01",
    eyebrow: "Discover",
    title: "Competitions",
    desc: "Every contest in Singapore in one searchable feed — filter by category, region, format, or how soon it closes.",
    bullets: ["Deadline-urgency colours", "Save straight to your tracker", "Featured & verified listings"],
    cta: "Browse competitions →",
    href: "/competitions",
    tint: "radial-gradient(120% 120% at 50% 38%,#FFF1EE 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:34px;left:42px;color:#F75C4C;font-size:18px;animation:ed-twinkle 3s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:38px;right:48px;color:#2F6090;font-size:14px;animation:ed-twinkle 3.6s ease-in-out infinite .5s;">✶</span>
      <div class="ed-ico" style="position:relative;width:clamp(160px,20vw,210px);height:clamp(160px,20vw,210px);">
        <svg viewBox="0 0 210 210" width="100%" height="100%" style="overflow:visible;">
          <circle cx="105" cy="105" r="92" fill="none" stroke="rgba(2,2,2,.12)" stroke-width="1.5"/>
          <circle cx="105" cy="105" r="64" fill="none" stroke="rgba(2,2,2,.12)" stroke-width="1.5"/>
          <circle cx="105" cy="105" r="36" fill="none" stroke="rgba(2,2,2,.12)" stroke-width="1.5"/>
          <g style="transform-origin:105px 105px;animation:ed-spin 4.5s linear infinite;">
            <path d="M105 105 L105 13 A92 92 0 0 1 168 39 Z" fill="#F75C4C" opacity=".16"/>
            <line x1="105" y1="105" x2="105" y2="13" stroke="#F75C4C" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          <circle cx="151" cy="74" r="5.5" fill="#F75C4C" style="transform-origin:151px 74px;animation:ed-twinkle 2.4s ease-in-out infinite;"/>
          <circle cx="66" cy="133" r="4.5" fill="#2F6090" style="transform-origin:66px 133px;animation:ed-twinkle 2.8s ease-in-out infinite .6s;"/>
          <circle cx="140" cy="150" r="4" fill="#2F8A5B" style="transform-origin:140px 150px;animation:ed-twinkle 3.2s ease-in-out infinite 1s;"/>
          <circle cx="105" cy="105" r="18" fill="#020202"/>
          <path d="M105 92 L108.5 101.5 L118 105 L108.5 108.5 L105 118 L101.5 108.5 L92 105 L101.5 101.5 Z" fill="#FAF9F5"/>
        </svg>
      </div>
      <span class="ed-cap">discover · 240 live</span>`,
  },
  {
    n: "02",
    eyebrow: "Belong",
    title: "Clubs",
    desc: "Join clubs across every school, not just your own. Rich profiles, the competitions they run, and a one-tap join.",
    bullets: ["Cross-school directory", "Filter by category", "See what they compete in"],
    cta: "Explore clubs →",
    href: "/clubs",
    tint: "radial-gradient(120% 120% at 50% 38%,#EFF4FA 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:40px;right:46px;color:#2F6090;font-size:16px;animation:ed-twinkle 3.2s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:42px;left:46px;color:#F75C4C;font-size:13px;animation:ed-twinkle 3.6s ease-in-out infinite .6s;">✶</span>
      <div class="ed-ico" style="position:relative;width:clamp(170px,21vw,215px);height:clamp(170px,21vw,215px);">
        <svg viewBox="0 0 210 210" width="100%" height="100%" style="overflow:visible;">
          <g style="transform-origin:105px 105px;animation:ed-spin 18s linear infinite;">
            <line x1="105" y1="105" x2="105" y2="34" stroke="rgba(2,2,2,.18)" stroke-width="2"/>
            <line x1="105" y1="105" x2="44" y2="150" stroke="rgba(2,2,2,.18)" stroke-width="2"/>
            <line x1="105" y1="105" x2="166" y2="150" stroke="rgba(2,2,2,.18)" stroke-width="2"/>
            <circle cx="105" cy="34" r="19" fill="#F75C4C" stroke="#FAF9F5" stroke-width="3"/>
            <circle cx="44" cy="150" r="17" fill="#FFD25E" stroke="#FAF9F5" stroke-width="3"/>
            <circle cx="166" cy="150" r="17" fill="#2F8A5B" stroke="#FAF9F5" stroke-width="3"/>
          </g>
          <circle cx="105" cy="105" r="26" fill="#2F6090" stroke="#FAF9F5" stroke-width="3"/>
          <path d="M105 113 C 99 107, 92 109, 92 100 C 92 94, 99 93, 105 99 C 111 93, 118 94, 118 100 C 118 109, 111 107, 105 113 Z" fill="#FAF9F5" style="transform-origin:105px 103px;animation:ed-beat 2.2s ease-in-out infinite;"/>
        </svg>
      </div>
      <span class="ed-cap">belong · 62 clubs</span>`,
  },
  {
    n: "03",
    eyebrow: "Track",
    title: "Tracker",
    desc: "Your status pipeline from Interested to Won, with notes on every entry and a clean CSV export when you need it.",
    bullets: ["Interested → Registered → Won", "Per-item notes", "One-click CSV export"],
    cta: "Open the tracker →",
    href: "/tracker",
    tint: "radial-gradient(120% 120% at 50% 38%,#F1F7F0 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:36px;left:44px;color:#2F8A5B;font-size:15px;animation:ed-twinkle 3.2s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:40px;right:46px;color:#F75C4C;font-size:13px;animation:ed-twinkle 3.6s ease-in-out infinite .5s;">✶</span>
      <div class="ed-ico" style="width:clamp(220px,26vw,266px);display:flex;flex-direction:column;gap:11px;">
        <div style="display:flex;align-items:center;gap:13px;background:#fff;border:1.5px solid #020202;border-radius:12px;padding:12px 15px;box-shadow:3px 3px 0 rgba(2,2,2,.08);">
          <span style="position:relative;width:26px;height:26px;flex:none;border-radius:50%;border:2px solid #020202;"><span style="position:absolute;inset:-2px;border-radius:50%;background:#2F8A5B;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;transform-origin:center;animation:ed-tick 4.2s ease-in-out infinite;">✓</span></span>
          <span style="font-size:13.5px;font-weight:700;color:#020202;">Interested</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;background:#fff;border:1.5px solid #020202;border-radius:12px;padding:12px 15px;box-shadow:3px 3px 0 rgba(2,2,2,.08);">
          <span style="position:relative;width:26px;height:26px;flex:none;border-radius:50%;border:2px solid #020202;"><span style="position:absolute;inset:-2px;border-radius:50%;background:#2F6090;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;transform-origin:center;animation:ed-tick 4.2s ease-in-out infinite .7s;">✓</span></span>
          <span style="font-size:13.5px;font-weight:700;color:#020202;">Registered</span>
        </div>
        <div style="display:flex;align-items:center;gap:13px;background:#FCF3D9;border:1.5px solid #020202;border-radius:12px;padding:12px 15px;box-shadow:3px 3px 0 rgba(2,2,2,.08);">
          <span style="position:relative;width:26px;height:26px;flex:none;border-radius:50%;border:2px solid #020202;"><span style="position:absolute;inset:-2px;border-radius:50%;background:#F75C4C;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;transform-origin:center;animation:ed-tick 4.2s ease-in-out infinite 1.4s;">★</span></span>
          <span style="font-size:13.5px;font-weight:800;color:#020202;">Won 🏆</span>
        </div>
        <div style="margin-top:4px;height:8px;border-radius:5px;background:#EDE7DD;overflow:hidden;"><div style="height:100%;border-radius:5px;background:#F75C4C;transform-origin:left;animation:ed-grow 4.2s ease-in-out infinite;"></div></div>
      </div>
      <span class="ed-cap">track · interested → won</span>`,
  },
  {
    n: "04",
    eyebrow: "Plan",
    title: "Calendar",
    desc: "Every deadline on one colour-coded month — competitions, clubs and your own dates — with live countdowns.",
    bullets: ["Colour-coded by type", "Live deadline countdowns", "Never double-booked"],
    cta: "See the calendar →",
    href: "/calendar",
    tint: "radial-gradient(120% 120% at 50% 38%,#F5F0FB 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:38px;right:46px;color:#7A4FB0;font-size:15px;animation:ed-twinkle 3.2s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:40px;left:46px;color:#F75C4C;font-size:13px;animation:ed-twinkle 3.6s ease-in-out infinite .5s;">✶</span>
      <div class="ed-ico" style="position:relative;width:clamp(186px,22vw,224px);">
        <div style="position:absolute;top:-9px;left:34px;width:8px;height:18px;border-radius:3px;background:#020202;"></div>
        <div style="position:absolute;top:-9px;right:34px;width:8px;height:18px;border-radius:3px;background:#020202;"></div>
        <div style="background:#fff;border:2px solid #020202;border-radius:16px;box-shadow:5px 5px 0 rgba(2,2,2,.1);overflow:hidden;">
          <div style="background:#7A4FB0;height:38px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Newsreader',serif;font-weight:600;font-size:15px;letter-spacing:.12em;">MARCH</div>
          <div style="padding:16px 18px;display:grid;grid-template-columns:repeat(5,1fr);gap:13px;justify-items:center;align-items:center;">
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#F75C4C;animation:ed-twinkle 2.6s ease-in-out infinite;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#2F6090;animation:ed-twinkle 3s ease-in-out infinite .5s;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="position:relative;display:flex;align-items:center;justify-content:center;width:9px;height:9px;">
              <span style="width:9px;height:9px;border-radius:50%;background:#F75C4C;"></span>
              <svg viewBox="0 0 44 44" style="position:absolute;width:34px;height:34px;overflow:visible;"><circle cx="22" cy="22" r="17" fill="none" stroke="#F75C4C" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="107" stroke-dashoffset="107" style="transform:rotate(-90deg);transform-origin:22px 22px;animation:ed-draw 2.6s ease-in-out infinite alternate;"/></svg>
            </span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#2F8A5B;animation:ed-twinkle 3.3s ease-in-out infinite .9s;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#F75C4C;animation:ed-twinkle 2.9s ease-in-out infinite 1.2s;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:rgba(2,2,2,.14);"></span>
          </div>
        </div>
      </div>
      <span class="ed-cap">plan · every deadline</span>`,
  },
  {
    n: "05",
    eyebrow: "Showcase",
    title: "Portfolio",
    desc: "Everything you've done, gathered into a tidy record you can export the moment applications roll around.",
    bullets: ["Auto-built from your activity", "Share or export as PDF", "Ready for uni applications"],
    cta: "Build a portfolio →",
    href: "/portfolio",
    tint: "radial-gradient(120% 120% at 50% 38%,#EEF6F0 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:38px;left:46px;color:#2F8A5B;font-size:15px;animation:ed-twinkle 3.2s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:42px;right:46px;color:#FFD25E;font-size:16px;animation:ed-twinkle 2.8s ease-in-out infinite .5s;">✶</span>
      <div class="ed-ico" style="position:relative;width:clamp(160px,20vw,200px);">
        <div style="background:#fff;border:2px solid #020202;border-radius:13px;box-shadow:5px 5px 0 rgba(2,2,2,.1);padding:18px 18px 20px;animation:ed-rise 5.5s ease-in-out infinite;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <span style="width:34px;height:34px;border-radius:50%;background:#F75C4C;flex:none;"></span>
            <span style="flex:1;display:flex;flex-direction:column;gap:5px;"><span style="height:8px;width:80%;border-radius:4px;background:#020202;"></span><span style="height:6px;width:55%;border-radius:3px;background:rgba(2,2,2,.18);"></span></span>
          </div>
          <span style="display:block;height:6px;width:100%;border-radius:3px;background:rgba(2,2,2,.12);margin-bottom:8px;"></span>
          <span style="display:block;height:6px;width:88%;border-radius:3px;background:rgba(2,2,2,.12);margin-bottom:8px;"></span>
          <span style="display:block;height:6px;width:94%;border-radius:3px;background:rgba(2,2,2,.12);margin-bottom:14px;"></span>
          <span style="display:inline-block;font-size:10px;font-weight:800;letter-spacing:.08em;color:#2F8A5B;background:#E2F2E9;border:1.5px solid #020202;padding:3px 10px;border-radius:6px;">GOLD · 2025</span>
        </div>
        <div style="position:absolute;top:-16px;right:-16px;width:60px;height:60px;">
          <div style="position:absolute;top:30px;left:16px;width:11px;height:30px;background:#F75C4C;transform:rotate(20deg);border:1.5px solid #020202;"></div>
          <div style="position:absolute;top:30px;right:16px;width:11px;height:30px;background:#2F6090;transform:rotate(-20deg);border:1.5px solid #020202;"></div>
          <div style="position:relative;width:46px;height:46px;border-radius:50%;background:#FFD25E;border:2px solid #020202;box-shadow:2px 2px 0 rgba(2,2,2,.18);overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <span style="position:absolute;inset:0;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,255,255,.9) 30deg,transparent 80deg,transparent 360deg);animation:ed-spin 3.5s linear infinite;"></span>
            <svg viewBox="0 0 24 24" width="22" height="22" style="position:relative;"><path d="M12 3 L14.6 9.2 L21 9.6 L16 13.8 L17.7 20 L12 16.3 L6.3 20 L8 13.8 L3 9.6 L9.4 9.2 Z" fill="#020202"/></svg>
          </div>
        </div>
      </div>
      <span class="ed-cap">showcase · export pdf</span>`,
  },
  {
    n: "06",
    eyebrow: "Contribute",
    title: "Submit",
    desc: "Spotted something we're missing? Anyone can suggest a competition or club — no login — and it lands in our review queue.",
    bullets: ["No account needed", "Goes live once approved", "Keeps the list complete"],
    cta: "Submit an opportunity →",
    href: "/submit",
    tint: "radial-gradient(120% 120% at 50% 38%,#FFF1EE 0%,#FBFAF6 72%)",
    panelHtml: `
      <span style="position:absolute;top:38px;right:46px;color:#F75C4C;font-size:16px;animation:ed-twinkle 3s ease-in-out infinite;">✶</span>
      <span style="position:absolute;bottom:42px;left:46px;color:#2F6090;font-size:13px;animation:ed-twinkle 3.6s ease-in-out infinite .5s;">✶</span>
      <div class="ed-ico" style="position:relative;width:clamp(190px,23vw,238px);height:clamp(150px,18vw,184px);">
        <svg viewBox="0 0 238 184" width="100%" height="100%" style="overflow:visible;">
          <path d="M22 156 C 64 156, 70 64, 158 60" fill="none" stroke="#F75C4C" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="7 11" stroke-dashoffset="300" style="animation:ed-draw 3s ease-in-out infinite alternate;"/>
          <g style="transform-origin:150px 60px;animation:ed-fly 4.2s ease-in-out infinite;">
            <path d="M120 36 L196 58 L154 70 L154 96 L139 75 Z" fill="#F75C4C" stroke="#020202" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M196 58 L139 75" fill="none" stroke="#020202" stroke-width="2" stroke-linejoin="round"/>
          </g>
        </svg>
        <div style="position:absolute;left:2px;bottom:2px;width:46px;height:46px;border-radius:50%;background:#F75C4C;border:2px solid #020202;color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;line-height:1;box-shadow:3px 3px 0 #020202;animation:ed-pulse 2s infinite;">+</div>
      </div>
      <span class="ed-cap">contribute · no login</span>`,
  },
];

const MARQUEE_ITEMS = ["IBGYAF Winning Project", "Festival of Hope", "Launched in GIIS", "Student Initiative", "Free Forever"];

const HERO_COLLAGE_HTML = `
  <svg viewBox="0 0 400 400" style="position:absolute;top:30px;left:30px;width:340px;height:340px;z-index:0;opacity:.9;" aria-hidden="true">
    <path d="M321 110c40 48 38 138-8 188s-148 70-205 26-77-141-31-200 204-62 244-14z" fill="#FFD25E" opacity=".5"></path>
  </svg>
  <svg viewBox="0 0 300 300" style="position:absolute;bottom:0;right:0;width:220px;height:220px;z-index:0;animation:ed-spin 60s linear infinite;" aria-hidden="true">
    <circle cx="150" cy="150" r="120" fill="none" stroke="#F75C4C" stroke-width="2" stroke-dasharray="2 14" stroke-linecap="round" opacity=".55"></circle>
  </svg>
  <span style="position:absolute;top:8px;right:60px;color:#F75C4C;font-size:30px;animation:ed-twinkle 3s ease-in-out infinite;">✶</span>
  <span style="position:absolute;bottom:40px;left:0;color:#2F6090;font-size:22px;animation:ed-twinkle 3.6s ease-in-out infinite .6s;">✶</span>
  <div style="position:absolute;top:24px;right:8px;width:268px;background:#FBFAF6;border:1.5px solid #020202;border-radius:16px;padding:16px;box-shadow:6px 6px 0 rgba(2,2,2,.12);z-index:3;animation:ed-float-a 6s ease-in-out infinite;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
      <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#E0402F;background:#FCDAD6;padding:4px 9px;border-radius:6px;">STEM</span>
      <span style="font-size:18px;">🔖</span>
    </div>
    <div style="font-family:'Newsreader',serif;font-size:21px;font-weight:600;line-height:1.1;margin:11px 0 4px;">Singapore Science Olympiad</div>
    <div style="font-size:13px;color:#837D70;">Nanyang Tech · National</div>
    <div style="display:flex;align-items:center;gap:7px;margin-top:13px;padding-top:12px;border-top:1px solid rgba(2,2,2,.1);">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E0402F;animation:ed-pulse 2s infinite;"></span>
      <span style="font-size:13px;font-weight:600;color:#E0402F;">Closes in 3 days</span>
    </div>
  </div>
  <div style="position:absolute;top:6px;left:18px;background:#020202;color:#FAF9F5;border-radius:14px;padding:12px 16px;z-index:4;box-shadow:4px 4px 0 rgba(247,92,76,.5);animation:ed-float-b 7s ease-in-out infinite .4s;">
    <div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FFD25E;margin-bottom:4px;">deadline</div>
    <div style="font-family:'Newsreader',serif;font-size:24px;font-weight:600;display:flex;gap:8px;align-items:baseline;">
      <span>03<span style="font-size:12px;color:#837D70;">d</span></span>
      <span>12<span style="font-size:12px;color:#837D70;">h</span></span>
      <span>40<span style="font-size:12px;color:#837D70;">m</span></span>
    </div>
  </div>
  <div style="position:absolute;bottom:96px;right:34px;display:flex;align-items:center;gap:9px;background:#fff;border:1.5px solid #020202;border-radius:100px;padding:9px 16px 9px 11px;z-index:5;box-shadow:4px 4px 0 rgba(2,2,2,.1);animation:ed-float-c 6.6s ease-in-out infinite .2s;">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#2F8A5B;color:#fff;font-size:13px;">✓</span>
    <span style="font-size:14px;font-weight:600;">Saved to tracker</span>
  </div>
  <div style="position:absolute;bottom:24px;left:6px;display:flex;align-items:center;gap:11px;background:#FBFAF6;border:1.5px solid #020202;border-radius:14px;padding:11px 15px;z-index:4;box-shadow:5px 5px 0 rgba(47,96,144,.25);animation:ed-float-a 7.4s ease-in-out infinite .5s;">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:#2F6090;color:#fff;font-family:'Newsreader',serif;font-weight:600;font-size:16px;">RC</span>
    <div>
      <div style="font-size:14px;font-weight:700;">Robotics Club</div>
      <div style="font-size:12px;color:#837D70;">128 members</div>
    </div>
  </div>`;

const SERIF = "var(--font-serif), Georgia, serif";
const HAND = "var(--font-hand), cursive";

function Eyebrow({ n, text }: { n: string; text: string }) {
  return (
    <div className="r-up" style={{ display: "flex", alignItems: "center", gap: 13, fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "#F75C4C", marginBottom: 22 }}>
      {n} <span style={{ width: 28, height: 1.5, background: "#F75C4C" }} /> {text}
    </div>
  );
}

function FeatureCopy({ f }: { f: Feature }) {
  return (
    <div>
      <Eyebrow n={f.n} text={f.eyebrow} />
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.02em", fontSize: "clamp(2.6rem,6vw,5rem)", margin: "0 0 22px" }}>
        <span className="r-mask"><span>{f.title}<span style={{ color: "#F75C4C" }}>.</span></span></span>
      </h2>
      <p className="r-up" style={{ fontSize: "clamp(16px,1.3vw,19px)", color: "rgba(2,2,2,.62)", maxWidth: "42ch", margin: "0 0 24px", transitionDelay: ".1s" }}>{f.desc}</p>
      <ul className="r-up" style={{ listStyle: "none", margin: "0 0 30px", padding: 0, display: "flex", flexDirection: "column", gap: 11, transitionDelay: ".16s" }}>
        {f.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 16, color: "rgba(2,2,2,.72)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F75C4C", flex: "none" }} />{b}
          </li>
        ))}
      </ul>
      <Link href={f.href} className="ed-cta r-up" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 23, color: "#020202", textDecoration: "none", transitionDelay: ".22s" }}>{f.cta}</Link>
    </div>
  );
}

function FeaturePanel({ f }: { f: Feature }) {
  return (
    <div
      className="ed-feat r-clip"
      style={{ position: "relative", border: "1.5px solid #020202", borderRadius: 18, overflow: "hidden", background: f.tint, boxShadow: "8px 8px 0 rgba(2,2,2,.1)", minHeight: "clamp(320px,40vw,400px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}
      dangerouslySetInnerHTML={{ __html: f.panelHtml }}
    />
  );
}

export function LandingExperience() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $$ = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));

    const raf = requestAnimationFrame(() => root.querySelector("#top")?.classList.add("in"));

    // count-up
    function countUp(el: HTMLElement) {
      const to = parseInt(el.dataset.to || "0", 10);
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(to * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          e.target.querySelectorAll<HTMLElement>(".ed-stat[data-to]").forEach((el) => {
            if (!el.dataset.done) { el.dataset.done = "1"; countUp(el); }
          });
          io.unobserve(e.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    $$("[data-reveal]").forEach((el) => io.observe(el));

    const ghosts = $$<HTMLElement>("[data-ghost]");
    const feats = $$<HTMLElement>("[data-feat]");
    const rail = $$<HTMLElement>(".ed-rail-item");
    const prog = root.querySelector<HTMLElement>("[data-prog]");

    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      const mid = vh / 2;

      ghosts.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = (r.top + r.height / 2 - mid) / vh;
        el.style.transform = `translateY(calc(-50% + ${(d * 40).toFixed(1)}px))`;
      });

      let act = -1, best = 1e9;
      feats.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (r.top < vh * 0.6 && r.bottom > vh * 0.4) {
          const dist = Math.abs(r.top + r.height / 2 - mid);
          if (dist < best) { best = dist; act = i; }
        }
      });
      rail.forEach((it, i) => {
        const on = i === act;
        it.style.color = on ? "#F75C4C" : "rgba(2,2,2,.32)";
        it.style.transform = on ? "scale(1.5)" : "scale(1)";
        it.style.fontWeight = on ? "700" : "400";
      });

      if (prog) {
        const max = document.documentElement.scrollHeight - vh;
        prog.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / (max || 1)))})`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
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
    <div ref={rootRef} className="ed-root" style={{ position: "relative", background: "#FAF9F5", color: "#020202" }}>
      <style>{ED_CSS}</style>

      {/* scroll progress (top bar) */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 60, background: "transparent", pointerEvents: "none" }}>
        <div data-prog style={{ height: "100%", background: "#F75C4C", transform: "scaleX(0)", transformOrigin: "left" }} />
      </div>

      {/* HERO */}
      <section id="top" data-reveal style={{ position: "relative", padding: "54px 28px 60px", maxWidth: 1240, margin: "0 auto" }}>
        <div className="ed-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.08fr .92fr", gap: 48, alignItems: "center" }}>
          <div>
            <div className="r-up" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: HAND, fontSize: 27, color: "#F75C4C", marginBottom: 18, transform: "rotate(-1.5deg)" }}>
              <span>✶</span> for students who keep missing out
            </div>
            <h1 style={{ fontFamily: SERIF, fontWeight: 500, lineHeight: 0.84, letterSpacing: "-0.028em", margin: 0, fontSize: "clamp(3.6rem,8.2vw,7.6rem)", color: "#020202" }}>
              <span className="r-mask"><span>Catch every</span></span>
              <span className="r-mask"><span style={{ fontStyle: "italic" }}>opportunity<span style={{ color: "#F75C4C", fontStyle: "normal" }}>.</span></span></span>
            </h1>
            <p className="r-up" style={{ margin: "30px 0 0", maxWidth: "44ch", fontSize: "clamp(17px,1.4vw,20px)", lineHeight: 1.55, color: "#44413B", transitionDelay: ".12s" }}>
              A student-built directory of every competition and club in Singapore — with reminders, so the good ones never slip past you. <span style={{ color: "#020202", fontWeight: 600 }}>Free, non-profit, no catch.</span>
            </p>
            <div className="r-up" style={{ display: "flex", flexWrap: "wrap", gap: 13, marginTop: 30, transitionDelay: ".2s" }}>
              <Link className="ed-btn" href="/competitions" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 54, padding: "0 28px", borderRadius: 100, fontSize: 16, fontWeight: 700, background: "#F75C4C", color: "#FAF9F5", textDecoration: "none", boxShadow: "4px 4px 0 #020202" }}>Browse competitions →</Link>
              <Link className="ed-btn" href="/signup" style={{ display: "inline-flex", alignItems: "center", height: 54, padding: "0 26px", borderRadius: 100, fontSize: 16, fontWeight: 700, background: "transparent", color: "#020202", border: "1.5px solid #020202", textDecoration: "none" }}>Sign up free</Link>
            </div>
            <div className="r-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22, marginTop: 38, transitionDelay: ".28s" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#F75C4C", color: "#fff", fontSize: 12, fontWeight: 700, border: "2px solid #FAF9F5" }}>SY</span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#2F6090", color: "#fff", fontSize: 12, fontWeight: 700, border: "2px solid #FAF9F5", marginLeft: -9 }}>RK</span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#020202", color: "#FFD25E", fontSize: 12, fontWeight: 700, border: "2px solid #FAF9F5", marginLeft: -9 }}>AL</span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#E3DBD0", color: "#44413B", fontSize: 11, fontWeight: 700, border: "2px solid #FAF9F5", marginLeft: -9 }}>+9</span>
              </div>
              <div style={{ fontSize: 14.5, color: "#837D70", lineHeight: 1.35 }}>Joined by students across<br /><span style={{ color: "#020202", fontWeight: 600 }}>14 Singapore schools</span></div>
            </div>
          </div>
          <div className="ed-collage" style={{ position: "relative", height: 520 }} dangerouslySetInnerHTML={{ __html: HERO_COLLAGE_HTML }} />
        </div>
        <div className="r-up" style={{ position: "absolute", left: "50%", bottom: 8, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#837D70", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", transitionDelay: ".5s" }}>
          <span>Scroll to explore</span>
          <span style={{ fontSize: 17, color: "#F75C4C", animation: "ed-bob 1.8s ease-in-out infinite" }}>↓</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#F75C4C", color: "#020202", overflow: "hidden", padding: "16px 0", borderTop: "1.5px solid #020202", borderBottom: "1.5px solid #020202" }}>
        <div style={{ display: "flex", width: "max-content", animation: "ed-marq 26s linear infinite", fontFamily: SERIF, fontStyle: "italic", fontSize: 32, fontWeight: 500, whiteSpace: "nowrap" }}>
          <MarqueeRun />
          <MarqueeRun ariaHidden />
        </div>
      </div>

      {/* STATS */}
      <section data-reveal style={{ maxWidth: 1240, margin: "0 auto", padding: "74px 28px 30px" }}>
        <div className="ed-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
          <Stat value="240" label="competitions tracked" color="#020202" />
          <Stat value="62" label="clubs across schools" color="#F75C4C" delay=".08s" />
          <Stat value="14" label="Singapore schools" color="#2F6090" delay=".16s" />
          <Stat value="$0" label="forever — non-profit" color="#020202" delay=".24s" static />
        </div>
      </section>

      {/* FEATURES */}
      <div id="features" style={{ position: "relative" }}>
        <div className="ed-rail" style={{ position: "fixed", right: 22, top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          {FEATURES.map((f, i) => (
            <a key={f.n} className="ed-rail-item" href={`#f${i + 1}`} style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: "0.05em", color: "rgba(2,2,2,.32)", textDecoration: "none" }}>{f.n}</a>
          ))}
        </div>

        {FEATURES.map((f, i) => {
          const iconLeft = i % 2 === 1;
          return (
            <section key={f.n} data-feat={i} id={`f${i + 1}`} data-reveal style={{ position: "relative", padding: "72px 28px", overflow: "hidden" }}>
              <div data-ghost style={{ position: "absolute", top: "50%", ...(iconLeft ? { left: "-2vw" } : { right: "-2vw" }), transform: "translateY(-50%)", fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(12rem,30vw,26rem)", lineHeight: 0.7, color: "rgba(2,2,2,.045)", zIndex: 0, pointerEvents: "none", userSelect: "none" }}>{f.n}</div>
              <div className="ed-grid" style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: iconLeft ? ".95fr 1.05fr" : "1.05fr .95fr", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
              {iconLeft ? (<><FeaturePanel f={f} /><FeatureCopy f={f} /></>) : (<><FeatureCopy f={f} /><FeaturePanel f={f} /></>)}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section id="cta" data-reveal style={{ position: "relative", padding: "120px 28px", textAlign: "center", overflow: "hidden" }}>
        <span style={{ position: "absolute", top: "14%", left: "12%", color: "#F75C4C", fontSize: 34, animation: "ed-twinkle 3s ease-in-out infinite" }}>✶</span>
        <span style={{ position: "absolute", bottom: "20%", right: "14%", color: "#2F6090", fontSize: 26, animation: "ed-twinkle 3.4s ease-in-out infinite .5s" }}>✶</span>
        <div className="r-up" style={{ fontFamily: HAND, fontSize: 28, color: "#F75C4C", marginBottom: 14 }}>ready when you are —</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.025em", fontSize: "clamp(3rem,10vw,9.5rem)", margin: 0 }}>
          <span className="r-mask"><span>Come find</span></span>
          <span className="r-mask"><span style={{ fontStyle: "italic" }}>your fire<span style={{ color: "#F75C4C", fontStyle: "normal" }}>.</span></span></span>
        </h2>
        <p className="r-up" style={{ margin: "30px auto 36px", fontSize: "clamp(16px,1.5vw,20px)", color: "rgba(2,2,2,.6)", maxWidth: "44ch", transitionDelay: ".15s" }}>It&apos;s free, it takes a minute, and there&apos;s a lot waiting for you.</p>
        <Link className="ed-btn r-up" href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 58, padding: "0 36px", borderRadius: 100, fontSize: 17, fontWeight: 700, background: "#F75C4C", color: "#FAF9F5", textDecoration: "none", boxShadow: "5px 5px 0 #020202", transitionDelay: ".22s" }}>Sign up free →</Link>
      </section>
    </div>
  );
}

function Stat({ value, label, color, delay, static: isStatic }: { value: string; label: string; color: string; delay?: string; static?: boolean }) {
  return (
    <div className="r-up" style={{ textAlign: "left", transitionDelay: delay }}>
      <div
        className={isStatic ? undefined : "ed-stat"}
        data-to={isStatic ? undefined : value}
        style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(3rem,5vw,4.6rem)", lineHeight: 1, color }}
      >
        {isStatic ? value : "0"}
      </div>
      <div style={{ marginTop: 8, fontSize: 15, color: "#44413B" }}>{label}</div>
    </div>
  );
}

function MarqueeRun({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <span aria-hidden={ariaHidden} style={{ display: "flex", gap: 30, paddingRight: 30 }}>
      {MARQUEE_ITEMS.map((t, i) => (
        <React.Fragment key={i}>
          <span>{t}</span>
          <span>✶</span>
        </React.Fragment>
      ))}
    </span>
  );
}

const ED_CSS = `
.ed-root{overflow-x:clip;}
.ed-root ::selection{background:#F75C4C;color:#FAF9F5;}
.ed-root .ed-cap{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#837D70;background:#fff;border:1px solid rgba(2,2,2,.12);padding:6px 13px;border-radius:100px;}
.ed-root .r-mask{display:block;overflow:hidden;padding:.16em .05em .26em;}
.ed-root .r-mask>span{display:block;transform:translateY(118%);transition:transform 1.05s cubic-bezier(.16,.84,.44,1);}
.ed-root .r-up{opacity:0;transform:translateY(40px);transition:opacity .9s ease,transform 1s cubic-bezier(.16,.84,.44,1);}
.ed-root .r-clip{clip-path:inset(0 0 100% 0);transition:clip-path 1.15s cubic-bezier(.16,.84,.44,1);}
.ed-root .in .r-mask>span{transform:none;}
.ed-root .in .r-up{opacity:1;transform:none;}
.ed-root .in .r-clip{clip-path:inset(0 0 0 0);}
.ed-root .ed-cta{position:relative;}
.ed-root .ed-cta::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:2px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.16,.84,.44,1);}
.ed-root .ed-cta:hover::after{transform:scaleX(1);}
.ed-root .ed-btn{transition:transform .22s cubic-bezier(.16,.84,.44,1),box-shadow .22s,background .22s,color .22s;}
.ed-root .ed-btn:hover{transform:translate(-2px,-2px);}
.ed-root .ed-btn:active{transform:translate(0,0);}
.ed-root .ed-feat{transition:transform .5s cubic-bezier(.16,.84,.44,1),box-shadow .5s;}
.ed-root .ed-feat:hover{transform:translateY(-6px);}
.ed-root .ed-rail-item{transition:color .3s,transform .3s;}
@keyframes ed-marq{to{transform:translateX(-50%);}}
@keyframes ed-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(8px);}}
@keyframes ed-float-a{0%,100%{transform:translate(0,0) rotate(-3deg);}50%{transform:translate(0,-16px) rotate(-3deg);}}
@keyframes ed-float-b{0%,100%{transform:translate(0,0) rotate(4deg);}50%{transform:translate(0,-22px) rotate(4deg);}}
@keyframes ed-float-c{0%,100%{transform:translate(0,0) rotate(-6deg);}50%{transform:translate(0,14px) rotate(-6deg);}}
@keyframes ed-spin{to{transform:rotate(360deg);}}
@keyframes ed-twinkle{0%,100%{opacity:.3;transform:scale(.85);}50%{opacity:1;transform:scale(1.1);}}
@keyframes ed-pulse{0%,100%{box-shadow:0 0 0 0 rgba(247,92,76,.5);}50%{box-shadow:0 0 0 7px rgba(247,92,76,0);}}
@keyframes ed-beat{0%,100%{transform:scale(1);}45%{transform:scale(1.18);}}
@keyframes ed-tick{0%,8%{opacity:.14;transform:scale(.5);}20%{opacity:1;transform:scale(1.14);}32%,84%{opacity:1;transform:scale(1);}100%{opacity:.14;transform:scale(.5);}}
@keyframes ed-draw{to{stroke-dashoffset:0;}}
@keyframes ed-fly{0%,100%{transform:translate(-7px,6px) rotate(-7deg);}50%{transform:translate(9px,-12px) rotate(5deg);}}
@keyframes ed-grow{0%,100%{transform:scaleX(.2);}50%{transform:scaleX(1);}}
@keyframes ed-rise{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@media(max-width:920px){
  .ed-root .ed-hero-grid{grid-template-columns:1fr!important;}
  .ed-root .ed-collage{display:none!important;}
  .ed-root .ed-rail{display:none!important;}
  .ed-root .ed-grid{grid-template-columns:1fr!important;gap:44px!important;}
}
@media(prefers-reduced-motion:reduce){
  .ed-root .r-up,.ed-root .r-mask>span,.ed-root .r-clip{transition:none!important;transform:none!important;opacity:1!important;clip-path:none!important;}
  .ed-root [style*="ed-float"],.ed-root [style*="ed-bob"],.ed-root .ed-ico *{animation:none!important;}
}
`;
