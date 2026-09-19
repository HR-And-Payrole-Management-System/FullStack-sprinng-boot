import { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { expenseApi } from '../../api/expense.api';
import SubmitExpenseModal from './SubmitExpenseModal';

export default function ExpenseApprovalsPage() {
  const [claims, setClaims] = useState([]);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const load = () => expenseApi.getPending().then((res) => setClaims(res.data));
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    await expenseApi.approve(id);
    load();
  };

  const handleReject = async () => {
    await expenseApi.reject(rejecting.id, reason);
    setRejecting(null);
    setReason('');
    load();
  };

  return (
    <div className="p-6">
      <div className="ent-page-title mb-4">Expense Approvals</div>
      <Button size="sm" variant="outline-primary" className="mb-3" onClick={() => setShowSubmit(true)}>
        + Submit Expense (test)
      </Button>


      <Table hover className="ent-table">
        <thead>
          <tr><th>Employee</th><th>Category</th><th>Amount</th><th>Date</th><th>Policy</th><th style={{ width: 200 }}></th></tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.id} className={c.overMonthlyLimit ? 'table-warning' : ''}>
              <td>{c.employeeName}</td>
              <td>{c.category.replace('_', ' ')}</td>
              <td>${c.amount}</td>
              <td>{c.expenseDate}</td>
              <td>
                {c.overMonthlyLimit ? (
                  <Badge bg="warning" text="dark">Over limit (${c.monthToDateTotalForCategory}/${c.monthlyLimitForCategory})</Badge>
                ) : (
                  <Badge bg="light" text="dark">Within limit</Badge>
                )}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="success" onClick={() => handleApprove(c.id)}>Approve</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setRejecting(c)}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
          {claims.length === 0 && <tr><td colSpan={6} className="text-muted small">No pending expense claims.</td></tr>}
        </tbody>
      </Table>

      <Modal show={!!rejecting} onHide={() => setRejecting(null)}>
        <Modal.Header closeButton><Modal.Title>Reject Expense</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason</Form.Label>
            <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejecting(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} disabled={!reason}>Reject</Button>
          \
        </Modal.Footer>
      </Modal>
      <SubmitExpenseModal show={showSubmit} onHide={() => setShowSubmit(false)} onSubmitted={load} />
    </div>
  );
}