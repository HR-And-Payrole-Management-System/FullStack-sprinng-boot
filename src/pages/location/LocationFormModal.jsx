import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const STATUSES = ['ACTIVE', 'INACTIVE'];

const schema = yup.object({
  name: yup.string().required('Location name is required').max(150),
  branchId: yup.number().typeError('Branch is required').required('Branch is required'),
  addressLine1: yup.string().required('Address line 1 is required').max(255),
  addressLine2: yup.string().max(255).nullable(),
  city: yup.string().required('City is required').max(100),
  state: yup.string().max(100).nullable(),
  country: yup.string().required('Country is required').max(100),
  postalCode: yup.string().max(20).nullable(),
  latitude: yup.number().typeError('Must be a number').nullable().transform((v, o) => (o === '' ? null : v)),
  longitude: yup.number().typeError('Must be a number').nullable().transform((v, o) => (o === '' ? null : v)),
  primary: yup.boolean(),
  status: yup.string().nullable(),
});

const emptyValues = {
  name: '', branchId: '', addressLine1: '', addressLine2: '', city: '', state: '',
  country: '', postalCode: '', latitude: '', longitude: '', primary: false, status: 'ACTIVE',
};

function LocationFormModal({ show, initialData, branches, onClose, onSubmit, submitting }) {
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
              name: initialData.name,
              branchId: initialData.branchId || '',
              addressLine1: initialData.addressLine1 || '',
              addressLine2: initialData.addressLine2 || '',
              city: initialData.city || '',
              state: initialData.state || '',
              country: initialData.country || '',
              postalCode: initialData.postalCode || '',
              latitude: initialData.latitude ?? '',
              longitude: initialData.longitude ?? '',
              primary: !!initialData.primary,
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
          {isEdit ? 'Edit Location' : 'New Location'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Location Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} placeholder="e.g. Main Warehouse" />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Branch *</Form.Label>
                <Form.Select {...register('branchId')} isInvalid={!!errors.branchId}>
                  <option value="">-- Select --</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.branchId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Address Line 1 *</Form.Label>
                <Form.Control {...register('addressLine1')} isInvalid={!!errors.addressLine1} />
                <Form.Control.Feedback type="invalid">{errors.addressLine1?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Address Line 2</Form.Label>
                <Form.Control {...register('addressLine2')} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">City *</Form.Label>
                <Form.Control {...register('city')} isInvalid={!!errors.city} />
                <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">State / Province</Form.Label>
                <Form.Control {...register('state')} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Postal Code</Form.Label>
                <Form.Control {...register('postalCode')} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Country *</Form.Label>
                <Form.Control {...register('country')} isInvalid={!!errors.country} />
                <Form.Control.Feedback type="invalid">{errors.country?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Latitude</Form.Label>
                <Form.Control {...register('latitude')} isInvalid={!!errors.latitude} placeholder="Optional" />
                <Form.Control.Feedback type="invalid">{errors.latitude?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Longitude</Form.Label>
                <Form.Control {...register('longitude')} isInvalid={!!errors.longitude} placeholder="Optional" />
                <Form.Control.Feedback type="invalid">{errors.longitude?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={isEdit ? 6 : 12}>
              <Form.Check
                type="checkbox"
                id="location-primary"
                label="Set as primary location for this branch"
                {...register('primary')}
                className="mt-4"
              />
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
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Location' : 'Create Location'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LocationFormModal;