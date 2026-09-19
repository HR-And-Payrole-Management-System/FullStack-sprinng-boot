import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PlayCircle, AlertTriangle } from 'lucide-react';

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
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <PlayCircle size={20} strokeWidth={2.25} />
          </div>
          <div>
            <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)' }}>
              Generate Payroll
            </Modal.Title>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Calculate a payroll run for one employee and period
            </div>
          </div>
        </div>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  Employee *
                </Form.Label>
                <Form.Select {...register('employeeId')} isInvalid={!!errors.employeeId}>
                  <option value="">-- Select Employee --</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.employeeId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  Year *
                </Form.Label>
                <Form.Control type="number" min={2000} {...register('year')} isInvalid={!!errors.year} />
                <Form.Control.Feedback type="invalid">{errors.year?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  Month *
                </Form.Label>
                <Form.Select {...register('month')}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Warning notice — real background/border instead of a bare muted line */}
          <div
            className="mt-3 px-3 py-2 d-flex align-items-start gap-2"
            style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-warning-soft)',
              border: '1px solid var(--color-warning)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text)',
            }}
          >
            <AlertTriangle size={15} strokeWidth={2.25} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 1 }} />
            <span>Employee must have an active salary structure assigned before generating.</span>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button className="ent-btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Generating...' : 'Generate'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GeneratePayrollModal;