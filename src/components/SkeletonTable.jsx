function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="ent-table" style={{ overflow: 'hidden' }}>
      <table className="table mb-0">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} style={{ padding: '0.85rem 1rem' }}>
                  <div
                    style={{
                      height: 14,
                      borderRadius: 4,
                      background:
                        'linear-gradient(90deg, var(--color-border) 25%, var(--color-bg) 50%, var(--color-border) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'ent-skeleton-shimmer 1.4s ease-in-out infinite',
                      width: c === 0 ? '70%' : `${50 + Math.random() * 40}%`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SkeletonTable;