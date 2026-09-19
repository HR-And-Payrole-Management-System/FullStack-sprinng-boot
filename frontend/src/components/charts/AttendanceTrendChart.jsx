import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TOOLTIP_CONTENT_STYLE, TOOLTIP_LABEL_STYLE, TOOLTIP_ITEM_STYLE } from './chartTheme';

function formatDayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function AttendanceTrendChart({ data, height = 260 }) {
  const chartData = (data || []).map((d) => ({
    ...d,
    label: formatDayLabel(d.date),
  }));

  return (
    <div className="ent-card p-3 h-100">
      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">
        Attendance Trend
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="present" name="Present" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4, fill: '#0F766E' }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="late" name="Late" stroke="#F97316" strokeWidth={2.5} dot={{ r: 4, fill: '#F97316' }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="absent" name="Absent" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 4, fill: '#38BDF8' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceTrendChart;