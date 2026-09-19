import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { policyApi } from '../../api/policy.api';
import PolicyCard from '../../components/policy/PolicyCard';
import CreatePolicyModal from '../../components/policy/CreatePolicyModal';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => policyApi.getAll().then((res) => setPolicies(res.data));
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="ent-page-title">Policies</div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ New Policy</Button>
      </div>

      {policies.map((p) => <PolicyCard key={p.id} policy={p} onUpdated={load} />)}
      {policies.length === 0 && <div className="text-muted small">No policies created yet.</div>}

      <CreatePolicyModal show={showCreate} onHide={() => setShowCreate(false)} onCreated={load} />
    </div>
  );
}