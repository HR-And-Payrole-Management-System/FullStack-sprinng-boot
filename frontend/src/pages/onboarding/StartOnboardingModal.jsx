import { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { employeeApi } from '../../api/employee.api';
import { onboardingTemplateApi } from '../../api/onboardingTemplate.api';
import { onboardingApi } from '../../api/onboarding.api';

export default function StartOnboardingModal({ show, onHide, onStarted }) {
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
    onboardingTemplateApi.getAll().then((res) => setTemplates(res.data));
  }, [show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await onboardingApi.start({ employeeId: Number(employeeId), templateId: Number(templateId) });
      onStarted();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start onboarding.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Start Onboarding</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <div className="text-danger small mb-2">{error}</div>}
        <Form.Group className="mb-3">
          <Form.Label>Employee</Form.Label>
          <Form.Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Template</Form.Label>
          <Form.Select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">-- Select Template --</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !employeeId || !templateId}>
          {saving ? 'Starting…' : 'Start'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}