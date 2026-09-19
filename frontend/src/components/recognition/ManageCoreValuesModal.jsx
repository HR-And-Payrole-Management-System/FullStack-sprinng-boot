import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { Trash2 } from 'lucide-react';
import { coreValueApi } from '../../api/coreValue.api';

export default function ManageCoreValuesModal({ show, onHide, onChanged }) {
  const [values, setValues] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => coreValueApi.getAll().then((res) => setValues(res.data));
  useEffect(() => { if (show) load(); }, [show]);

  const handleAdd = async () => {
    setSaving(true);
    try {
      await coreValueApi.create({ name, icon, description });
      setName(''); setIcon(''); setDescription('');
      load();
      onChanged();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await coreValueApi.remove(id);
    load();
    onChanged();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Manage Core Values</Modal.Title></Modal.Header>
      <Modal.Body>
        <ListGroup className="mb-3">
          {values.map((v) => (
            <ListGroup.Item key={v.id} className="d-flex justify-content-between align-items-center">
              <span>{v.icon} {v.name}</span>
              <Button size="sm" variant="light" onClick={() => handleDelete(v.id)}><Trash2 size={14} className="text-danger" /></Button>
            </ListGroup.Item>
          ))}
          {values.length === 0 && <ListGroup.Item className="text-muted small">No core values yet.</ListGroup.Item>}
        </ListGroup>

        <Row className="g-2 align-items-end">
          <Col md={2}>
            <Form.Label className="small">Icon</Form.Label>
            <Form.Control value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🤝" />
          </Col>
          <Col md={4}>
            <Form.Label className="small">Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Teamwork" />
          </Col>
          <Col md={4}>
            <Form.Label className="small">Description</Form.Label>
            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          </Col>
          <Col md={2}>
            <Button size="sm" variant="primary" onClick={handleAdd} disabled={saving || !name} className="w-100">Add</Button>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}