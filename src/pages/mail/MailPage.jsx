import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Mail as MailIcon, Reply, Trash2, Paperclip } from 'lucide-react';

import { mailService } from '../../services/mail.service';
import { useToast } from '../../context/ToastContext';
import { resolveUploadUrl } from '../../utils/url';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import ComposeMailModal from './ComposeMailModal';
import { useAuth } from '../../context/AuthContext';
import BroadcastMailModal from './BroadcastMailModal';

function MailPage() {
  const { showToast } = useToast();
  const { hasPermission } = useAuth();

  const [threads, setThreads] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activeThreadId, setActiveThreadId] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const loadThreads = () => {
    setLoading(true);
    mailService
      .fetchThreads(page, 15)
      .then(setThreads)
      .catch(() => showToast('មិនអាចទាញយកសារបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(loadThreads, [page]);

  const openThread = async (threadId) => {
    setActiveThreadId(threadId);
    setThreadLoading(true);
    try {
      const messages = await mailService.fetchThread(threadId);
      setThreadMessages(messages);
      loadThreads(); // refresh unread counts in the list
    } catch {
      showToast('មិនអាចបើកសារនេះបានទេ', 'danger');
    } finally {
      setThreadLoading(false);
    }
  };

  // live update when a NEW_MESSAGE event arrives over the websocket
  useEffect(() => {
    const handler = (e) => {
      loadThreads();
      if (activeThreadId && e.detail.threadId === activeThreadId) {
        openThread(activeThreadId);
      }
    };
    window.addEventListener('mail:new-message', handler);
    return () => window.removeEventListener('mail:new-message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId]);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await mailService.remove(pendingDeleteId);
      showToast('សារត្រូវបានលុប', 'success');
      if (activeThreadId) openThread(activeThreadId);
      loadThreads();
    } catch {
      showToast('មិនអាចលុបសារបានទេ', 'danger');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const lastMessage = threadMessages[threadMessages.length - 1];

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Mail</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Internal conversations between employees
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Button variant="primary" onClick={() => { setReplyTo(null); setComposeOpen(true); }}>
            <MailIcon size={16} className="me-1" />
            Compose
          </Button>
          {hasPermission('MESSAGE_BROADCAST') && (
            <Button variant="outline-primary" className="ms-2" onClick={() => setBroadcastOpen(true)}>
              Broadcast
            </Button>
          )}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="ent-card p-2">
            {loading ? (
              <LoadingSpinner />
            ) : threads.content.length === 0 ? (
              <EmptyState icon="📭" title="No conversations" />
            ) : (
              <div className="d-flex flex-column gap-1">
                {threads.content.map((t) => (
                  <button
                    key={t.threadId}
                    className={`ent-notif-item ${t.unreadCount > 0 ? 'unread' : ''} ${
                      t.threadId === activeThreadId ? 'active' : ''
                    }`}
                    onClick={() => openThread(t.threadId)}
                    style={{ textAlign: 'left' }}
                  >
                    <div className="ent-notif-item-body">
                      <div className="d-flex justify-content-between">
                        <div className="ent-notif-item-title">{t.otherParticipantName}</div>
                        {t.unreadCount > 0 && (
                          <span className="ent-topbar-badge" style={{ position: 'static' }}>
                            {t.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 500 }}>{t.subject}</div>
                      <div className="ent-notif-item-time">{t.lastMessageSnippet}</div>
                      <div className="ent-notif-item-time">
                        {new Date(t.lastMessageAt).toLocaleString()}
                        {t.hasAttachments && <Paperclip size={12} className="ms-1" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="ent-card p-3" style={{ minHeight: 400 }}>
            {!activeThreadId ? (
              <EmptyState icon="✉️" title="Select a conversation to read" />
            ) : threadLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                    {threadMessages[0]?.subject}
                  </div>
                  {lastMessage && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => { setReplyTo(lastMessage); setComposeOpen(true); }}
                    >
                      <Reply size={14} className="me-1" /> Reply
                    </Button>
                  )}
                </div>

                {threadMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3"
                    style={{
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div style={{ fontWeight: 600 }}>{m.senderName}</div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 text-danger"
                          onClick={() => setPendingDeleteId(m.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.body}</div>

                    {m.attachments?.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {m.attachments.map((a) => (
                          
                          <a  key={a.id}
                            href={resolveUploadUrl(a.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="ent-pill ent-pill-neutral"
                            style={{ textDecoration: 'none' }}
                          >
                            <Paperclip size={12} className="me-1" />
                            {a.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ComposeMailModal
        show={composeOpen}
        replyTo={replyTo}
        onClose={() => setComposeOpen(false)}
        onSent={() => {
          loadThreads();
          if (activeThreadId) openThread(activeThreadId);
        }}
      />

      <BroadcastMailModal
        show={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onSent={loadThreads}
      />

      <ConfirmModal
        show={pendingDeleteId !== null}
        title="Delete message"
        body="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

export default MailPage;