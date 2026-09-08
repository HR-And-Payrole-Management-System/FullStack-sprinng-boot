import { useMemo, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';

import { useNotifications } from '../../hooks/useNotifications';
import { employeeDocumentService } from '../../services/employeeDocument.service';
import { resolveUploadUrl } from '../../utils/url';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
    deleteNotification,
  } = useNotifications();
  const { showToast } = useToast();

  const [filter, setFilter] = useState('all');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openingId, setOpeningId] = useState(null);

  const handleOpenReference = async (n) => {
    if (n.referenceType !== 'EMPLOYEE_DOCUMENT' || !n.referenceId) return;
    setOpeningId(n.id);
    try {
      const doc = await employeeDocumentService.fetchById(n.referenceId);
      if (!doc?.fileUrl) {
        showToast('រកមិនឃើញឯកសារនេះទេ', 'danger');
        return;
      }
      window.open(resolveUploadUrl(doc.fileUrl), '_blank', 'noopener,noreferrer');
      if (!n.read) markAsRead(n.id);
    } catch (err) {
      const status = err?.response?.status;
      showToast(
        status === 403
          ? 'អ្នកមិនមានសិទ្ធិមើលឯកសារនេះទេ'
          : 'មិនអាចបើកឯកសារនេះបានទេ',
        'danger'
      );
    } finally {
      setOpeningId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteNotification(pendingDeleteId);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Notifications</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
              : 'You are all caught up'}
          </div>
        </div>
        <Button
          variant="light"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={16} className="me-1" />
          Mark all as read
        </Button>
      </div>

      <ButtonGroup className="mb-3">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? 'primary' : 'light'}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </ButtonGroup>

      <div className="ent-card p-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            subtitle={
              filter === 'all'
                ? "You'll see updates here as they come in."
                : `No ${filter} notifications right now.`
            }
          />
        ) : (
          <div className="d-flex flex-column gap-2">
            {filtered.map((n) => (
              <div
                key={n.id}
                className="d-flex align-items-start justify-content-between p-3"
                style={{
                  borderRadius: 'var(--radius-md, 8px)',
                  background: n.read ? 'transparent' : 'var(--color-primary-soft)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex-grow-1 me-3">
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    {n.title || n.message}
                  </div>
                  {n.title && n.message && (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                      {n.message}
                    </div>
                  )}
                  {n.createdAt && (
                    <div className="small text-muted mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  )}
                  {n.referenceType === 'EMPLOYEE_DOCUMENT' && n.referenceId && (
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 mt-1 d-inline-flex align-items-center gap-1"
                      disabled={openingId === n.id}
                      onClick={() => handleOpenReference(n)}
                    >
                      <ExternalLink size={13} />
                      {openingId === n.id ? 'កំពុងបើក...' : 'មើលឯកសារ'}
                    </Button>
                  )}
                </div>

                <div className="d-flex gap-2 flex-shrink-0">
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      title="Mark as read"
                      onClick={() => markAsRead(n.id)}
                    >
                      <Check size={14} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    title="Delete"
                    onClick={() => setPendingDeleteId(n.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        show={pendingDeleteId !== null}
        title="Delete notification"
        body="Are you sure you want to delete this notification? This can't be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        confirming={deleting}
      />
    </div>
  );
}

export default NotificationsPage;