import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function toLocalInput(dt) {
  if (!dt) return '';
  return dt.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

function AdjustAttendanceModal({ show, record, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { checkInTime: '', checkOutTime: '', reason: '' },
  });

  useEffect(() => {
    if (show && record) {
      reset({
        checkInTime: toLocalInput(record.checkInTime),
        checkOutTime: toLocalInput(record.checkOutTime),
        reason: '',
      });
    }
  }, [show, record, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Adjust Attendance — {record?.employeeName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Check-in Time</Form.Label>
                <Form.Control type="datetime-local" {...register('checkInTime')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Check-out Time</Form.Label>
                <Form.Control type="datetime-local" {...register('checkOutTime')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Reason *</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('reason', { required: true })} isInvalid={!!errors.reason} placeholder="e.g. Forgot to check out, system error, manager correction..." />
                <Form.Control.Feedback type="invalid">Reason is required</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Adjustment'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AdjustAttendanceModal;