import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះ').max(100),
  description: yup.string().max(255).nullable(),
  defaultDays: yup.number().typeError('ត្រូវជាលេខ').min(0).required('ត្រូវការចំនួនថ្ងៃ'),
  paidLeave: yup.boolean().required(),
});

function LeaveTypeFormModal({ show, initialData, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', defaultDays: 0, paidLeave: true },
  });

  useEffect(() => {
    if (show) reset(initialData || { name: '', description: '', defaultDays: 0, paidLeave: true });
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Leave Type' : 'New Leave Type'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} placeholder="e.g. Annual Leave" />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('description')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Default Days / Year *</Form.Label>
                <Form.Control type="number" min={0} {...register('defaultDays')} isInvalid={!!errors.defaultDays} />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Form.Check type="switch" id="paidLeave" label="Paid Leave" {...register('paidLeave')} className="mb-2" />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LeaveTypeFormModal;