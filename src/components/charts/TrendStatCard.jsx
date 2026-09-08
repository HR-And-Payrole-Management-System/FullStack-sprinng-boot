function TrendStatCard({ label, value, icon, iconBg, iconColor, delta, deltaDirection, note = 'vs Previous Period' }) {
  return (
    <div className="ent-trend-card h-100">
      <div className="ent-trend-icon" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="ent-trend-label">{label}</div>
      <div className="ent-trend-value">{value ?? '—'}</div>

      {/* Always render this line's height, even with no delta,
          so cards without a delta don't end up shorter than ones with one. */}
      <span className={`ent-trend-delta ${deltaDirection || ''}`} style={{ minHeight: '1.1em', display: 'inline-flex' }}>
        {delta != null ? (
          <>
            {deltaDirection === 'up' ? '▲' : '▼'} {delta}
            <span className="ent-trend-delta-note ms-1">{note}</span>
          </>
        ) : (
          '\u00A0' /* non-breaking space — keeps line height reserved */
        )}
      </span>
    </div>
  );
}

export default TrendStatCard;