import { useEffect, useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { policyApi } from '../../api/policy.api';
import { useAuth } from '../../context/AuthContext';
import { employeeApi } from '../../api/employee.api';

export default function MyPoliciesPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acknowledgingId, setAcknowledgingId] = useState(null);

  const load = () => {
    if (!user?.employeeId) { setLoading(false); return; }
    policyApi.getPending(user.employeeId).then((res) => setPending(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const handleAcknowledge = async (policyId) => {
    setAcknowledgingId(policyId);
    try {
      await policyApi.acknowledge(policyId, user.employeeId);
      load();
    } finally {
      setAcknowledgingId(null);
    }
  };

  if (loading) return <div className="ent-page-title">Loading…</div>;

  return (
    <div className="p-6">
      <div className="ent-page-title mb-1">My Policies</div>
      <div className="text-muted small mb-4">Policies requiring your acknowledgment</div>

      {pending.length === 0 && (
        <div className="text-success small">You're all caught up — nothing pending.</div>
      )}

      {pending.map((p) => (
        <div key={p.id} className="ent-card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <div className="fw-semibold">{p.title}</div>
              <div className="text-muted small">{p.category} · v{p.currentVersionNumber}</div>
            </div>
            <Badge bg="warning" text="dark">Action required</Badge>
          </div>

          <div
            className="border rounded p-3 mb-3"
            style={{ maxHeight: 260, overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: 'var(--color-surface-subtle, #f8f9fb)' }}
          >
            {p.currentContent}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAcknowledge(p.id)}
            disabled={acknowledgingId === p.id}
          >
            {acknowledgingId === p.id ? 'Submitting…' : 'I have read and acknowledge this policy'}
          </Button>
        </div>
      ))}
    </div>
  );
}