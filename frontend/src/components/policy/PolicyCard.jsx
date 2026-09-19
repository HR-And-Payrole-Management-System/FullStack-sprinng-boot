import { useState } from 'react';
import { Badge, Table, Button } from 'react-bootstrap';
import { Pencil, Archive, Trash2 } from 'lucide-react';
import PublishVersionModal from './PublishVersionModal';
import CreatePolicyModal from './CreatePolicyModal';
import ConfirmModal from '../common/ConfirmModal';
import { policyApi } from '../../api/policy.api';

export default function PolicyCard({ policy, onUpdated }) {
  const [showPublish, setShowPublish] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pending = policy.acknowledgments.filter((a) => !a.acknowledged);

  const handleArchive = async () => {
    await policyApi.archive(policy.id);
    onUpdated();
  };

  const handleDelete = async () => {
    await policyApi.remove(policy.id);
    onUpdated();
  };

  return (
    <div className={`ent-card p-3 mb-3 ${policy.status === 'ARCHIVED' ? 'opacity-50' : ''}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div className="fw-semibold">{policy.title}</div>
          <div className="text-muted small">
            {policy.category} · {policy.scopeLabel}
            {policy.currentVersionNumber && ` · v${policy.currentVersionNumber}`}
          </div>
        </div>
        <div className="text-end">
          <div className="d-flex align-items-center gap-2 justify-content-end mb-1">
            <Badge bg={policy.status === 'PUBLISHED' ? 'success' : policy.status === 'ARCHIVED' ? 'secondary' : 'warning'} text={policy.status === 'DRAFT' ? 'dark' : undefined}>
              {policy.status}
            </Badge>
            <Button size="sm" variant="light" onClick={() => setShowEdit(true)}><Pencil size={14} /></Button>
            {policy.status !== 'ARCHIVED' && (
              <Button size="sm" variant="light" onClick={() => setShowArchiveConfirm(true)}><Archive size={14} /></Button>
            )}
            <Button size="sm" variant="light" onClick={() => setShowDeleteConfirm(true)}><Trash2 size={14} className="text-danger" /></Button>
          </div>
          <Button size="sm" variant="outline-primary" onClick={() => setShowPublish(true)} disabled={policy.status === 'ARCHIVED'}>
            {policy.currentVersionNumber ? 'Publish New Version' : 'Publish First Version'}
          </Button>
        </div>
      </div>

      {policy.currentVersionNumber && policy.requiresAcknowledgment && (
        <>
          <div className="fw-bold small mb-1">{policy.acknowledgmentPercent}% acknowledged ({policy.acknowledgedCount}/{policy.totalInScope})</div>
          <div className="progress mb-3" style={{ height: 6 }}>
            <div className="progress-bar" style={{ width: `${policy.acknowledgmentPercent}%` }} />
          </div>

          {pending.length > 0 && (
            <Table size="sm" hover>
              <thead><tr><th>Employee</th><th>Status</th></tr></thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.employeeId}>
                    <td>{p.employeeName}</td>
                    <td><Badge bg="danger">Not acknowledged</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      <PublishVersionModal show={showPublish} onHide={() => setShowPublish(false)} policy={policy} onPublished={onUpdated} />
      <CreatePolicyModal show={showEdit} onHide={() => setShowEdit(false)} initialData={policy} onCreated={onUpdated} />

      <ConfirmModal
        show={showArchiveConfirm}
        onHide={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchive}
        title="Archive Policy"
        message={`Archive "${policy.title}"? It will stop appearing as an active policy.`}
        confirmLabel="Archive"
        variant="secondary"
      />
      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Policy"
        message={`Permanently delete "${policy.title}" and all its versions/acknowledgments? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}