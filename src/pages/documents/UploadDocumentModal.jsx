import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { employeeDocumentService } from '../../services/employeeDocument.service';
import { useToast } from '../../context/ToastContext';

function UploadDocumentModal({ show, employeeId, onClose, onUploaded }) {
  const { showToast } = useToast();
  const [types, setTypes] = useState([]);
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      employeeDocumentService.fetchTypes().then(setTypes).catch(() => setTypes([]));
    }
  }, [show]);

  const reset = () => {
    setDocumentTypeId('');
    setDocumentNumber('');
    setIssueDate('');
    setExpiryDate('');
    setFile(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!documentTypeId || !file) {
      showToast('សូមជ្រើសរើសប្រភេទឯកសារ និងឯកសារឲ្យបានគ្រប់', 'warning');
      return;
    }
    setSaving(true);
    try {
      const uploaded = await employeeDocumentService.uploadFile(file);

      await employeeDocumentService.create(employeeId, {
        documentTypeId: Number(documentTypeId),
        documentNumber: documentNumber || null,
        fileName: uploaded.fileName,
        fileUrl: uploaded.fileUrl,
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
      });

      showToast('ឯកសារត្រូវបាន upload ដោយជោគជ័យ', 'success');
      reset();
      onUploaded?.();
      onClose();
    } catch {
      showToast('មិនអាច upload ឯកសារបានទេ', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Document Type</Form.Label>
          <Form.Select value={documentTypeId} onChange={(e) => setDocumentTypeId(e.target.value)}>
            <option value="">Select type...</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Document Number (optional)</Form.Label>
          <Form.Control value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
        </Form.Group>

        <div className="row">
          <div className="col-6">
            <Form.Group className="mb-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </Form.Group>
          </div>
        </div>

        <Form.Group>
          <Form.Label>File (JPG, PNG, PDF, or Word — max 10MB)</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Uploading...' : 'Upload'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadDocumentModal;