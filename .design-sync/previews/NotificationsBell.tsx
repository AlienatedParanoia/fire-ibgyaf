import { NotificationsBell } from 'fire-platform';

// NotificationsBell is the navbar bell: an icon button that opens a dropdown of
// recent notifications and an email-reminder toggle. In a static preview it
// renders the closed bell button (it fetches its list from Supabase on click,
// which degrades to empty when unconfigured). Realistic props below; shown in
// the surfaces it actually lives on.

const USER_ID = '4f6a1c2e-8b3d-4e7a-9f10-2c5d6e7a8b90';

export function Default() {
  return (
    <div
      className="bg-paper"
      style={{ display: 'inline-flex', padding: 24, borderRadius: 16 }}
    >
      <NotificationsBell userId={USER_ID} emailReminders={true} />
    </div>
  );
}

export function InNavbar() {
  // The bell where it actually sits: the right edge of the top navbar.
  return (
    <div
      className="bg-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        width: 620,
        padding: '12px 20px',
        borderRadius: 14,
        border: '1px solid rgba(33,30,24,0.10)',
        boxShadow: '0 6px 20px rgba(2,2,2,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="text-coral" style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">✦</span>
        <span className="font-heading text-lg font-bold text-ink">F.I.R.E</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span className="text-sm font-medium text-ink-soft">Dashboard</span>
        <span className="text-sm font-medium text-ink-soft">Clubs</span>
        <span className="text-sm font-medium text-ink-soft">Competitions</span>
        <NotificationsBell userId={USER_ID} emailReminders={false} />
      </div>
    </div>
  );
}
