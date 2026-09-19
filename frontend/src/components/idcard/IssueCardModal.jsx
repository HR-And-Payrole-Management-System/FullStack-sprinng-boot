import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { employeeService } from '../../services/employee.service';
import { useDebounce } from '../../hooks/useDebounce';

const ACCESS_OPTIONS = [
  { value: 'EMPLOYEE_ACCESS', label: 'Employee Access' },
  { value: 'STAFF_ACCESS', label: 'Staff Access' },
  { value: 'AUTHORIZED_ACCESS', label: 'Authorized Access' },
  { value: 'RESTRICTED_ACCESS', label: 'Restricted Access' },
];

function IssueCardModal({ show, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { employeeId: '', employeeName: '', accessLevel: 'EMPLOYEE_ACCESS', note: '' },
  });

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const debouncedKeyword = useDebounce(keyword, 350);
  const employeeId = watch('employeeId');
  const employeeName = watch('employeeName');

  useEffect(() => {
    if (show) {
      reset({ employeeId: '', employeeName: '', accessLevel: 'EMPLOYEE_ACCESS', note: '' });
      setKeyword('');
      setResults([]);
    }
  }, [show, reset]);

  useEffect(() => {
    if (!debouncedKeyword || employeeId) { setResults([]); return; }
    employeeService.list({ page: 0, size: 6, keyword: debouncedKeyword, status: 'ACTIVE' })
      .then((res) => setResults(res.content || []))
      .catch(() => setResults([]));
  }, [debouncedKeyword, employeeId]);

  const pickEmployee = (emp) => {
    setValue('employeeId', emp.id);
    setValue('employeeName', `${emp.firstName} ${emp.lastName} (${emp.employeeCode})`);
    setResults([]);
    setKeyword('');
  };

  const clearEmployee = () => {
    setValue('employeeId', '');
    setValue('employeeName', '');
  };

  const submitForm = (values) => {
    if (!values.employeeId) return;
    onSubmit(values.employeeId, {
      accessLevel: values.accessLevel,
      note: values.note || undefined,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Issue ID Card</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submitForm)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Employee *</Form.Label>
                {employeeId ? (
                  <div className="d-flex align-items-center justify-content-between border rounded px-3 py-2">
                    <span>{employeeName}</span>
                    <Button variant="link" size="sm" className="p-0" onClick={clearEmployee}>Change</Button>
                  </div>
                ) : (
                  <>
                    <Form.Control
                      placeholder="Search by name or employee code..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      isInvalid={!!errors.employeeId}
                    />
                    {results.length > 0 && (
                      <ListGroup className="mt-1" style={{ maxHeight: 180, overflowY: 'auto' }}>
                        {results.map((emp) => (
                          <ListGroup.Item
                            key={emp.id}
                            action
                            onClick={() => pickEmployee(emp)}
                            className="small"
                          >
                            {emp.firstName} {emp.lastName} <span className="text-muted">— {emp.employeeCode}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </>
                )}
                <input type="hidden" {...register('employeeId', { required: true })} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Access Level *</Form.Label>
                <Form.Select {...register('accessLevel', { required: true })}>
                  {ACCESS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Note</Form.Label>
                <Form.Control as="textarea" rows={2} maxLength={500} {...register('note')} placeholder="Optional" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting || !employeeId}>
            {submitting ? 'Issuing...' : 'Issue Card'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default IssueCardModal;