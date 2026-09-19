import { Modal, Button } from 'react-bootstrap';

function Row({ label, value }) {
  return (
    <div className="d-flex justify-content-between py-2 border-bottom">
      <span className="text-muted small">{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );
}

function AuditLogDetailModal({ show, log, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Audit Log #{log?.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <Row label="Actor" value={log?.actor} />
        <Row label="Action" value={log?.action} />
        <Row label="Entity Type" value={log?.entityType} />
        <Row label="Entity ID" value={log?.entityId} />
        <Row label="IP Address" value={log?.ipAddress} />
        <Row label="Timestamp" value={log?.createdAt?.replace('T', ' ')} />
        <div className="pt-3">
          <div className="text-muted small mb-1">Description</div>
          <div className="ent-card p-2" style={{ background: 'var(--color-bg)' }}>
            {log?.description || '—'}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuditLogDetailModal;