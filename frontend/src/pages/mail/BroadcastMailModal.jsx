import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { mailApi } from '../../api/mail.api';
import { useToast } from '../../context/ToastContext';

const TARGET_OPTIONS = [
  { value: 'DEPARTMENT', label: 'Department' },
  { value: 'BRANCH', label: 'Branch' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'ALL', label: 'All active employees' },
];

function BroadcastMailModal({ show, onClose, onSent }) {
  const { showToast } = useToast();
  const [targetType, setTargetType] = useState('DEPARTMENT');
  const [targetId, setTargetId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const reset = () => {
    setTargetType('DEPARTMENT');
    setTargetId('');
    setSubject('');
    setBody('');
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      showToast('សូមបំពេញព័ត៌មានទាំងអស់', 'warning');
      return;
    }
    if (targetType !== 'ALL' && !targetId) {
      showToast('សូមជ្រើសរើសគោលដៅ', 'warning');
      return;
    }

    setSending(true);
    try {
      const payload = {
        targetType,
        targetId: targetType === 'ALL' ? null : Number(targetId),
        subject: subject.trim(),
        body: body.trim(),
      };

      const res = await mailApi.broadcast(payload);

      showToast(`Broadcast sent to ${res.data.recipientCount} employees`, 'success');
      reset();
      onSent?.();
      onClose();
    } catch {
      showToast('មិនអាចផ្ញើ broadcast បានទេ', 'danger');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Broadcast Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Send to</Form.Label>
          <Form.Select value={targetType} onChange={(e) => setTargetType(e.target.value)}>
            {TARGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {targetType !== 'ALL' && (
          <Form.Group className="mb-3">
            <Form.Label>Target ID ({targetType.toLowerCase()})</Form.Label>
            <Form.Control
              type="number"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder={`Enter ${targetType.toLowerCase()} ID`}
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={sending}>Cancel</Button>
        <Button variant="primary" onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BroadcastMailModal;