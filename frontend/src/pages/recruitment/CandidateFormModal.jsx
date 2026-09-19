import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const SOURCES = ['WEBSITE', 'REFERRAL', 'AGENCY', 'LINKEDIN', 'JOB_BOARD', 'OTHER'];

const schema = yup.object({
  firstName: yup.string().required('First name is required').max(100),
  lastName: yup.string().required('Last name is required').max(100),
  email: yup.string().email('Must be a valid email').required('Email is required').max(255),
  phone: yup.string().max(20).nullable(),
  resumeUrl: yup.string().max(1000).nullable(),
  resumeFileName: yup.string().max(255).nullable(),
  source: yup.string().nullable(),
  notes: yup.string().max(1000).nullable(),
});

const emptyValues = {
  firstName: '', lastName: '', email: '', phone: '', resumeUrl: '', resumeFileName: '', source: '', notes: '',
};

function CandidateFormModal({ show, initialData, onClose, onSubmit, submitting }) {
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
              firstName: initialData.firstName,
              lastName: initialData.lastName,
              email: initialData.email,
              phone: initialData.phone || '',
              resumeUrl: initialData.resumeUrl || '',
              resumeFileName: initialData.resumeFileName || '',
              source: initialData.source || '',
              notes: initialData.notes || '',
            }
          : emptyValues
      );
    }
  }, [show, initialData, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Candidate' : 'New Candidate'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">First Name *</Form.Label>
                <Form.Control {...register('firstName')} isInvalid={!!errors.firstName} />
                <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Last Name *</Form.Label>
                <Form.Control {...register('lastName')} isInvalid={!!errors.lastName} />
                <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Email *</Form.Label>
                <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Phone</Form.Label>
                <Form.Control {...register('phone')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Source</Form.Label>
                <Form.Select {...register('source')}>
                  <option value="">-- Not Set --</option>
                  {SOURCES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Resume Link</Form.Label>
                <Form.Control {...register('resumeUrl')} placeholder="https://..." />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Resume File Name</Form.Label>
                <Form.Control {...register('resumeFileName')} placeholder="resume.pdf" />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Notes</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('notes')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CandidateFormModal;