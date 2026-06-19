import { Select } from 'fire-platform';

export function CategorySelect() {
  return (
    <Select style={{ maxWidth: '280px' }}>
      <option value="">All categories</option>
      <option value="mathematics">Mathematics</option>
      <option value="science">Science</option>
      <option value="debate">Debate</option>
      <option value="robotics">Robotics</option>
    </Select>
  );
}

export function RegionSelect() {
  return (
    <Select defaultValue="Singapore" style={{ maxWidth: '280px' }}>
      <option value="">Any region</option>
      <option value="Singapore">Singapore</option>
      <option value="Global">Global</option>
      <option value="Both">Both</option>
    </Select>
  );
}

export function RoleSelect() {
  return (
    <Select style={{ maxWidth: '280px' }}>
      <option value="student">Student</option>
      <option value="club_leader">Club Leader</option>
      <option value="admin">Admin</option>
    </Select>
  );
}

export function Disabled() {
  return (
    <Select disabled style={{ maxWidth: '280px' }}>
      <option>Not available</option>
    </Select>
  );
}
