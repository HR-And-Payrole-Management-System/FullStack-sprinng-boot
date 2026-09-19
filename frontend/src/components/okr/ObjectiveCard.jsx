import { useState } from 'react';
import KeyResultRow from './KeyResultRow';
import AddKeyResultModal from './AddKeyResultModal';

export default function ObjectiveCard({ objective, onUpdated }) {
  const [showAddKr, setShowAddKr] = useState(false);

  return (
    <div className="ent-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-semibold">{objective.title}</div>
          <div className="text-muted small">{objective.ownerName}{objective.parentObjectiveTitle && ` · aligns to "${objective.parentObjectiveTitle}"`}</div>
        </div>
        <div className="text-end">
          <div className="fw-bold">{objective.progressPercent}%</div>
        </div>
      </div>
      <div className="progress mt-2 mb-3" style={{ height: 8 }}>
        <div className="progress-bar bg-success" style={{ width: `${objective.progressPercent}%` }} />
      </div>

      {objective.keyResults.map((kr) => (
        <KeyResultRow key={kr.id} kr={kr} onUpdated={onUpdated} />
      ))}

      <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => setShowAddKr(true)}>+ Add Key Result</button>

      {objective.alignedChildren.length > 0 && (
        <div className="ms-4 mt-3 border-start ps-3">
          {objective.alignedChildren.map((child) => (
            <ObjectiveCard key={child.id} objective={child} onUpdated={onUpdated} />
          ))}
        </div>
      )}

      <AddKeyResultModal show={showAddKr} onHide={() => setShowAddKr(false)} objectiveId={objective.id} onAdded={onUpdated} />
    </div>
  );
}