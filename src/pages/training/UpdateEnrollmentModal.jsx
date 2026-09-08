import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const STATUSES = ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const schema = yup.object({
  status: yup.string().required('Status is required'),
  completionDate: yup.string().nullable(),
  score: yup.number().typeError('Must be a number').min(0).max(100).nullable(),
  certificateUrl: yup.string().max(1000).nullable(),
});

function UpdateEnrollmentModal({ show, enrollment, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'ENROLLED', completionDate: '', score: '', certificateUrl: '' },
  });

  useEffect(() => {
    if (show && enrollment) {
      reset({
        status: enrollment.status || 'ENROLLED',
        completionDate: enrollment.completionDate || '',
        score: enrollment.score ?? '',
        certificateUrl: enrollment.certificateUrl || '',
      });
    }
  }, [show, enrollment, reset]);

  if (!enrollment) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Update Enrollment — {enrollment.employeeName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <div className="small text-muted mb-1">{enrollment.trainingProgramTitle}</div>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Status *</Form.Label>
                <Form.Select {...register('status')} isInvalid={!!errors.status}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Completion Date</Form.Label>
                <Form.Control type="date" {...register('completionDate')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Score (0-100)</Form.Label>
                <Form.Control type="number" min={0} max={100} {...register('score')} isInvalid={!!errors.score} />
                <Form.Control.Feedback type="invalid">{errors.score?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Certificate Link</Form.Label>
                <Form.Control {...register('certificateUrl')} placeholder="https://..." />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateEnrollmentModal;