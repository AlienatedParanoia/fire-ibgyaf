import { TeammatesPanel } from 'fire-platform';

// TeammatesPanel loads its teammate list from a Supabase RPC at runtime; there is
// no data prop to inject. In preview Supabase is unconfigured, so the list renders
// empty and the panel shows its header + action bar for each `loggedIn` state.

export function LoggedIn() {
  return (
    <div style={{ maxWidth: 560 }}>
      <TeammatesPanel competitionId="comp-1" loggedIn={true} />
    </div>
  );
}

export function LoggedOut() {
  return (
    <div style={{ maxWidth: 560 }}>
      <TeammatesPanel competitionId="comp-1" loggedIn={false} />
    </div>
  );
}
