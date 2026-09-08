import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះ').max(150),
  basicSalary: yup.number().typeError('ត្រូវជាលេខ').min(0).required('ត្រូវការ Basic Salary'),
  housingAllowance: yup.number().typeError('ត្រូវជាលេខ').min(0),
  transportAllowance: yup.number().typeError('ត្រូវជាលេខ').min(0),
  mealAllowance: yup.number().typeError('ត្រូវជាលេខ').min(0),
});

function money(n) {
  const num = Number(n) || 0;
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function SalaryStructureFormModal({ show, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', basicSalary: '', housingAllowance: 0, transportAllowance: 0, mealAllowance: 0 },
  });

  useEffect(() => {
    if (show) reset({ name: '', basicSalary: '', housingAllowance: 0, transportAllowance: 0, mealAllowance: 0 });
  }, [show, reset]);

  const values = watch();
  const total =
    (Number(values.basicSalary) || 0) +
    (Number(values.housingAllowance) || 0) +
    (Number(values.transportAllowance) || 0) +
    (Number(values.mealAllowance) || 0);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
            }}
          >
            💰
          </div>
          <div>
            <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.2 }}>
              New Salary Structure
            </Modal.Title>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Define a reusable pay grade to assign to employees
            </div>
          </div>
        </div>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Structure Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} placeholder="e.g. Senior Engineer Grade" size="lg" />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--chart-1)', display: 'inline-block' }} />
                  Basic Salary *
                </Form.Label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', fontWeight: 600 }}>$</span>
                  <Form.Control
                    type="number" step="0.01" min={0}
                    {...register('basicSalary')}
                    isInvalid={!!errors.basicSalary}
                    style={{ paddingLeft: 26, borderLeft: '3px solid var(--chart-1)', fontWeight: 600 }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">{errors.basicSalary?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--chart-3)', display: 'inline-block' }} />
                  🏠 Housing
                </Form.Label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }}>$</span>
                  <Form.Control
                    type="number" step="0.01" min={0}
                    {...register('housingAllowance')}
                    style={{ paddingLeft: 26, borderLeft: '3px solid var(--chart-3)' }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--chart-4)', display: 'inline-block' }} />
                  🚗 Transport
                </Form.Label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }}>$</span>
                  <Form.Control
                    type="number" step="0.01" min={0}
                    {...register('transportAllowance')}
                    style={{ paddingLeft: 26, borderLeft: '3px solid var(--chart-4)' }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--chart-2)', display: 'inline-block' }} />
                  🍽️ Meal
                </Form.Label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }}>$</span>
                  <Form.Control
                    type="number" step="0.01" min={0}
                    {...register('mealAllowance')}
                    style={{ paddingLeft: 26, borderLeft: '3px solid var(--chart-2)' }}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Live total preview — makes the impact of each field visible immediately */}
          <div
            className="mt-4 p-3 d-flex align-items-center justify-content-between"
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
              color: '#fff',
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Monthly Package
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{money(total)}</div>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.9 }}>💼</div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Structure'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SalaryStructureFormModal;