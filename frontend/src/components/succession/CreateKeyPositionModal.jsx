import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { successionApi } from '../../api/succession.api';
import { positionApi } from '../../api/position.api';
import { employeeApi } from '../../api/employee.api';

const CRITICALITY = ['HIGH', 'MEDIUM', 'LOW'];

export default function CreateKeyPositionModal({ show, onHide, onCreated, initialData }) {
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [positionId, setPositionId] = useState('');
  const [currentHolderId, setCurrentHolderId] = useState('');
  const [criticality, setCriticality] = useState('HIGH');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    positionApi.getAll().then((res) => setPositions(res.data || []));
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setPositionId(initialData.positionIdRaw || '');
      setCurrentHolderId(initialData.currentHolderId || '');
      setCriticality(initialData.criticality || 'HIGH');
      setNotes(initialData.notes || '');
    } else {
      setPositionId('');
      setCurrentHolderId('');
      setCriticality('HIGH');
      setNotes('');
    }
    setError('');
  }, [initialData, show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        positionId: Number(positionId),
        currentHolderId: currentHolderId ? Number(currentHolderId) : null,
        criticality,
        notes,
      };

      if (initialData) {
        await successionApi.updateKeyPosition(initialData.id, payload);
      } else {
        await successionApi.createKeyPosition(payload);
      }

      onCreated();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save key position.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Key Position' : 'Mark Position as Key'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Position</Form.Label>
          <Form.Select value={positionId} onChange={(e) => setPositionId(e.target.value)}>
            <option value="">-- Select Position --</option>
            {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Current Holder (optional)</Form.Label>
          <Form.Select value={currentHolderId} onChange={(e) => setCurrentHolderId(e.target.value)}>
            <option value="">-- Vacant --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Criticality</Form.Label>
          <Form.Select value={criticality} onChange={(e) => setCriticality(e.target.value)}>
            {CRITICALITY.map((c) => <option key={c} value={c}>{c}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Notes</Form.Label>
          <Form.Control as="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !positionId}>
          {saving ? 'Saving…' : initialData ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}