import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { employeeApi } from '../../api/employee.api';
import { offboardingApi } from '../../api/offboarding.api';
import { offboardingTemplateApi } from '../../api/offboardingTemplate.api';

const REASONS = ['RESIGNATION', 'TERMINATION', 'RETIREMENT', 'CONTRACT_END', 'LAYOFF'];

export default function StartOffboardingModal({ show, onHide, onStarted }) {
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [reason, setReason] = useState('RESIGNATION');
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
    offboardingTemplateApi.getAll().then((res) => setTemplates(res.data));
  }, [show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await offboardingApi.start({
        employeeId: Number(employeeId),
        templateId: Number(templateId),
        reason,
        lastWorkingDate,
      });
      onStarted();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start offboarding.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Start Offboarding</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Employee</Form.Label>
          <Form.Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reason</Form.Label>
          <Form.Select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Working Date</Form.Label>
          <Form.Control
            type="date"
            value={lastWorkingDate}
            onChange={(e) => setLastWorkingDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Template</Form.Label>
          <Form.Select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">-- Select Template --</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={saving || !employeeId || !templateId || !lastWorkingDate}
        >
          {saving ? 'Starting…' : 'Start Offboarding'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}