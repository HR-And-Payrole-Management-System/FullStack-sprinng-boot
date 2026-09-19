import { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { benefitApi } from '../../api/benefit.api';

const TYPES = ['EMPLOYER_CONTRIBUTION', 'EMPLOYEE_DEDUCTION', 'ALLOWANCE'];

export default function BenefitRuleFormModal({ show, onHide, onSaved }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('EMPLOYEE_DEDUCTION');
  const [percentage, setPercentage] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await benefitApi.createRule({
        name, type,
        percentage: percentage ? Number(percentage) : null,
        fixedAmount: fixedAmount ? Number(fixedAmount) : null,
      });
      onSaved();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save benefit rule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>New Benefit Rule</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Health Insurance" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </Form.Select>
        </Form.Group>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Percentage of basic (%)</Form.Label>
              <Form.Control type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Fixed amount</Form.Label>
              <Form.Control type="number" value={fixedAmount} onChange={(e) => setFixedAmount(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Form.Text muted>Fill either percentage OR fixed amount (or both if the rule needs both).</Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !name || (!percentage && !fixedAmount)}>
          {saving ? 'Saving…' : 'Save Rule'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}