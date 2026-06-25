/**
 * Full-screen branded loading screen — used as the App Router `loading.tsx`
 * fallback, so Next shows it automatically while a page's data is fetched.
 *
 * Pure CSS + a server component (no client JS). The overlay fades in only
 * after ~160ms (`bl-appear` delay), so fast/cached navigations never flash it;
 * genuinely slow loads show the full fire effect. Respects reduced motion.
 */
export function BrandLoader({ label = "loading…" }: { label?: string }) {
  return (
    <div className="bl-overlay" role="status" aria-label="Loading">
      <style>{BL_CSS}</style>
      <div className="bl-stack">
        <div className="bl-mark-wrap">
          <span className="bl-ring" aria-hidden="true" />
          <span className="bl-ring bl-ring-2" aria-hidden="true" />
          <span className="bl-mark fire-gradient" aria-hidden="true">✦</span>
        </div>
        <div className="bl-word">F.I.R.E</div>
        <div className="bl-cap">
          {label}
          <span className="bl-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
        </div>
      </div>
    </div>
  );
}

const BL_CSS = `
.bl-overlay{
  position:fixed; inset:0; z-index:200;
  display:flex; align-items:center; justify-content:center;
  background:#FAF9F5;
  opacity:0; animation:bl-appear .25s ease .16s forwards;
}
.bl-stack{display:flex;flex-direction:column;align-items:center;gap:18px;}
.bl-mark-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:76px;height:76px;}
.bl-mark{
  width:76px;height:76px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-family:var(--font-serif),Georgia,serif;font-size:34px;line-height:1;
  box-shadow:0 10px 30px rgba(247,92,76,.35);
  animation:bl-flicker 2.2s ease-in-out infinite;
}
.bl-ring{
  position:absolute;width:76px;height:76px;border-radius:50%;
  border:2px solid #F75C4C;opacity:0;
  animation:bl-ring 1.8s cubic-bezier(.16,.84,.44,1) infinite;
}
.bl-ring-2{animation-delay:.9s;}
.bl-word{
  font-family:var(--font-serif),Georgia,serif;font-weight:600;font-size:22px;
  letter-spacing:.02em;color:#020202;
}
.bl-cap{font-size:13px;color:#837D70;letter-spacing:.04em;}
.bl-dots i{font-style:normal;opacity:.2;animation:bl-dots 1.2s infinite;}
.bl-dots i:nth-child(2){animation-delay:.2s;}
.bl-dots i:nth-child(3){animation-delay:.4s;}
@keyframes bl-appear{to{opacity:1;}}
@keyframes bl-flicker{0%,100%{transform:scale(1);opacity:1;}45%{transform:scale(1.06);opacity:.9;}70%{transform:scale(.98);opacity:1;}}
@keyframes bl-ring{0%{transform:scale(1);opacity:.55;}100%{transform:scale(1.9);opacity:0;}}
@keyframes bl-dots{0%,100%{opacity:.2;}50%{opacity:1;}}
@media (prefers-reduced-motion: reduce){
  .bl-overlay{opacity:1;animation:none;}
  .bl-mark{animation:none;}
  .bl-ring{display:none;}
  .bl-dots i{animation:none;opacity:.6;}
  .fire-gradient{animation:none;}
}
`;
