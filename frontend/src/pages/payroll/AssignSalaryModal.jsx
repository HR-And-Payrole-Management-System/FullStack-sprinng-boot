import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserCog } from 'lucide-react';

const schema = yup.object({
  employeeId: yup.number().typeError('ត្រូវជ្រើសរើសបុគ្គលិក').required('ត្រូវជ្រើសរើសបុគ្គលិក'),
  salaryStructureId: yup.number().typeError('ត្រូវជ្រើសរើស Structure').required('ត្រូវជ្រើសរើស Structure'),
  effectiveDate: yup.string().required('ត្រូវការកាលបរិច្ឆេទចាប់ផ្តើម'),
  endDate: yup.string().nullable(),
});

function AssignSalaryModal({ show, employees, structures, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { employeeId: '', salaryStructureId: '', effectiveDate: '', endDate: '' },
  });

  useEffect(() => {
    if (show) reset({ employeeId: '', salaryStructureId: '', effectiveDate: '', endDate: '' });
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
            <UserCog size={20} strokeWidth={2.25} />
          </div>
          <div>
            <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)' }}>
              Assign Salary Structure
            </Modal.Title>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Link a pay grade to an employee, effective from a chosen date
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

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  Salary Structure *
                </Form.Label>
                <Form.Select {...register('salaryStructureId')} isInvalid={!!errors.salaryStructureId}>
                  <option value="">-- Select Structure --</option>
                  {structures.map((s) => <option key={s.id} value={s.id}>{s.name} (${s.basicSalary})</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.salaryStructureId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  Effective Date *
                </Form.Label>
                <Form.Control type="date" {...register('effectiveDate')} isInvalid={!!errors.effectiveDate} />
                <Form.Control.Feedback type="invalid">{errors.effectiveDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold" style={{ color: 'var(--color-text)' }}>
                  End Date
                </Form.Label>
                <Form.Control type="date" {...register('endDate')} />
              </Form.Group>
            </Col>
          </Row>

          {/* Subtle info strip — reinforces what "effective date" means without needing a tooltip */}
          <div
            className="mt-3 px-3 py-2"
            style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            The structure applies starting from the effective date. Leave end date empty if it's ongoing.
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button className="ent-btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Assign'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AssignSalaryModal;