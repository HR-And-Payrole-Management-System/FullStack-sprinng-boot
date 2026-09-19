import { useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import AddCandidateModal from './AddCandidateModal';
import CreateKeyPositionModal from './CreateKeyPositionModal';
import { successionApi } from '../../api/succession.api';

const NINEBOX_COLOR = {
  Star: 'success', 'High Performer': 'success', 'High Potential': 'info',
  'Core Player': 'primary', 'Trusted Professional': 'secondary', Effective: 'secondary',
  'Rough Diamond': 'warning', 'Inconsistent Player': 'warning', Risk: 'danger',
};

export default function KeyPositionCard({ keyPosition, onUpdated }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEditPosition, setShowEditPosition] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const deletePosition = async () => {
    if (!window.confirm(`Delete key position "${keyPosition.positionName}"? This removes all its candidates too.`)) return;
    await successionApi.deleteKeyPosition(keyPosition.id);
    onUpdated();
  };

  const deleteCandidate = async (candidateId) => {
    if (!window.confirm('Remove this candidate?')) return;
    await successionApi.deleteCandidate(candidateId);
    onUpdated();
  };

  return (
    <div className={`ent-card p-3 mb-3 ${keyPosition.atRisk ? 'border-danger' : ''}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div className="fw-semibold">{keyPosition.positionName}</div>
          <div className="text-muted small">Held by: {keyPosition.currentHolderName} · Criticality: {keyPosition.criticality}</div>
          {keyPosition.reportingChain?.length > 0 && (
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              Reports up: {keyPosition.reportingChain.join(' → ')}
            </div>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {keyPosition.atRisk && <Badge bg="danger">No ready-now successor</Badge>}
          <Button size="sm" variant="light" onClick={() => setShowEditPosition(true)}><Pencil size={14} /></Button>
          <Button size="sm" variant="light" onClick={deletePosition}><Trash2 size={14} className="text-danger" /></Button>
        </div>
      </div>

      <Table size="sm" hover>
        <thead>
          <tr><th>Candidate</th><th>Performance</th><th>Potential</th><th>Readiness</th><th>9-Box</th><th style={{ width: 90 }}></th></tr>
        </thead>
        <tbody>
          {keyPosition.candidates.map((c) => (
            <tr key={c.id}>
              <td>{c.employeeName}</td>
              <td>{c.latestPerformanceScore != null ? `${c.latestPerformanceScore} (${c.performanceBand})` : 'No review yet'}</td>
              <td>{c.potentialRating}</td>
              <td>{c.readiness.replace(/_/g, ' ')}</td>
              <td><Badge bg={NINEBOX_COLOR[c.nineBoxLabel] || 'secondary'}>{c.nineBoxLabel}</Badge></td>
              <td>
                <div className="d-flex gap-1">
                  <Button size="sm" variant="light" onClick={() => setEditingCandidate(c)}><Pencil size={12} /></Button>
                  <Button size="sm" variant="light" onClick={() => deleteCandidate(c.id)}><Trash2 size={12} className="text-danger" /></Button>
                </div>
              </td>
            </tr>
          ))}
          {keyPosition.candidates.length === 0 && (
            <tr><td colSpan={6} className="text-muted small">No candidates identified yet.</td></tr>
          )}
        </tbody>
      </Table>

      <Button size="sm" variant="outline-primary" onClick={() => setShowAdd(true)}>+ Add Candidate</Button>

      <AddCandidateModal show={showAdd} onHide={() => setShowAdd(false)} keyPositionId={keyPosition.id} onAdded={onUpdated} />
      <AddCandidateModal
        show={!!editingCandidate}
        onHide={() => setEditingCandidate(null)}
        keyPositionId={keyPosition.id}
        initialData={editingCandidate}
        onAdded={onUpdated}
      />
      <CreateKeyPositionModal
        show={showEditPosition}
        onHide={() => setShowEditPosition(false)}
        initialData={showEditPosition ? { ...keyPosition, positionIdRaw: keyPosition.positionId } : null}
        onCreated={onUpdated}
      />
    </div>
  );
}