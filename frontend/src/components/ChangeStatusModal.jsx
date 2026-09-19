import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED'];

function ChangeStatusModal({ show, employee, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: 'ACTIVE', effectiveDate: '', reason: '' },
  });

  useEffect(() => {
    if (show) {
      reset({
        status: employee?.status || 'ACTIVE',
        effectiveDate: new Date().toISOString().slice(0, 10),
        reason: '',
      });
    }
  }, [show, employee, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Change Status — {employee?.firstName} {employee?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">New Status *</Form.Label>
                <Form.Select {...register('status', { required: true })}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Effective Date *</Form.Label>
                <Form.Control type="date" {...register('effectiveDate', { required: true })} isInvalid={!!errors.effectiveDate} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Reason</Form.Label>
                <Form.Control as="textarea" rows={2} maxLength={500} {...register('reason')} placeholder="Optional note (e.g. resignation reason)" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ChangeStatusModal;