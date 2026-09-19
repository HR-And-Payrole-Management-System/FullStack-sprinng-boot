import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { recognitionApi } from '../../api/recognition.api';
import { employeeApi } from '../../api/employee.api';
import { useAuth } from '../../context/AuthContext';
import { coreValueApi } from '../../api/coreValue.api';

export default function GiveRecognitionModal({ show, onHide,  onGiven }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [coreValues, setCoreValues] = useState([]);

    useEffect(() => {
    if (!show) return;
    coreValueApi.getAll().then((res) => setCoreValues(res.data));
    }, [show]);
  const [receiverId, setReceiverId] = useState('');
  const [coreValueId, setCoreValueId] = useState('');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) =>
      setEmployees(res.data.content.filter((e) => e.id !== user?.employeeId))
    );
  }, [show, user]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await recognitionApi.give({
        giverId: user.employeeId,
        receiverId: Number(receiverId),
        coreValueId: coreValueId ? Number(coreValueId) : null,
        message,
        points: Number(points),
      });
      onGiven();
      onHide();
    } catch (err) {
  console.error(err.response?.data); // temporary — check browser console for field-level detail
  setError(err.response?.data?.message || 'Failed to send recognition.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Give Recognition</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>To</Form.Label>
          <Form.Select value={receiverId} onChange={(e) => setReceiverId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Core Value (optional)</Form.Label>
          <Form.Select value={coreValueId} onChange={(e) => setCoreValueId(e.target.value)}>
            <option value="">-- None --</option>
            {coreValues.map((v) => <option key={v.id} value={v.id}>{v.icon} {v.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What did they do?" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Points</Form.Label>
          <Form.Range min={5} max={50} step={5} value={points} onChange={(e) => setPoints(e.target.value)} />
          <div className="text-center small fw-semibold">{points} points</div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !receiverId || !message}>
          {saving ? 'Sending…' : 'Send Recognition'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}