import { ParticleButton } from 'fire-platform';

export function Default() {
  return <ParticleButton>Get started</ParticleButton>;
}

export function WithClickIcon() {
  return <ParticleButton showIcon>Click me</ParticleButton>;
}

export function Variants() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <ParticleButton variant="ember">Primary</ParticleButton>
      <ParticleButton variant="sketch">Sketch</ParticleButton>
      <ParticleButton variant="outline">Outline</ParticleButton>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <ParticleButton size="sm">Small</ParticleButton>
      <ParticleButton size="default">Default</ParticleButton>
      <ParticleButton size="lg">Large</ParticleButton>
    </div>
  );
}
