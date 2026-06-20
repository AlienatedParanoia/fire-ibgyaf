import { Dialog, Button } from 'fire-platform';

export function Open() {
  return (
    <Dialog open={true} onClose={() => {}} title="Delete competition">
      <p className="text-sm text-ink-soft">
        Are you sure you want to delete <strong className="text-ink">Singapore Math Olympiad</strong>?
        This action cannot be undone.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button variant="destructive" size="sm">Delete</Button>
      </div>
    </Dialog>
  );
}

export function FormDialog() {
  return (
    <Dialog open={true} onClose={() => {}} title="Add competition">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Title</label>
          <input
            className="flex h-10 w-full rounded-lg border border-ink/15 bg-panel px-3 py-2 text-sm text-ink"
            placeholder="Competition title"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Deadline</label>
          <input
            type="date"
            className="flex h-10 w-full rounded-lg border border-ink/15 bg-panel px-3 py-2 text-sm text-ink"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="ember" size="sm">Save</Button>
        </div>
      </div>
    </Dialog>
  );
}
