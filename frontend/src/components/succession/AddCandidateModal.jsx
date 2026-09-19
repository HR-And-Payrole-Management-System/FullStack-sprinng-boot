import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { successionApi } from '../../api/succession.api';
import { employeeApi } from '../../api/employee.api';

const POTENTIAL = ['LOW', 'MEDIUM', 'HIGH'];
const READINESS = ['READY_NOW', 'READY_1_2_YEARS', 'READY_3_5_YEARS', 'NOT_READY'];

export default function AddCandidateModal({ show, onHide, keyPositionId, onAdded, initialData }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [potentialRating, setPotentialRating] = useState('MEDIUM');
  const [readiness, setReadiness] = useState('READY_1_2_YEARS');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setEmployeeId(initialData.employeeId || '');
      setPotentialRating(initialData.potentialRating || 'MEDIUM');
      setReadiness(initialData.readiness || 'READY_1_2_YEARS');
      setNotes(initialData.developmentNotes || '');
    } else {
      setEmployeeId('');
      setPotentialRating('MEDIUM');
      setReadiness('READY_1_2_YEARS');
      setNotes('');
    }
    setError('');
  }, [initialData, show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        employeeId: Number(employeeId), potentialRating, readiness, developmentNotes: notes,
      };

      if (initialData) {
        await successionApi.updateCandidate(initialData.id, payload);
      } else {
        await successionApi.addCandidate(keyPositionId, payload);
      }

      onAdded();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save candidate.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Succession Candidate' : 'Add Succession Candidate'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Employee</Form.Label>
          <Form.Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Potential Rating</Form.Label>
          <Form.Select value={potentialRating} onChange={(e) => setPotentialRating(e.target.value)}>
            {POTENTIAL.map((p) => <option key={p} value={p}>{p}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Readiness</Form.Label>
          <Form.Select value={readiness} onChange={(e) => setReadiness(e.target.value)}>
            {READINESS.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Development Notes</Form.Label>
          <Form.Control as="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !employeeId}>
          {saving ? 'Saving…' : initialData ? 'Update' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}