import { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { expenseApi } from '../../api/expense.api';
import { employeeApi } from '../../api/employee.api';

const CATEGORIES = ['TRAVEL', 'MEALS', 'ACCOMMODATION', 'OFFICE_SUPPLIES', 'TRANSPORT', 'OTHER'];

export default function SubmitExpenseModal({ show, onHide, onSubmitted }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [category, setCategory] = useState('TRAVEL');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
  }, [show]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await expenseApi.submit({
        employeeId: Number(employeeId), category, amount: Number(amount), expenseDate, description,
      });
      onSubmitted();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit expense.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Submit Expense</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Row className="g-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Employee</Form.Label>
              <Form.Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                <option value="">-- Select Employee --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Expense Date</Form.Label>
              <Form.Control type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !employeeId || !amount || !expenseDate}>
          {saving ? 'Submitting…' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}