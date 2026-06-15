"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const FIRE = "#FF4D00";
const ELECTRIC = "#0066FF";
export const PIE_COLORS = ["#FF4D00", "#0066FF", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#64748B"];

const axis = { fontSize: 11, fill: "#6B6B80" };

export function LineChartCard({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
        <XAxis dataKey="label" tick={axis} interval="preserveStartEnd" tickLine={false} axisLine={false} />
        <YAxis tick={axis} allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={FIRE}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartCard({
  data,
  color = ELECTRIC,
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
        <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieChartCard({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={86}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartLegend({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {data.map((d, i) => (
        <li key={d.label} className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
          />
          {d.label} <span className="font-medium text-charcoal">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}
