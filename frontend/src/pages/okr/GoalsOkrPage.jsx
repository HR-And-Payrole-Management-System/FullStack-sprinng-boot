import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { okrApi } from '../../api/okr.api';
import { okrCycleApi } from '../../api/okrCycle.api';
import ObjectiveCard from '../../components/okr/ObjectiveCard';
import CreateObjectiveModal from '../../components/okr/CreateObjectiveModal';
import CreateCycleModal from '../../components/okr/CreateCycleModal';

export default function GoalsOkrPage() {
  const [cycles, setCycles] = useState([]);
  const [cycleId, setCycleId] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateCycle, setShowCreateCycle] = useState(false);

  const loadCycles = () => okrCycleApi.getAll().then((res) => {
    setCycles(res.data);
    if (res.data.length > 0 && !cycleId) setCycleId(res.data[0].id);
  });

  const loadObjectives = () => {
    if (!cycleId) { setObjectives([]); return; }
    okrApi.getTopLevel(cycleId).then((res) => setObjectives(res.data));
  };

  useEffect(() => { loadCycles(); }, []);
  useEffect(() => { loadObjectives(); }, [cycleId]);

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="ent-page-title">Goals & OKRs</div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" style={{ width: 'auto' }} value={cycleId} onChange={(e) => setCycleId(e.target.value)}>
            {cycles.length === 0 && <option value="">No cycles yet</option>}
            {cycles.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.status})</option>)}
          </select>
          <Button variant="outline-primary" size="sm" onClick={() => setShowCreateCycle(true)}>+ New Cycle</Button>
          <Button variant="primary" size="sm" onClick={() => setShowCreate(true)} disabled={!cycleId}>+ New Objective</Button>
        </div>
      </div>

      {objectives.map((o) => (
        <ObjectiveCard key={o.id} objective={o} onUpdated={loadObjectives} />
      ))}
      {cycleId && objectives.length === 0 && <div className="text-muted small">No objectives yet for this cycle.</div>}

      <CreateObjectiveModal show={showCreate} onHide={() => setShowCreate(false)} cycleId={cycleId} existingObjectives={objectives} onCreated={loadObjectives} />
      <CreateCycleModal show={showCreateCycle} onHide={() => setShowCreateCycle(false)} onCreated={loadCycles} />
    </div>
  );
}