import { useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { offboardingTemplateApi } from '../../api/offboardingTemplate.api';

const ROLES = ['HR', 'IT', 'MANAGER', 'EMPLOYEE'];

export default function OffboardingTemplateFormModal({ show, onHide, onSaved }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([
    { title: '', description: '', assignedRole: 'IT', dueOffsetDays: 0, mandatory: true, sequenceOrder: 1 },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateTask = (idx, field, value) => {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const addTask = () => {
    setTasks((prev) => [...prev, {
      title: '', description: '', assignedRole: 'IT', dueOffsetDays: 0, mandatory: true, sequenceOrder: prev.length + 1,
    }]);
  };

  const removeTask = (idx) => setTasks((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await offboardingTemplateApi.create({ name, description, tasks });
      onSaved();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton><Modal.Title>New Offboarding Template</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <div className="text-danger small mb-2">{error}</div>}

        <Row className="g-3 mb-3">
          <Col md={6}><Form.Group><Form.Label>Template Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Standard Employee Exit" />
          </Form.Group></Col>
          <Col md={6}><Form.Group><Form.Label>Description</Form.Label>
            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group></Col>
        </Row>

        <div className="fw-semibold small mb-2">Tasks (offset is relative to Last Working Date — negative = before)</div>
        {tasks.map((t, idx) => (
          <Row key={idx} className="g-2 mb-2 align-items-end">
            <Col md={4}><Form.Control placeholder="Task title" value={t.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} /></Col>
            <Col md={2}>
              <Form.Select value={t.assignedRole} onChange={(e) => updateTask(idx, 'assignedRole', e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control type="number" placeholder="Offset (days)" value={t.dueOffsetDays}
                onChange={(e) => updateTask(idx, 'dueOffsetDays', Number(e.target.value))} />
            </Col>
            <Col md={2}>
              <Form.Check type="checkbox" label="Mandatory" checked={t.mandatory}
                onChange={(e) => updateTask(idx, 'mandatory', e.target.checked)} />
            </Col>
            <Col md={2}>
              <Button variant="outline-danger" size="sm" onClick={() => removeTask(idx)} disabled={tasks.length === 1}>Remove</Button>
            </Col>
          </Row>
        ))}
        <Button variant="outline-primary" size="sm" onClick={addTask}>+ Add Task</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={handleSubmit} disabled={saving || !name || tasks.some((t) => !t.title)}>
          {saving ? 'Saving…' : 'Save Template'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}