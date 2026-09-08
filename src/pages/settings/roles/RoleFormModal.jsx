import { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះតួនាទី').max(100),
  description: yup.string().max(255).nullable(),
});

function RoleFormModal({ show, initialData, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (show) {
      reset(initialData ? { name: initialData.name, description: initialData.description } : { name: '', description: '' });
    }
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Role' : 'New Role'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Name *</Form.Label>
            <Form.Control {...register('name')} isInvalid={!!errors.name} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="small fw-semibold">Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('description')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RoleFormModal;