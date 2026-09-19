import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const STATUS_OPTIONS = ['ACTIVE', 'LOST', 'EXPIRED', 'REISSUED'];
const ACCESS_OPTIONS = [
  { value: 'EMPLOYEE_ACCESS', label: 'Employee Access' },
  { value: 'STAFF_ACCESS', label: 'Staff Access' },
  { value: 'AUTHORIZED_ACCESS', label: 'Authorized Access' },
  { value: 'RESTRICTED_ACCESS', label: 'Restricted Access' },
];

function EditCardModal({ show, card, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { status: 'ACTIVE', accessLevel: 'EMPLOYEE_ACCESS', note: '' },
  });

  useEffect(() => {
    if (show && card) {
      reset({
        status: card.status || 'ACTIVE',
        accessLevel: card.accessLevel || 'EMPLOYEE_ACCESS',
        note: card.note || '',
      });
    }
  }, [show, card, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Edit Card — {card?.employeeName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit((values) => onSubmit(card.id, values))} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Status *</Form.Label>
                <Form.Select {...register('status', { required: true })}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Access Level *</Form.Label>
                <Form.Select {...register('accessLevel', { required: true })}>
                  {ACCESS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  maxLength={500}
                  {...register('note')}
                  placeholder="e.g. Reported lost on Sep 10, reissued same day"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditCardModal;