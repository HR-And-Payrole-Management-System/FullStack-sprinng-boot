import { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const DEFAULT_BADGE_COLOR = '#64748B';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះតួនាទី').max(100),
  description: yup.string().max(255).nullable(),
  badgeColor: yup // NEW
    .string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'ពណ៌ត្រូវតែជា hex ដូចជា #7C3AED')
    .required('ត្រូវការជ្រើសពណ៌'),
});

function RoleFormModal({ show, initialData, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', badgeColor: DEFAULT_BADGE_COLOR }, // NEW
  });

  const badgeColor = watch('badgeColor'); // NEW — drives the swatch preview

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              name: initialData.name,
              description: initialData.description,
              badgeColor: initialData.badgeColor || DEFAULT_BADGE_COLOR, // NEW
            }
          : { name: '', description: '', badgeColor: DEFAULT_BADGE_COLOR }
      );
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
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('description')} />
          </Form.Group>

          {/* NEW — badge color picker */}
          <Form.Group>
            <Form.Label className="small fw-semibold">Card Color</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="color"
                {...register('badgeColor')}
                style={{ width: 48, height: 38, padding: 4 }}
                title="Pick a color"
              />
              <Form.Control
                {...register('badgeColor')}
                isInvalid={!!errors.badgeColor}
                placeholder="#7C3AED"
                style={{ maxWidth: 140 }}
              />
              <span
                className="rounded-circle border"
                style={{ width: 24, height: 24, backgroundColor: badgeColor }}
              />
            </div>
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.badgeColor?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Used for this role's ID card and lanyard badge.
            </Form.Text>
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