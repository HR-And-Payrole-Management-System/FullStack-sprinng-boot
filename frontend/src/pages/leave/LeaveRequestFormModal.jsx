import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  leaveTypeId: yup.number().typeError('ត្រូវជ្រើសរើសប្រភេទច្បាប់').required('ត្រូវជ្រើសរើសប្រភេទច្បាប់'),
  startDate: yup.string().required('ត្រូវការកាលបរិច្ឆេទចាប់ផ្តើម'),
  endDate: yup.string().required('ត្រូវការកាលបរិច្ឆេទបញ្ចប់')
    .test('after-start', 'End date ត្រូវធំជាង ឬស្មើ Start date', function (value) {
      const { startDate } = this.parent;
      return !startDate || !value || value >= startDate;
    }),
  reason: yup.string().required('ត្រូវការមូលហេតុ').max(500),
});

function LeaveRequestFormModal({ show, leaveTypes, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { leaveTypeId: '', startDate: '', endDate: '', reason: '' },
  });

  useEffect(() => {
    if (show) reset({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Leave Request</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Leave Type *</Form.Label>
                <Form.Select {...register('leaveTypeId')} isInvalid={!!errors.leaveTypeId}>
                  <option value="">-- Select --</option>
                  {leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.defaultDays} days/yr)</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.leaveTypeId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Start Date *</Form.Label>
                <Form.Control type="date" {...register('startDate')} isInvalid={!!errors.startDate} />
                <Form.Control.Feedback type="invalid">{errors.startDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">End Date *</Form.Label>
                <Form.Control type="date" {...register('endDate')} isInvalid={!!errors.endDate} />
                <Form.Control.Feedback type="invalid">{errors.endDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Reason *</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('reason')} isInvalid={!!errors.reason} />
                <Form.Control.Feedback type="invalid">{errors.reason?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LeaveRequestFormModal;