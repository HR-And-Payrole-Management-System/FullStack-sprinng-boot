import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/auth.service';
import { resolveUploadUrl } from '../../utils/url';
import { useNotifications } from '../../hooks/useNotifications';
import { employeeService } from '../../services/employee.service';

function initials(user) {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
}

function memberInitials(m) {
  return `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase();
}

const NAV_ITEMS = [
  { key: 'profile', label: 'My Profile', enabled: true },
  { key: 'security', label: 'Security', enabled: true },
  { key: 'appearance', label: 'Appearance', enabled: true },
  { key: 'notifications', label: 'Notifications', enabled: true },
  { key: 'teams', label: 'Teams', enabled: true },
  { key: 'data-export', label: 'Data Export', enabled: true },
];

function AccountSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const canUpdate = useHasPermission('EMPLOYEE_UPDATE');
  const { theme, setTheme } = useTheme();

  const [active, setActive] = useState('profile');

  // -------------------- Security --------------------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);

  // -------------------- Notifications --------------------
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification } = useNotifications();

  // -------------------- Teams --------------------
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  useEffect(() => {
    if (active !== 'teams') return;
    setTeamLoading(true);
    employeeService.getMyTeam()
      .then(setTeam)
      .catch(() => showToast('Failed to load team', 'danger'))
      .finally(() => setTeamLoading(false));
  }, [active]);

  // -------------------- Handlers --------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match', 'danger');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'danger');
      return;
    }

    setChanging(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'danger');
    } finally {
      setChanging(false);
    }
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      account: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        roles: user?.roles,
      },
      notifications: notifications.map((n) => ({
        title: n.title || n.message,
        read: n.read,
        createdAt: n.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-account-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------- UI --------------------
  return (
    <div className="ent-settings-page">
      <div className="ent-page-title mb-3">Account Settings</div>

      <div className="ent-settings-layout">
        {/* LEFT NAV */}
        <div className="ent-settings-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ent-settings-nav-item ${active === item.key ? 'active' : ''}`}
              disabled={!item.enabled}
              onClick={() => item.enabled && setActive(item.key)}
              title={!item.enabled ? 'Coming soon' : undefined}
            >
              {item.label}
              {!item.enabled && <span className="ent-settings-soon">Soon</span>}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="ent-settings-content">

          {/* ---------------- PROFILE ---------------- */}
          {active === 'profile' && (
            <>
              <div className="ent-settings-card mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-3">
                    <div className="ent-settings-avatar">
                      {user?.photoUrl ? (
                        <img
                          src={resolveUploadUrl(user.photoUrl)}
                          alt="avatar"
                          className="ent-settings-avatar-img"
                        />
                      ) : (
                        initials(user)
                      )}
                    </div>
                    <div>
                      <div className="ent-settings-name">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="ent-settings-subtitle">
                        {user?.roles?.[0] || 'Employee'}
                      </div>
                    </div>
                  </div>

                  {canUpdate && user?.employeeId && (
                    <button
                      className="ent-settings-edit-btn"
                      onClick={() => navigate(`/employee/${user.employeeId}/edit`)}
                    >
                      Edit ✎
                    </button>
                  )}
                </div>
              </div>

              <div className="ent-settings-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 ent-settings-section-title">Personal Information</h6>
                  {canUpdate && user?.employeeId && (
                    <button
                      className="ent-settings-edit-btn"
                      onClick={() => navigate(`/employee/${user.employeeId}/edit`)}
                    >
                      Edit ✎
                    </button>
                  )}
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="ent-settings-label">First Name</div>
                    <div className="ent-settings-value">{user?.firstName || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="ent-settings-label">Last Name</div>
                    <div className="ent-settings-value">{user?.lastName || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="ent-settings-label">Email address</div>
                    <div className="ent-settings-value">{user?.email || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="ent-settings-label">Phone</div>
                    <div className="ent-settings-value">{user?.phone || '—'}</div>
                  </div>
                </div>
              </div>

              {!user?.employeeId && (
                <div className="ent-empty">
                  This account isn't linked to an employee record, so there's no
                  employment profile to edit here.
                </div>
              )}
            </>
          )}

          {/* ---------------- SECURITY ---------------- */}
          {active === 'security' && (
            <div className="ent-settings-card">
              <h6 className="mb-3 ent-settings-section-title">Change Password</h6>
              <Form onSubmit={handleChangePassword} style={{ maxWidth: 420 }}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <button type="submit" className="ent-settings-primary-btn" disabled={changing}>
                  {changing ? 'Saving...' : 'Update Password'}
                </button>
              </Form>
            </div>
          )}

          {/* ---------------- NOTIFICATIONS ---------------- */}
          {active === 'notifications' && (
            <div className="ent-settings-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 ent-settings-section-title d-flex align-items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ent-settings-badge">{unreadCount} new</span>
                  )}
                </h6>
                {notifications.length > 0 && (
                  <button className="ent-settings-edit-btn" onClick={markAllRead}>
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="ent-empty">No notifications</div>
              ) : (
                <div className="ent-settings-notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`ent-settings-notif-row ${n.read ? '' : 'unread'}`}>
                      <div
                        onClick={() => !n.read && markAsRead(n.id)}
                        style={{ cursor: n.read ? 'default' : 'pointer', flex: 1 }}
                      >
                        <div className="ent-settings-value">{n.title || n.message}</div>
                        {n.createdAt && (
                          <div className="ent-settings-label">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <button
                        className="ent-settings-notif-delete"
                        onClick={() => deleteNotification(n.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ---------------- APPEARANCE ---------------- */}
        {active === 'appearance' && (
          <div className="ent-settings-card">
            <h6 className="mb-3 ent-settings-section-title">Appearance</h6>
            <p className="ent-settings-label mb-3" style={{ fontSize: '0.85rem' }}>
              Choose how the admin panel looks. This applies only to your account.
            </p>

            <div className="d-flex gap-3">
              {[
                { value: 'light', label: 'Light', desc: 'Bright background, dark text' },
                { value: 'dark', label: 'Dark', desc: 'Dark background, light text' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  style={{
                    flex: 1,
                    maxWidth: 220,
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border:
                      theme === opt.value
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--color-border)',
                    background:
                      theme === opt.value ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 48,
                      borderRadius: 6,
                      marginBottom: 10,
                      background: opt.value === 'dark' ? '#0B0F19' : '#F8FAFC',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

          {/* ---------------- TEAMS ---------------- */}
          {active === 'teams' && (
            <div className="ent-settings-card">
              <h6 className="mb-3 ent-settings-section-title">My Team</h6>

              {teamLoading ? (
                <div className="ent-settings-label">Loading...</div>
              ) : team.length === 0 ? (
                <div className="ent-empty">No teammates found in your department.</div>
              ) : (
                <div className="ent-settings-team-grid">
                  {team.map((m) => (
                    <div key={m.id} className="ent-settings-team-card">
                      <div className="ent-settings-avatar ent-settings-avatar-sm">
                        {m.photoUrl ? (
                          <img
                            src={resolveUploadUrl(m.photoUrl)}
                            alt=""
                            className="ent-settings-avatar-img"
                          />
                        ) : (
                          memberInitials(m)
                        )}
                      </div>
                      <div>
                        <div className="ent-settings-value">{m.firstName} {m.lastName}</div>
                        <div className="ent-settings-label">{m.positionName || 'No position'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- DATA EXPORT ---------------- */}
          {active === 'data-export' && (
            <div className="ent-settings-card">
              <h6 className="mb-2 ent-settings-section-title">Export My Data</h6>
              <p className="ent-settings-label mb-3" style={{ fontSize: '0.85rem' }}>
                Download a copy of your account information and notification history as a JSON file.
              </p>
              <button className="ent-settings-primary-btn" onClick={handleExportData}>
                Download My Data
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AccountSettings;