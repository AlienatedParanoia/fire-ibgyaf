import { BrandLoader } from 'fire-platform';

// BrandLoader is the full-screen branded App Router loading fallback: a fixed
// inset:0 overlay with the F.I.R.E mark, animated rings, and a caption. Its
// own background (#FAF9F5) fills the screen in the app. Here each cell frames
// it in a sized box whose `transform` establishes a containing block, so the
// fixed overlay anchors to (and centers within) the frame instead of being
// clipped by the capture harness's render container.

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 420,
        height: 480,
        overflow: 'hidden',
        borderRadius: 18,
        border: '1px solid rgba(33,30,24,0.10)',
        boxShadow: '0 14px 40px rgba(2,2,2,0.10)',
        // Establishes a containing block so BrandLoader's position:fixed
        // overlay is positioned relative to this frame.
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
}

export function Default() {
  return (
    <Frame>
      <BrandLoader />
    </Frame>
  );
}

export function Portfolio() {
  return (
    <Frame>
      <BrandLoader label="Loading your portfolio" />
    </Frame>
  );
}

export function Competitions() {
  return (
    <Frame>
      <BrandLoader label="Fetching competitions" />
    </Frame>
  );
}
