import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  candidateId: yup.number().typeError('Candidate is required').required('Candidate is required'),
  jobPostingId: yup.number().typeError('Job posting is required').required('Job posting is required'),
  appliedDate: yup.string().nullable(),
  notes: yup.string().max(1000).nullable(),
});

const emptyValues = { candidateId: '', jobPostingId: '', appliedDate: '', notes: '' };

function ApplicationFormModal({ show, candidates, postings, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (show) reset(emptyValues);
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Application</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Candidate *</Form.Label>
                <Form.Select {...register('candidateId')} isInvalid={!!errors.candidateId}>
                  <option value="">-- Select --</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.candidateId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Job Posting *</Form.Label>
                <Form.Select {...register('jobPostingId')} isInvalid={!!errors.jobPostingId}>
                  <option value="">-- Select --</option>
                  {postings.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.departmentName})</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.jobPostingId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Applied Date</Form.Label>
                <Form.Control type="date" {...register('appliedDate')} />
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
            {submitting ? 'Saving...' : 'Create Application'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ApplicationFormModal;