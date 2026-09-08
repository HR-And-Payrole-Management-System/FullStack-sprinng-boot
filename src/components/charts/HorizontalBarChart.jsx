import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TOOLTIP_CONTENT_STYLE, TOOLTIP_ITEM_STYLE } from './chartTheme';

const PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)'];

function HorizontalBarChart({ data, title, height = 280, singleColor }) {
  return (
    <div className="ent-card p-3 h-100">
      {title && <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: 'var(--color-text)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={singleColor || PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorizontalBarChart;