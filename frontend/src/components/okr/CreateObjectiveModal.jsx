import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { okrApi } from '../../api/okr.api';
import { employeeApi } from '../../api/employee.api';

export default function CreateObjectiveModal({ show, onHide, cycleId, existingObjectives, onCreated }) {
  const [employees, setEmployees] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [parentObjectiveId, setParentObjectiveId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
  }, [show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await okrApi.createObjective({
        cycleId,
        ownerId: Number(ownerId),
        title,
        description,
        parentObjectiveId: parentObjectiveId ? Number(parentObjectiveId) : null,
      });
      onCreated();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create objective.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>New Objective</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Owner</Form.Label>
          <Form.Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">-- Select Owner --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grow revenue 20% this quarter" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Align to Parent Objective (optional)</Form.Label>
          <Form.Select value={parentObjectiveId} onChange={(e) => setParentObjectiveId(e.target.value)}>
            <option value="">-- No parent (top-level) --</option>
            {(existingObjectives || []).map((o) => (
              <option key={o.id} value={o.id}>{o.title} ({o.ownerName})</option>
            ))}
          </Form.Select>
          <Form.Text muted>Pick a parent to make this a team-level objective rolling up into a company objective.</Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !ownerId || !title}>
          {saving ? 'Saving…' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}