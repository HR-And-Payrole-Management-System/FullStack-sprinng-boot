import { useEffect, useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { successionApi } from '../../api/succession.api';
import KeyPositionCard from '../../components/succession/KeyPositionCard';
import CreateKeyPositionModal from '../../components/succession/CreateKeyPositionModal';
import NineBoxGrid from '../../components/succession/NineBoxGrid';

export default function SuccessionPlanningPage() {
  const [positions, setPositions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => successionApi.getAll().then((res) => setPositions(res.data));
  useEffect(() => { load(); }, []);

  const atRiskCount = positions.filter((p) => p.atRisk).length;

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="ent-page-title mb-0">Succession Planning</div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ Mark Key Position</Button>
      </div>

      {atRiskCount > 0 && (
        <div className="mb-3">
          <Badge bg="danger">{atRiskCount} key position{atRiskCount > 1 ? 's' : ''} with no ready-now successor</Badge>
        </div>
      )}

      {positions.map((p) => (
        <KeyPositionCard key={p.id} keyPosition={p} onUpdated={load} />
      ))}
      {positions.length === 0 && <div className="text-muted small">No key positions marked yet.</div>}
      {positions.length > 0 && (
        <div className="mt-4">
            <NineBoxGrid keyPositions={positions} />
        </div>
        )}

      <CreateKeyPositionModal show={showCreate} onHide={() => setShowCreate(false)} onCreated={load} />
    </div>
  );
}