
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLTIP_CONTENT_STYLE, TOOLTIP_ITEM_STYLE } from './chartTheme';

const PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)'];

function DonutChart({ data, title, centerLabel, height = 240, showLegend = true }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="ent-card p-3 h-100">
      {title && <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{title}</div>}

      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={2}>
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)' }}>{total}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{centerLabel || 'Total'}</div>
        </div>
      </div>

      {showLegend && (
        <div className="ent-chart-legend">
          {data.map((entry, i) => (
            <span key={entry.name} className="ent-chart-legend-item">
              <span className="ent-chart-legend-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
              {entry.name} ({total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonutChart;