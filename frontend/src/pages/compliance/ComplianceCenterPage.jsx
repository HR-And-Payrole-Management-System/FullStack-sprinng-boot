import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { complianceApi } from '../../api/compliance.api';
import RequirementCard from '../../components/compliance/RequirementCard';
import CreateRequirementModal from '../../components/compliance/CreateRequirementModal';

export default function ComplianceCenterPage() {
  const [requirements, setRequirements] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => complianceApi.getAll().then((res) => setRequirements(res.data));
  useEffect(() => { load(); }, []);

  const overallPercent = requirements.length === 0 ? 100
    : Math.round(requirements.reduce((sum, r) => sum + r.compliancePercent, 0) / requirements.length);

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="ent-page-title mb-0">Compliance Center</div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ New Requirement</Button>
      </div>
      <div className="text-muted small mb-4">Overall compliance rate: <strong>{overallPercent}%</strong> across {requirements.length} requirement(s)</div>

      {requirements.map((r) => <RequirementCard key={r.id} requirement={r} onUpdated={load} />)}
      {requirements.length === 0 && <div className="text-muted small">No compliance requirements defined yet.</div>}

      <CreateRequirementModal show={showCreate} onHide={() => setShowCreate(false)} onSaved={load} />
    </div>
  );
}