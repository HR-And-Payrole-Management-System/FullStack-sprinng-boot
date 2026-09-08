import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  employeeId: yup.number().typeError('Employee is required').required('Employee is required'),
  trainingProgramId: yup.number().typeError('Program is required').required('Program is required'),
  enrolledDate: yup.string().nullable(),
});

const emptyValues = { employeeId: '', trainingProgramId: '', enrolledDate: '' };

function EnrollEmployeeModal({ show, employees, programs, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (show) reset(emptyValues);
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Enroll Employee</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Employee *</Form.Label>
                <Form.Select {...register('employeeId')} isInvalid={!!errors.employeeId}>
                  <option value="">-- Select --</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.employeeId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Training Program *</Form.Label>
                <Form.Select {...register('trainingProgramId')} isInvalid={!!errors.trainingProgramId}>
                  <option value="">-- Select --</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.trainingProgramId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Enrolled Date</Form.Label>
                <Form.Control type="date" {...register('enrolledDate')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Enroll'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EnrollEmployeeModal;