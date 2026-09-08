import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({ show, title = 'Confirm', body, onConfirm, onCancel, confirming = false }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={confirming}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={confirming}>
          {confirming ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;