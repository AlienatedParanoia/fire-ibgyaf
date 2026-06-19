import { CalendarView } from 'fire-platform';

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

const events: any[] = [
  { id: '1', date: today, title: 'Singapore Math Olympiad deadline', type: 'competition' },
  { id: '2', date: tomorrow, title: 'Debate Society meeting', type: 'club' },
  { id: '3', date: nextWeek, title: 'Science Fair submission', type: 'competition' },
  { id: '4', date: nextWeek, title: 'Robotics Club showcase', type: 'club' },
  { id: '5', date: twoWeeks, title: 'Personal deadline: essay', type: 'custom' },
];

export function WithEvents() {
  return <CalendarView events={events} />;
}

export function Empty() {
  return <CalendarView events={[]} />;
}
