import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({
  show,
  title = 'Confirm',
  body,
  onConfirm,
  onCancel,
  confirming = false,
  confirmText = 'Delete',
  confirmingText = 'Deleting...',
  confirmVariant = 'danger',
}) {
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
        <Button variant={confirmVariant} onClick={onConfirm} disabled={confirming}>
          {confirming ? confirmingText : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;