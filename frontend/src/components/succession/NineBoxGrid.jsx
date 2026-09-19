const PERF_COLS = ['LOW', 'MEDIUM', 'HIGH'];
const POTENTIAL_ROWS = ['HIGH', 'MEDIUM', 'LOW']; // top row = highest potential

const CELL_LABEL = {
  'HIGH-HIGH': 'Star', 'HIGH-MEDIUM': 'High Performer', 'HIGH-LOW': 'Trusted Professional',
  'MEDIUM-HIGH': 'High Potential', 'MEDIUM-MEDIUM': 'Core Player', 'MEDIUM-LOW': 'Effective',
  'LOW-HIGH': 'Rough Diamond', 'LOW-MEDIUM': 'Inconsistent Player', 'LOW-LOW': 'Risk',
};

export default function NineBoxGrid({ keyPositions }) {
  // Flatten every candidate across every key position into one dataset,
  // each carrying which position they're being considered for.
  const allCandidates = keyPositions.flatMap((kp) =>
    kp.candidates.map((c) => ({ ...c, positionName: kp.positionName }))
  );

  const cellCandidates = (potential, perfBand) =>
    allCandidates.filter((c) => c.potentialRating === potential && c.performanceBand === perfBand);

  return (
    <div className="ent-card p-3 mb-4">
      <div className="fw-semibold mb-3">9-Box Grid (all key positions)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(3, 1fr)', gap: 8 }}>
        <div />
        {PERF_COLS.map((p) => (
          <div key={p} className="text-center text-muted small fw-semibold">{p} PERFORMANCE</div>
        ))}

        {POTENTIAL_ROWS.map((potential) => (
          <>
            <div key={potential} className="text-muted small fw-semibold d-flex align-items-center">{potential} POTENTIAL</div>
            {PERF_COLS.map((perf) => {
              const cell = cellCandidates(potential, perf);
              return (
                <div
                  key={`${potential}-${perf}`}
                  className="border rounded p-2"
                  style={{ minHeight: 90, background: 'var(--color-surface-subtle, #f8f9fb)' }}
                >
                  <div className="text-muted mb-1" style={{ fontSize: '0.65rem' }}>
                    {CELL_LABEL[`${potential}-${perf}`]}
                  </div>
                  {cell.map((c) => (
                    <div key={c.id} className="badge bg-white border text-dark mb-1 d-block text-start" style={{ fontSize: '0.7rem' }}>
                      {c.employeeName}
                      <div className="text-muted" style={{ fontSize: '0.6rem' }}>{c.positionName}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}