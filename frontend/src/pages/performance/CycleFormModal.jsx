import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះ Cycle').max(150),
  startDate: yup.date().required('ត្រូវការកាលបរិច្ឆេទចាប់ផ្តើម').typeError('កាលបរិច្ឆេទមិនត្រឹមត្រូវ'),
  endDate: yup
    .date()
    .required('ត្រូវការកាលបរិច្ឆេទបញ្ចប់')
    .typeError('កាលបរិច្ឆេទមិនត្រឹមត្រូវ')
    .min(yup.ref('startDate'), 'ត្រូវក្រោយកាលបរិច្ឆេទចាប់ផ្តើម'),
  description: yup.string().max(500).nullable(),
});

function CycleFormModal({ show, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', startDate: '', endDate: '', description: '' },
  });

  useEffect(() => {
    if (show) reset({ name: '', startDate: '', endDate: '', description: '' });
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Performance Cycle</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Cycle Name *</Form.Label>
            <Form.Control placeholder="e.g. 2026 H2 Review" {...register('name')} isInvalid={!!errors.name} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Start Date *</Form.Label>
                <Form.Control type="date" {...register('startDate')} isInvalid={!!errors.startDate} />
                <Form.Control.Feedback type="invalid">{errors.startDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">End Date *</Form.Label>
                <Form.Control type="date" {...register('endDate')} isInvalid={!!errors.endDate} />
                <Form.Control.Feedback type="invalid">{errors.endDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label className="small fw-semibold">Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('description')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Cycle'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CycleFormModal;