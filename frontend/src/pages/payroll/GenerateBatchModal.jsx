import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Zap, AlertTriangle } from 'lucide-react';

const schema = yup.object({
  year: yup.number().typeError('ត្រូវជាលេខ').min(2000).required(),
  month: yup.number().typeError('ត្រូវជាលេខ').min(1).max(12).required(),
});

function GenerateBatchModal({ show, onClose, onSubmit, submitting }) {
  const now = new Date();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { year: now.getFullYear(), month: now.getMonth() + 1 },
  });

  useEffect(() => {
    if (show) reset({ year: now.getFullYear(), month: now.getMonth() + 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Zap size={20} strokeWidth={2.25} />
          </div>
          <div>
            <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)' }}>
              Generate Payroll for All Employees
            </Modal.Title>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Batch-create payroll for every active employee at once
            </div>
          </div>
        </div>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-3">
          <Row className="g-3">
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
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('en', { month: 'long' })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

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
            <span>
              Generates payroll for every active employee for this period. Employees who
              already have payroll for this month, or have no salary structure assigned,
              are skipped automatically.
            </span>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button className="ent-btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Generating...' : 'Generate for All'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GenerateBatchModal;