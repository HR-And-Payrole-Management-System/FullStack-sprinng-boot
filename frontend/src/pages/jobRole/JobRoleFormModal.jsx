import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const LEVELS = ['EXECUTIVE', 'DIRECTOR', 'MANAGER', 'SUPERVISOR', 'SENIOR', 'STAFF', 'JUNIOR', 'INTERN'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

const schema = yup.object({
  name: yup.string().required('Job role name is required').max(100),
  description: yup.string().max(500).nullable(),
  responsibilities: yup.string().max(1000).nullable(),
  level: yup.string().nullable(),
  departmentId: yup.number().typeError('Select a department').nullable(),
  status: yup.string().nullable(),
});

function JobRoleFormModal({ show, initialData, departments, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '', description: '', responsibilities: '', level: '', departmentId: '', status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              name: initialData.name,
              description: initialData.description || '',
              responsibilities: initialData.responsibilities || '',
              level: initialData.level || '',
              departmentId: initialData.departmentId || '',
              status: initialData.status || 'ACTIVE',
            }
          : { name: '', description: '', responsibilities: '', level: '', departmentId: '', status: 'ACTIVE' }
      );
    }
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Job Role' : 'New Job Role'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} placeholder="e.g. Senior Backend Engineer" />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Level</Form.Label>
                <Form.Select {...register('level')}>
                  <option value="">-- Not Set --</option>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Department</Form.Label>
                <Form.Select {...register('departmentId')} isInvalid={!!errors.departmentId}>
                  <option value="">-- Not Assigned --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.departmentId?.message}</Form.Control.Feedback>
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

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('description')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Responsibilities</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('responsibilities')} placeholder="Key responsibilities for this role..." />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Job Role' : 'Create Job Role'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default JobRoleFormModal;