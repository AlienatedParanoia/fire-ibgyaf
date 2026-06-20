import { RevealSection } from 'fire-platform';

export function WithHeading() {
  return (
    <RevealSection>
      <h2 className="font-heading text-2xl font-semibold text-ink">
        Discover Singapore's extracurricular world
      </h2>
      <p className="mt-2 text-ink-soft">Find competitions and clubs that match your interests.</p>
    </RevealSection>
  );
}

export function WithDelay() {
  return (
    <RevealSection delay={0.2}>
      <div className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-ink">This section fades in with a 200ms delay.</p>
      </div>
    </RevealSection>
  );
}
