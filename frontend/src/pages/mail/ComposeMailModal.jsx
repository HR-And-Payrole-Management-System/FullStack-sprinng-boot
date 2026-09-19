import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDebounce } from '../../hooks/useDebounce';
import { employeeApi } from '../../api/employee.api';
import { mailService } from '../../services/mail.service';
import { useToast } from '../../context/ToastContext';
import { Paperclip, X } from 'lucide-react';

function ComposeMailModal({ show, onClose, onSent, replyTo }) {
  const { showToast } = useToast();
  const [recipientQuery, setRecipientQuery] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [options, setOptions] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const debouncedQuery = useDebounce(recipientQuery, 300);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (replyTo) {
      setRecipient({ id: replyTo.senderId, name: replyTo.senderName });
      setSubject(replyTo.subject?.startsWith('Re: ') ? replyTo.subject : `Re: ${replyTo.subject}`);
    }
  }, [replyTo]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2 || recipient) {
      setOptions([]);
      return;
    }
    employeeApi
      .getAll({ page: 0, size: 6, keyword: debouncedQuery })
      .then((res) => setOptions(res.data?.content || []))
      .catch(() => setOptions([]));
  }, [debouncedQuery, recipient]);

  const reset = () => {
  setRecipientQuery('');
  setRecipient(null);
  setOptions([]);
  setSubject('');
  setBody('');
  setFiles([]);
};

  const handleClose = () => {
    reset();
    onClose();
  };
  

  const handleFileChange = (e) => {
  const chosen = Array.from(e.target.files || []);
  setFiles((prev) => [...prev, ...chosen]);
  e.target.value = '';
};

const removeFile = (index) => {
  setFiles((prev) => prev.filter((_, i) => i !== index));
};

const handleSend = async () => {
  if (!recipient || !subject.trim() || !body.trim()) {
    showToast('សូមបំពេញព័ត៌មានទាំងអស់', 'warning');
    return;
  }
  setSending(true);
  try {
    const created = await mailService.send({
      recipientId: recipient.id,
      subject: subject.trim(),
      body: body.trim(),
      parentMessageId: replyTo?.id,
    });

    for (const file of files) {
      await mailService.uploadAttachment(created.id, file);
    }

    showToast('សារត្រូវបានផ្ញើដោយជោគជ័យ', 'success');
    reset();
    onSent?.();
    onClose();
  } catch {
    showToast('មិនអាចផ្ញើសារបានទេ', 'danger');
  } finally {
    setSending(false);
  }
};

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{replyTo ? 'Reply' : 'Compose Message'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>To</Form.Label>
          {recipient ? (
            <div className="d-flex align-items-center gap-2">
              <span className="ent-pill ent-pill-neutral">{recipient.name}</span>
              {!replyTo && (
                <Button size="sm" variant="link" onClick={() => setRecipient(null)}>
                  Change
                </Button>
              )}
            </div>
          ) : (
            <>
              <Form.Control
                placeholder="Search employee..."
                value={recipientQuery}
                onChange={(e) => setRecipientQuery(e.target.value)}
              />
              {options.length > 0 && (
                <div className="ent-card p-1 mt-1">
                  {options.map((emp) => (
                    <button
                      key={emp.id}
                      className="ent-notif-item"
                      onClick={() => {
                        setRecipient({ id: emp.id, name: `${emp.firstName} ${emp.lastName}` });
                        setOptions([]);
                      }}
                    >
                      {emp.firstName} {emp.lastName}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        </Form.Group>
        <Form.Group className="mt-3">
        <Form.Label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
          <Paperclip size={16} />
          Attach files
          <Form.Control type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        </Form.Label>
        {files.length > 0 && (
          <div className="d-flex flex-column gap-1 mt-1">
            {files.map((f, i) => (
              <div key={i} className="d-flex align-items-center justify-content-between small">
                <span>{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                <Button size="sm" variant="link" className="p-0 text-danger" onClick={() => removeFile(i)}>
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={sending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ComposeMailModal;