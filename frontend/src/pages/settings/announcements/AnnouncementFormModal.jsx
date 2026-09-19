import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required('Title is required.').max(200),
  body: yup.string().max(2000).nullable(),
});

function AnnouncementFormModal({ show, companies, onClose, onSubmit, submitting }) {
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [branchOptions, setBranchOptions] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', body: '' },
  });

  useEffect(() => {
    if (show) {
      reset({ title: '', body: '' });
      setCompanyId('');
      setBranchId('');
      setBranchOptions([]);
    }
  }, [show, reset]);

  const submitForm = (data) => {
    onSubmit({
      title: data.title,
      body: data.body,
      companyId: companyId ? Number(companyId) : null,
      branchId: branchId ? Number(branchId) : null,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          📣 New Announcement
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submitForm)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Title *</Form.Label>
                <Form.Control {...register('title')} isInvalid={!!errors.title} placeholder="e.g. Company Holiday Notice" />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Message</Form.Label>
                <Form.Control as="textarea" rows={4} {...register('body')} placeholder="Write the announcement details..." />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Company <span className="text-muted">(optional)</span></Form.Label>
                <Form.Select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                  <option value="">-- Organization-wide --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Announcement'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AnnouncementFormModal;