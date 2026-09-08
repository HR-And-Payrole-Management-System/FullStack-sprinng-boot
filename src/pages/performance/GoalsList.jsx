import { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';

const STATUS_PILL = {
  NOT_STARTED: 'ent-pill-neutral',
  IN_PROGRESS: 'ent-pill-warning',
  COMPLETED: 'ent-pill-success',
  CANCELLED: 'ent-pill-danger',
};

function GoalRow({ goal, canUpdate, onUpdateProgress }) {
  const [value, setValue] = useState(Number(goal.progress) || 0);
  const [saving, setSaving] = useState(false);
  const dirty = value !== Number(goal.progress);

  const save = async () => {
    setSaving(true);
    try {
      await onUpdateProgress(goal.id, value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ent-card p-3 mb-2">
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <div style={{ fontWeight: 700 }}>{goal.title}</div>
          {goal.description && <div className="text-muted small">{goal.description}</div>}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="ent-pill ent-pill-neutral">Weight {Number(goal.weight)}%</span>
          <span className={`ent-pill ${STATUS_PILL[goal.status] || 'ent-pill-neutral'}`}>{goal.status}</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mt-2">
        <ProgressBar now={value} label={`${value}%`} style={{ flex: 1, height: 10 }} />
        {canUpdate && (
          <>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <Button size="sm" variant="light" disabled={!dirty || saving} onClick={save}>
              {saving ? '...' : 'Save'}
            </Button>
          </>
        )}
      </div>
      {goal.targetDate && <div className="text-muted small mt-1">Target: {goal.targetDate}</div>}
    </div>
  );
}

function GoalsList({ goals, canUpdate, onUpdateProgress }) {
  const totalWeight = goals.reduce((s, g) => s + Number(g.weight || 0), 0);

  if (goals.length === 0) {
    return (
      <div className="ent-empty py-4">
        <div className="ent-empty-icon">🎯</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No goals set for this cycle</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-muted small mb-2">
        Total weight allocated: <strong style={{ color: totalWeight === 100 ? 'var(--color-success)' : 'var(--color-warning)' }}>{totalWeight}%</strong>
        {totalWeight !== 100 && <span> (should total 100%)</span>}
      </div>
      {goals.map((g) => (
        <GoalRow key={g.id} goal={g} canUpdate={canUpdate} onUpdateProgress={onUpdateProgress} />
      ))}
    </div>
  );
}

export default GoalsList;