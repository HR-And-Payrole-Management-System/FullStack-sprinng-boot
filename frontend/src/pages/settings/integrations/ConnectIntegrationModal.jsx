import { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function ConnectIntegrationModal({ show, integration, submitting, onClose, onSubmit }) {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (show) { setApiKey(''); setWebhookUrl(''); }
  }, [show, integration]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ apiKey, webhookUrl });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Connect {integration?.displayName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {integration?.description}
          </p>
          <Form.Group className="mb-3">
            <Form.Label>API Key / Token</Form.Label>
            <Form.Control
              type="password"
              placeholder="Paste your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Webhook URL (optional)</Form.Label>
            <Form.Control
              placeholder="https://hooks.example.com/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Connecting...' : 'Connect'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ConnectIntegrationModal;