function sum(arr) {
  return arr.reduce((s, d) => s + (d.value || 0), 0);
}

function InsightSummaryBar({ trend, attritionByDept, ageGroups, gender }) {
  const currentHeadcount = trend?.length ? trend[trend.length - 1].value : 0;
  const previousHeadcount = trend?.length > 1 ? trend[trend.length - 2].value : currentHeadcount;
  const growth = previousHeadcount ? (((currentHeadcount - previousHeadcount) / previousHeadcount) * 100).toFixed(1) : '0.0';
  const totalAttrition = sum(attritionByDept);
  const totalTracked = sum(ageGroups) || sum(gender) || currentHeadcount || 1;
  const attritionRate = ((totalAttrition / totalTracked) * 100).toFixed(1);
  const largestDept = [...(attritionByDept || [])].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="ent-card p-3 mb-3">
      <div className="d-flex flex-wrap gap-4">
        <div>
          <div className="text-muted small">Headcount Growth</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: growth >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}%
          </div>
        </div>
        <div>
          <div className="text-muted small">Attrition Rate</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-warning)' }}>{attritionRate}%</div>
        </div>
        <div>
          <div className="text-muted small">Highest Attrition Dept</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{largestDept?.name || '—'}</div>
        </div>
        <div>
          <div className="text-muted small">Total Separations (tracked)</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-danger)' }}>{totalAttrition}</div>
        </div>
      </div>
    </div>
  );
}

export default InsightSummaryBar;