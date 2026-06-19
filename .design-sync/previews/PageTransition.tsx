import { PageTransition } from 'fire-platform';

export function WithContent() {
  return (
    <PageTransition>
      <div className="rounded-xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-ink">Competitions</h1>
        <p className="mt-2 text-ink-soft">
          This page content fades in and slides up 8px on every route change.
        </p>
      </div>
    </PageTransition>
  );
}

export function HeroSection() {
  return (
    <PageTransition>
      <div style={{ padding: '48px 0' }}>
        <h1 className="font-heading text-4xl font-extrabold text-ink">Find. Involve. Reach. Engage.</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Singapore's student extracurricular directory.
        </p>
      </div>
    </PageTransition>
  );
}
