import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function ReviewLeaveModal({ show, action, request, onClose, onSubmit, submitting }) {
  const [comment, setComment] = useState('');

  useEffect(() => { if (show) setComment(''); }, [show]);

  const isApprove = action === 'approve';

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isApprove ? 'Approve' : 'Reject'} Leave Request
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => { e.preventDefault(); onSubmit(comment); }}>
        <Modal.Body className="pt-2">
          <div className="mb-3" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {request?.employeeName} — {request?.leaveTypeName} ({request?.startDate} → {request?.endDate})
          </div>
          <Form.Group>
            <Form.Label className="small fw-semibold">Comment</Form.Label>
            <Form.Control as="textarea" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional note" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant={isApprove ? 'success' : 'danger'} disabled={submitting}>
            {submitting ? 'Saving...' : isApprove ? 'Approve' : 'Reject'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ReviewLeaveModal;