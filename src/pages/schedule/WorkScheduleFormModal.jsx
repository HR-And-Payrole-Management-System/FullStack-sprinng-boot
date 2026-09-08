import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះកាលវិភាគ').max(100),
  startTime: yup.string().required('ត្រូវការម៉ោងចូល'),
  endTime: yup.string().required('ត្រូវការម៉ោងចេញ'),
  breakMinutes: yup.number().typeError('ត្រូវជាលេខ').min(0).required(),
  workingDays: yup.array().min(1, 'ត្រូវជ្រើសរើសយ៉ាងហោចណាស់មួយថ្ងៃ'),
});

function WorkScheduleFormModal({ show, initialData, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', startTime: '08:00', endTime: '17:00', breakMinutes: 60, workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] },
  });

  const workingDays = watch('workingDays') || [];

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { ...initialData, workingDays: Array.from(initialData.workingDays || []) }
          : { name: '', startTime: '08:00', endTime: '17:00', breakMinutes: 60, workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] }
      );
    }
  }, [show, initialData, reset]);

  const toggleDay = (day) => {
    const next = workingDays.includes(day) ? workingDays.filter((d) => d !== day) : [...workingDays, day];
    setValue('workingDays', next);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Work Schedule' : 'New Work Schedule'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} placeholder="e.g. Standard 8-5" />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Start Time *</Form.Label>
                <Form.Control type="time" {...register('startTime')} isInvalid={!!errors.startTime} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">End Time *</Form.Label>
                <Form.Control type="time" {...register('endTime')} isInvalid={!!errors.endTime} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Break (minutes) *</Form.Label>
                <Form.Control type="number" min={0} {...register('breakMinutes')} isInvalid={!!errors.breakMinutes} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Label className="small fw-semibold d-block">Working Days *</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className="ent-pill"
                    style={{
                      cursor: 'pointer', border: '1px solid var(--color-border)',
                      background: workingDays.includes(day) ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: workingDays.includes(day) ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {errors.workingDays && <div className="text-danger small mt-1">{errors.workingDays.message}</div>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default WorkScheduleFormModal;