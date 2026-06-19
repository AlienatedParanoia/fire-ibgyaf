import { SectionHeading } from 'fire-platform';

export function TitleOnly() {
  return <SectionHeading title="User Management" />;
}

export function WithSubtitle() {
  return <SectionHeading title="Competition Approvals" subtitle="3 awaiting review" />;
}

export function Overview() {
  return <SectionHeading title="Overview" subtitle="Platform health at a glance" />;
}

export function Analytics() {
  return <SectionHeading title="Analytics" subtitle="Engagement & participation insights" />;
}
