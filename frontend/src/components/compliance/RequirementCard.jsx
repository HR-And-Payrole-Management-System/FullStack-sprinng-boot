import { useState } from 'react';
import { Badge, Table, Button } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import { complianceApi } from '../../api/compliance.api';
import CreateRequirementModal from './CreateRequirementModal';

const STATUS_BADGE = { COMPLIANT: 'success', AT_RISK: 'warning', NON_COMPLIANT: 'danger' };

export default function RequirementCard({ requirement, onUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const issues = requirement.employees.filter((e) => e.status !== 'COMPLIANT');

  const handleDelete = async () => {
    if (!window.confirm(`Delete requirement "${requirement.name}"?`)) return;
    await complianceApi.remove(requirement.id);
    onUpdated();
  };

  return (
    <div className="ent-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div className="fw-semibold">{requirement.name}</div>
          <div className="text-muted small">{requirement.type} · {requirement.scopeLabel}</div>
        </div>
        <div className="text-end">
          <div className="d-flex align-items-center gap-2 justify-content-end mb-1">
            <div className="fw-bold">{requirement.compliancePercent}% compliant</div>
            <Button size="sm" variant="light" onClick={() => setShowEdit(true)}><Pencil size={14} /></Button>
            <Button size="sm" variant="light" onClick={handleDelete}><Trash2 size={14} className="text-danger" /></Button>
          </div>
          <div className="d-flex gap-1 justify-content-end">
            <Badge bg="success">{requirement.compliantCount} OK</Badge>
            {requirement.atRiskCount > 0 && <Badge bg="warning" text="dark">{requirement.atRiskCount} at risk</Badge>}
            {requirement.nonCompliantCount > 0 && <Badge bg="danger">{requirement.nonCompliantCount} non-compliant</Badge>}
          </div>
        </div>
      </div>

      <div className="progress mb-3" style={{ height: 6 }}>
        <div className="progress-bar bg-success" style={{ width: `${requirement.compliancePercent}%` }} />
      </div>

      {issues.length > 0 && (
        <Table size="sm" hover>
          <thead><tr><th>Employee</th><th>Status</th><th>Detail</th></tr></thead>
          <tbody>
            {issues.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.employeeName}</td>
                <td><Badge bg={STATUS_BADGE[e.status]}>{e.status.replace('_', ' ')}</Badge></td>
                <td className="text-muted small">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {issues.length === 0 && <div className="text-success small">Everyone in scope is compliant.</div>}

      <CreateRequirementModal show={showEdit} onHide={() => setShowEdit(false)} initialData={requirement} onSaved={onUpdated} />
    </div>
  );
}