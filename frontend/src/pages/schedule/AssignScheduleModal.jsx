import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  workScheduleId: yup
    .number()
    .typeError('ត្រូវជ្រើសរើសកាលវិភាគ')
    .required('ត្រូវជ្រើសរើសកាលវិភាគ'),
  effectiveDate: yup.string().required('ត្រូវការកាលបរិច្ឆេទចាប់ផ្តើម'),
  endDate: yup.string().nullable().notRequired(),
});

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function AssignScheduleModal({ show, schedules, onClose, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { workScheduleId: '', effectiveDate: todayIso(), endDate: '' },
  });

  useEffect(() => {
    if (show) {
      reset({ workScheduleId: '', effectiveDate: todayIso(), endDate: '' });
    }
  }, [show, reset]);

  const submit = (values) => {
    onSubmit({
      workScheduleId: Number(values.workScheduleId),
      effectiveDate: values.effectiveDate,
      endDate: values.endDate || null,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          Assign Work Schedule
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Work Schedule *</Form.Label>
                <Form.Select {...register('workScheduleId')} isInvalid={!!errors.workScheduleId}>
                  <option value="">— Select schedule —</option>
                  {(schedules || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({(s.startTime || '').slice(0, 5)}–{(s.endTime || '').slice(0, 5)})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.workScheduleId?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Effective Date *</Form.Label>
                <Form.Control
                  type="date"
                  {...register('effectiveDate')}
                  isInvalid={!!errors.effectiveDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.effectiveDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">End Date (optional)</Form.Label>
                <Form.Control type="date" {...register('endDate')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Assigning...' : 'Assign Schedule'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AssignScheduleModal;