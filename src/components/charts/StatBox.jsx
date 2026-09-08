function StatBox({ label, value, icon, color, colorSoft }) {
  return (
    <div
      className="ent-statbox"
      style={{ '--box-color': color, '--box-color-soft': colorSoft }}
    >
      <div>
        <div className="ent-statbox-label">{label}</div>
        <div className="ent-statbox-value">{value ?? '—'}</div>
      </div>
      <div className="ent-statbox-icon">{icon}</div>
    </div>
  );
}

export default StatBox;