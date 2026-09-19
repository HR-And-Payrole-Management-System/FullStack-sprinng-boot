import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { announcementService } from '../../../services/announcement.service';
import { companyService } from '../../../services/company.service';
import { useToast } from '../../../context/ToastContext';
import { useHasPermission } from '../../../hooks/useHaspermission';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmModal from '../../../components/ConfirmModal';
import AnnouncementFormModal from './AnnouncementFormModal';

const ACCENTS = ['var(--color-primary)', 'var(--kpi-teal)', 'var(--kpi-orange)', 'var(--kpi-pink)', 'var(--kpi-purple)'];

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function initialsFromName(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function AnnouncementsPage() {
  const { showToast } = useToast();
  const canManage = useHasPermission('SETTINGS_UPDATE');

  const [announcements, setAnnouncements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formShow, setFormShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      announcementService.list(),
      companyService.list().catch(() => []),
    ])
      .then(([list, comps]) => {
        setAnnouncements(list);
        setCompanies(comps);
      })
      .catch(() => showToast('Unable to load announcements.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await announcementService.create(payload);
      showToast('Announcement posted successfully.', 'success');
      setFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to post this announcement.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await announcementService.deactivate(deleteTarget.id);
      showToast('Announcement removed successfully.', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to remove this announcement.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">📣 Announcements</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Post company-wide or department notices — the 4 most recent active ones show on the Admin Dashboard.
          </div>
        </div>
        {canManage && (
          <Button className="ent-btn-primary" onClick={() => setFormShow(true)}>
            + New Announcement
          </Button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="ent-card p-4">
          <div className="ent-empty" style={{ padding: '2.5rem 1rem' }}>
            <div className="ent-empty-icon">📣</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No announcements yet</div>
            <div className="small">
              {canManage
                ? 'Post your first announcement — it will appear here and on the Admin Dashboard.'
                : 'Check back later for organization updates.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {announcements.map((a, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={a.id}
                className="ent-card p-4"
                style={{
                  borderLeft: `4px solid ${accent}`,
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div className="d-flex align-items-start gap-3" style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: `${accent}1A`,
                        color: accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      📣
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>
                        {a.title}
                      </div>
                      {a.body && (
                        <div
                          style={{
                            color: 'var(--color-text)',
                            fontSize: 'var(--text-sm)',
                            marginTop: 6,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {a.body}
                        </div>
                      )}
                      <div
                        className="d-flex align-items-center gap-2 mt-3"
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)' }}
                      >
                        <span
                          className="ent-avatar-badge"
                          style={{ width: 22, height: 22, fontSize: '0.65rem' }}
                        >
                          {initialsFromName(a.postedByName)}
                        </span>
                        <span>{a.postedByName || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(a.postedDate)}</span>
                        {!a.active && (
                          <>
                            <span>•</span>
                            <span className="ent-pill ent-pill-neutral">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {canManage && a.active && (
                    <Button
                      size="sm"
                      variant="light"
                      className="border-0 text-muted"
                      onClick={() => setDeleteTarget(a)}
                      title="Remove announcement"
                    >
                      🗑️
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnnouncementFormModal
        show={formShow}
        companies={companies}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleCreate}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Remove Announcement"
        body={`Are you sure you want to remove "${deleteTarget?.title}"? It will no longer appear on the dashboard.`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default AnnouncementsPage;