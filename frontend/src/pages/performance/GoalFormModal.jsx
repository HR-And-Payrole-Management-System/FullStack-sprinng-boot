import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required('ត្រូវការចំណងជើង Goal').max(200),
  description: yup.string().max(1000).nullable(),
  weight: yup.number().typeError('ត្រូវជាលេខ').required().min(0.01).max(100),
  targetDate: yup.date().nullable().typeError('កាលបរិច្ឆេទមិនត្រឹមត្រូវ'),
});

function GoalFormModal({ show, cycleId, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', description: '', weight: '', targetDate: '' },
  });

  useEffect(() => {
    if (show) reset({ title: '', description: '', weight: '', targetDate: '' });
  }, [show, reset]);

  const submit = (values) => onSubmit({ ...values, cycleId, weight: Number(values.weight) });

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Goal</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <Modal.Body className="pt-2">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Goal Title *</Form.Label>
            <Form.Control {...register('title')} isInvalid={!!errors.title} />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Weight (%) *</Form.Label>
                <Form.Control type="number" step="0.01" min="0.01" max="100" {...register('weight')} isInvalid={!!errors.weight} />
                <Form.Control.Feedback type="invalid">{errors.weight?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Target Date</Form.Label>
                <Form.Control type="date" {...register('targetDate')} />
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
            {submitting ? 'Saving...' : 'Add Goal'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GoalFormModal;