import { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { policyApi } from '../../api/policy.api';

export default function PublishVersionModal({ show, onHide, policy, onPublished }) {
  const [content, setContent] = useState(policy?.currentContent || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await policyApi.publishVersion(policy.id, { content });
      onPublished();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Publish New Version — {policy?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        {policy?.currentVersionNumber && (
          <Alert variant="warning" className="py-2 small">
            This will create version {policy.currentVersionNumber + 1} and reset everyone's acknowledgment to 0% — even employees who signed off on version {policy.currentVersionNumber} will need to re-acknowledge.
          </Alert>
        )}
        <Form.Group>
          <Form.Label>Policy Content</Form.Label>
          <Form.Control as="textarea" rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !content}>
          {saving ? 'Publishing…' : 'Publish'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}