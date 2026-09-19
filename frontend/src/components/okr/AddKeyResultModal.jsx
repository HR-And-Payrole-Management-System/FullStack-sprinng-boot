import { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { okrApi } from '../../api/okr.api';

const METRIC_TYPES = ['NUMBER', 'PERCENTAGE', 'BOOLEAN'];

export default function AddKeyResultModal({ show, onHide, objectiveId, onAdded }) {
  const [title, setTitle] = useState('');
  const [metricType, setMetricType] = useState('NUMBER');
  const [startValue, setStartValue] = useState('0');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await okrApi.addKeyResult(objectiveId, {
        title, metricType, startValue: Number(startValue), targetValue: Number(targetValue), unit,
      });
      onAdded();
      onHide();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Add Key Result</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Close 50 new deals" />
        </Form.Group>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Metric Type</Form.Label>
              <Form.Select value={metricType} onChange={(e) => setMetricType(e.target.value)}>
                {METRIC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Start</Form.Label>
              <Form.Control type="number" value={startValue} onChange={(e) => setStartValue(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Target</Form.Label>
              <Form.Control type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mt-3">
          <Form.Label>Unit (optional)</Form.Label>
          <Form.Control value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="deals, %, $" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !title || !targetValue}>
          {saving ? 'Saving…' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}