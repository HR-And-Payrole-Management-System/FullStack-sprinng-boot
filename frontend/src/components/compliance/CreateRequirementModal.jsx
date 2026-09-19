import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { complianceApi } from '../../api/compliance.api';
import { departmentApi } from '../../api/department.api';
import { documentTypeApi } from '../../api/documentType.api';
import { trainingProgramApi } from '../../api/trainingProgram.api';

export default function CreateRequirementModal({ show, onHide, onSaved, initialData }) {
  const [departments, setDepartments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('DOCUMENT');
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [trainingProgramId, setTrainingProgramId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    departmentApi.getAll().then((res) => setDepartments(res.data || []));
    documentTypeApi.getAll().then((res) => setDocumentTypes(res.data || []));
    trainingProgramApi.getAll().then((res) => setTrainingPrograms(res.data || []));
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setType(initialData.type);
      setDocumentTypeId(initialData.documentTypeId || '');
      setTrainingProgramId(initialData.trainingProgramId || '');
      setDepartmentId(initialData.departmentId || '');
    } else {
      setName(''); setDescription(''); setType('DOCUMENT');
      setDocumentTypeId(''); setTrainingProgramId(''); setDepartmentId('');
    }
    setError('');
  }, [initialData, show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        name, description, type,
        documentTypeId: type === 'DOCUMENT' ? Number(documentTypeId) : null,
        trainingProgramId: type === 'TRAINING' ? Number(trainingProgramId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
      };
      if (initialData) {
        await complianceApi.update(initialData.id, payload);
      } else {
        await complianceApi.create(payload);
      }
      onSaved();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save requirement.');
    } finally {
      setSaving(false);
    }
  };

  const scopePreview = departmentId
    ? departments.find((d) => String(d.id) === String(departmentId))?.name
    : 'Company-wide (applies to everyone)';

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Compliance Requirement' : 'New Compliance Requirement'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Work Permit Renewal" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="DOCUMENT">Document-based (checks EmployeeDocument + expiry)</option>
            <option value="TRAINING">Training-based (checks completed enrollment)</option>
          </Form.Select>
        </Form.Group>

        {type === 'DOCUMENT' ? (
          <Form.Group className="mb-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select value={documentTypeId} onChange={(e) => setDocumentTypeId(e.target.value)}>
              <option value="">-- Select Document Type --</option>
              {documentTypes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Form.Select>
          </Form.Group>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Training Program</Form.Label>
            <Form.Select value={trainingProgramId} onChange={(e) => setTrainingProgramId(e.target.value)}>
              <option value="">-- Select Training Program --</option>
              {trainingPrograms.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </Form.Select>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Applies To</Form.Label>
          <Form.Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Company-wide (everyone)</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Form.Select>
          <Form.Text className="fw-semibold">Scope: {scopePreview}</Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving || !name || (type === 'DOCUMENT' ? !documentTypeId : !trainingProgramId)}
        >
          {saving ? 'Saving…' : initialData ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}