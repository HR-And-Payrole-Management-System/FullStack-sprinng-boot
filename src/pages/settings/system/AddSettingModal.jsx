import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const CATEGORIES = ['GENERAL', 'NOTIFICATION', 'PAYROLL', 'SECURITY'];
const DATA_TYPES = ['STRING', 'NUMBER', 'BOOLEAN'];

const schema = yup.object({
  settingKey: yup.string().required('Key is required').max(100).matches(/^[A-Z0-9_]+$/, 'Use CAPS_WITH_UNDERSCORES'),
  settingValue: yup.string().max(1000).nullable(),
  category: yup.string().required('Category is required'),
  dataType: yup.string().required('Data type is required'),
  description: yup.string().max(255).nullable(),
});

const emptyValues = { settingKey: '', settingValue: '', category: 'GENERAL', dataType: 'STRING', description: '' };

function AddSettingModal({ show, onClose, onSubmit, submitting }) {
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
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Setting</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Key *</Form.Label>
                <Form.Control {...register('settingKey')} isInvalid={!!errors.settingKey} placeholder="e.g. PAYROLL_CYCLE_DAY" style={{ textTransform: 'uppercase' }} />
                <Form.Control.Feedback type="invalid">{errors.settingKey?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Category *</Form.Label>
                <Form.Select {...register('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Type *</Form.Label>
                <Form.Select {...register('dataType')}>
                  {DATA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Value</Form.Label>
                <Form.Control {...register('settingValue')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control {...register('description')} placeholder="What does this setting control?" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Setting'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddSettingModal;