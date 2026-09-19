function KpiCard({ label, value, icon, iconBg, iconColor, delta, deltaDirection }) {
  return (
    <div className="ent-kpi-card">
      <div className="ent-kpi-icon" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div>
        <div className="ent-kpi-label">{label}</div>
        <div className="ent-kpi-value">{value ?? '—'}</div>
        {delta != null && (
          <span className={`ent-kpi-delta ${deltaDirection}`}>
            {deltaDirection === 'up' ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export default KpiCard;