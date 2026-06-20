import { Countdown } from 'fire-platform';

const future = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
const nearFuture = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

export function Days() {
  return <Countdown deadline={future} />;
}

export function Hours() {
  return <Countdown deadline={nearFuture} />;
}

export function NoDeadline() {
  return <Countdown deadline={null} />;
}

export function Closed() {
  return <Countdown deadline="2020-01-01T00:00:00Z" />;
}
