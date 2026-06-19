import { Input } from 'fire-platform';

export function Default() {
  return <Input placeholder="Search competitions…" style={{ maxWidth: '320px' }} />;
}

export function WithValue() {
  return <Input defaultValue="Singapore Math Olympiad" style={{ maxWidth: '320px' }} />;
}

export function Email() {
  return <Input type="email" placeholder="you@school.edu.sg" style={{ maxWidth: '320px' }} />;
}

export function Password() {
  return <Input type="password" placeholder="••••••••" style={{ maxWidth: '320px' }} />;
}

export function Disabled() {
  return <Input placeholder="Not editable" disabled style={{ maxWidth: '320px' }} />;
}
