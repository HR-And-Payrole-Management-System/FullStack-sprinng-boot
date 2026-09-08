import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const STATUSES = ['ACTIVE', 'INACTIVE'];

const schema = yup.object({
  title: yup.string().required('Title is required').max(150),
  provider: yup.string().max(150).nullable(),
  durationHours: yup.number().typeError('Must be a number').min(1, 'At least 1 hour').nullable(),
  description: yup.string().max(1000).nullable(),
  startDate: yup.string().nullable(),
  endDate: yup.string().nullable(),
  status: yup.string().nullable(),
});

const emptyValues = { title: '', provider: '', durationHours: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' };

function TrainingProgramFormModal({ show, initialData, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              title: initialData.title,
              provider: initialData.provider || '',
              durationHours: initialData.durationHours ?? '',
              description: initialData.description || '',
              startDate: initialData.startDate || '',
              endDate: initialData.endDate || '',
              status: initialData.status || 'ACTIVE',
            }
          : emptyValues
      );
    }
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Training Program' : 'New Training Program'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Title *</Form.Label>
                <Form.Control {...register('title')} isInvalid={!!errors.title} placeholder="e.g. Advanced Excel for Finance" />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Duration (hours)</Form.Label>
                <Form.Control type="number" min={1} {...register('durationHours')} isInvalid={!!errors.durationHours} />
                <Form.Control.Feedback type="invalid">{errors.durationHours?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={isEdit ? 6 : 8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Provider</Form.Label>
                <Form.Control {...register('provider')} placeholder="e.g. Internal, Coursera, Udemy" />
              </Form.Group>
            </Col>
            {isEdit && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Status</Form.Label>
                  <Form.Select {...register('status')}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Start Date</Form.Label>
                <Form.Control type="date" {...register('startDate')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">End Date</Form.Label>
                <Form.Control type="date" {...register('endDate')} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('description')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Program' : 'Create Program'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TrainingProgramFormModal;