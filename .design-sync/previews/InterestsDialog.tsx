import { InterestsDialog } from 'fire-platform';

// Open state: a student revisiting their interest picker with a few
// categories already chosen (active chips show a check + brand colour).
export function Open() {
  return (
    <InterestsDialog
      open={true}
      onClose={() => {}}
      initialInterests={['STEM', 'Math', 'Debate']}
      onSaved={() => {}}
    />
  );
}

// First-time student with nothing selected yet — all chips in their
// neutral, unselected state.
export function NothingSelected() {
  return (
    <InterestsDialog
      open={true}
      onClose={() => {}}
      initialInterests={[]}
      onSaved={() => {}}
    />
  );
}
