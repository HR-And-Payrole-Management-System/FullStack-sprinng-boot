import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'TEMPORARY'];
const STATUSES = ['DRAFT', 'OPEN', 'ON_HOLD', 'CLOSED'];

const schema = yup.object({
  title: yup.string().required('Title is required').max(150),
  departmentId: yup.number().typeError('Department is required').required('Department is required'),
  positionId: yup.number().typeError('Select a position').nullable(),
  employmentType: yup.string().required('Employment type is required'),
  description: yup.string().max(2000).nullable(),
  requirements: yup.string().max(2000).nullable(),
  openings: yup.number().typeError('Must be a number').min(1, 'At least 1 opening').required('Openings is required'),
  postedDate: yup.string().nullable(),
  closingDate: yup.string().nullable(),
  status: yup.string().nullable(),
});

const emptyValues = {
  title: '', departmentId: '', positionId: '', employmentType: '', description: '',
  requirements: '', openings: 1, postedDate: '', closingDate: '', status: 'DRAFT',
};

function JobPostingFormModal({ show, initialData, departments, positions, onClose, onSubmit, submitting }) {
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
              departmentId: initialData.departmentId || '',
              positionId: initialData.positionId || '',
              employmentType: initialData.employmentType || '',
              description: initialData.description || '',
              requirements: initialData.requirements || '',
              openings: initialData.openings || 1,
              postedDate: initialData.postedDate || '',
              closingDate: initialData.closingDate || '',
              status: initialData.status || 'DRAFT',
            }
          : emptyValues
      );
    }
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Job Posting' : 'New Job Posting'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Job Title *</Form.Label>
                <Form.Control {...register('title')} isInvalid={!!errors.title} placeholder="e.g. Senior Backend Engineer" />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Employment Type *</Form.Label>
                <Form.Select {...register('employmentType')} isInvalid={!!errors.employmentType}>
                  <option value="">-- Select --</option>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.employmentType?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Department *</Form.Label>
                <Form.Select {...register('departmentId')} isInvalid={!!errors.departmentId}>
                  <option value="">-- Select --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.departmentId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Position</Form.Label>
                <Form.Select {...register('positionId')}>
                  <option value="">-- None --</option>
                  {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Openings *</Form.Label>
                <Form.Control type="number" min={1} {...register('openings')} isInvalid={!!errors.openings} />
                <Form.Control.Feedback type="invalid">{errors.openings?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Posted Date</Form.Label>
                <Form.Control type="date" {...register('postedDate')} />
              </Form.Group>
            </Col>
            <Col md={isEdit ? 4 : 8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Closing Date</Form.Label>
                <Form.Control type="date" {...register('closingDate')} />
              </Form.Group>
            </Col>
            {isEdit && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Status</Form.Label>
                  <Form.Select {...register('status')}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
                <Form.Label className="small fw-semibold">Requirements</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('requirements')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Posting' : 'Create Posting'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default JobPostingFormModal;