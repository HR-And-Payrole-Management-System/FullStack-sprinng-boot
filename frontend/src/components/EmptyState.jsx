function EmptyState({ icon = '📭', title = 'No data found', subtitle }) {
  return (
    <div className="ent-empty">
      <div className="ent-empty-icon">{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{title}</div>
      {subtitle && <div className="small">{subtitle}</div>}
    </div>
  );
}

export default EmptyState;