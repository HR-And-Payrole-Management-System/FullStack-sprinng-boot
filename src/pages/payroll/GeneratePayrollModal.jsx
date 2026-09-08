import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  employeeId: yup.number().typeError('ត្រូវជ្រើសរើសបុគ្គលិក').required('ត្រូវជ្រើសរើសបុគ្គលិក'),
  year: yup.number().typeError('ត្រូវជាលេខ').min(2000).required(),
  month: yup.number().typeError('ត្រូវជាលេខ').min(1).max(12).required(),
});

function GeneratePayrollModal({ show, employees, onClose, onSubmit, submitting }) {
  const now = new Date();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { employeeId: '', year: now.getFullYear(), month: now.getMonth() + 1 },
  });

  useEffect(() => {
    if (show) reset({ employeeId: '', year: now.getFullYear(), month: now.getMonth() + 1 });
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Generate Payroll</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Employee *</Form.Label>
                <Form.Select {...register('employeeId')} isInvalid={!!errors.employeeId}>
                  <option value="">-- Select Employee --</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.employeeId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Year *</Form.Label>
                <Form.Control type="number" min={2000} {...register('year')} isInvalid={!!errors.year} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Month *</Form.Label>
                <Form.Select {...register('month')}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-muted mt-2" style={{ fontSize: 'var(--text-xs)' }}>
            ⚠️ Employee must have an active salary structure assigned before generating.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Generating...' : 'Generate'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GeneratePayrollModal;