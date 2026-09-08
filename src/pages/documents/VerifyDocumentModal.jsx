import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { employeeDocumentService } from '../../services/employeeDocument.service';
import { useToast } from '../../context/ToastContext';

function VerifyDocumentModal({ show, document, onClose, onVerified }) {
  const { showToast } = useToast();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDecision = async (approved) => {
    setSaving(true);
    try {
      await employeeDocumentService.verify(document.id, { approved, note: note || null });
      showToast(approved ? 'ឯកសារត្រូវបានអនុម័ត' : 'ឯកសារត្រូវបានបដិសេធ', 'success');
      setNote('');
      onVerified?.();
      onClose();
    } catch {
      showToast('មិនអាចធ្វើសកម្មភាពនេះបានទេ', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>{document?.documentTypeName}</strong> — {document?.fileName}
        </p>
        <Form.Group>
          <Form.Label>Note (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for rejection, or any remark..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => handleDecision(false)} disabled={saving}>
          Reject
        </Button>
        <Button variant="primary" onClick={() => handleDecision(true)} disabled={saving}>
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerifyDocumentModal;