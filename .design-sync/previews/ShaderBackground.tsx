import { ShaderBackground } from 'fire-platform';

// ShaderBackground is a full-bleed, aria-hidden WebGL canvas that fills its
// positioned parent. Each cell gives it a sized relative box so the canvas has
// an actual layout box to paint into.

export function Default() {
  return (
    <div
      style={{
        position: 'relative',
        width: 320,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(2,2,2,0.18)',
      }}
    >
      <ShaderBackground className="absolute inset-0" />
    </div>
  );
}

export function LoginHero() {
  // Mirrors the real /login + /signup composition: shader background, a
  // darkening veil for legibility, and a branded glass auth card on top.
  return (
    <div
      style={{
        position: 'relative',
        width: 380,
        height: 460,
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <ShaderBackground className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />
      <div className="w-full max-w-md" style={{ position: 'relative' }}>
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="text-coral" style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">✦</span>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white">
            F.I.R.E <span className="font-normal text-white/80">— Achieve your dreams</span>
          </h1>
          <p className="mt-2 text-sm text-white/80">Log in to track your opportunities and clubs.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-1 text-xs font-medium text-white/80">Email</div>
          <div className="mb-4 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70">
            you@school.edu.sg
          </div>
          <div className="mb-1 text-xs font-medium text-white/80">Password</div>
          <div className="mb-5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70">
            ••••••••
          </div>
          <div
            className="rounded-lg py-2.5 text-center text-sm font-semibold text-white shadow-lg"
            style={{ background: 'linear-gradient(120deg,#f75c4c,#e0402f)' }}
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
}

export function Banner() {
  // A wide hero strip — the shader as a page-section background with a tagline.
  return (
    <div
      style={{
        position: 'relative',
        width: 640,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 36px',
      }}
    >
      <ShaderBackground className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div style={{ position: 'relative' }}>
        <h2 className="font-heading text-2xl font-bold text-white">Find. Involve. Reach. Engage.</h2>
        <p className="mt-1 text-sm text-white/75">Singapore’s student opportunities, all in one place.</p>
      </div>
    </div>
  );
}
