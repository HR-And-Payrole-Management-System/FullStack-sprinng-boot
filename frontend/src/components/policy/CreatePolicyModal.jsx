import { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { policyApi } from '../../api/policy.api';
import { departmentApi } from '../../api/department.api';

export default function CreatePolicyModal({ show, onHide, onCreated, initialData }) {
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [requiresAcknowledgment, setRequiresAcknowledgment] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    departmentApi.getAll().then((res) => setDepartments(res.data || []));
  }, [show]);

  useEffect(() => {
  if (initialData) {
    setTitle(initialData.title);
    setCategory(initialData.category || '');
    setDepartmentId(initialData.departmentId || '');
    setRequiresAcknowledgment(initialData.requiresAcknowledgment);
  } else {
    setTitle(''); setCategory(''); setDepartmentId(''); setRequiresAcknowledgment(true);
  }
  }, [initialData, show]);

    const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = { title, category, departmentId: departmentId ? Number(departmentId) : null, requiresAcknowledgment };
      if (initialData) {
        await policyApi.update(initialData.id, payload);
      } else {
        await policyApi.create(payload);
      }
      onCreated();
      onHide();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>{initialData ? 'Edit Policy' : 'New Policy'}</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Code of Conduct" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. HR, IT Security" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Applies To</Form.Label>
          <Form.Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Company-wide</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Requires employee acknowledgment"
          checked={requiresAcknowledgment}
          onChange={(e) => setRequiresAcknowledgment(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !title}>
          {saving ? 'Saving…' : initialData ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}