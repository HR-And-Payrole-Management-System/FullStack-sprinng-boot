import { useEffect, useState } from 'react';
import { Table, Form, Button, Dropdown } from 'react-bootstrap';

import { userService } from '../../../services/user.service';
import { roleService } from '../../../services/role.service';
import { useHasPermission } from '../../../hooks/useHaspermission';
import { useToast } from '../../../context/ToastContext';

import LoadingSpinner from '../../../components/LoadingSpinner';
import AssignRolesModal from './AssignRolesModal';

function initials(user) {
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
}

function UsersPanel() {
  const { showToast } = useToast();
  const canAssignRole = useHasPermission('USER_ASSIGN_ROLE');

  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [assignTarget, setAssignTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = (kw = keyword) => {
    setLoading(true);
    userService
      .list(kw)
      .then(setUsers)
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យអ្នកប្រើប្រាស់បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load('');
    roleService.listAll().then(setAllRoles).catch(() => setAllRoles([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(keyword);
  };

  const openAssign = (user) => setAssignTarget(user);

  const handleAssignSubmit = async (nextRoleIds) => {
    setSubmitting(true);
    try {
      const currentRoleIds = (assignTarget.roles || []).map((r) => r.id);
      await userService.syncRoles(assignTarget.id, currentRoleIds, nextRoleIds);
      showToast('កំណត់តួនាទីជោគជ័យ', 'success');
      setAssignTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <Form className="d-flex gap-2 mb-3" onSubmit={handleSearch} style={{ maxWidth: 360 }}>
        <Form.Control
          placeholder="Search by name or email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit" variant="light">Search</Button>
      </Form>

      <div className="ent-card p-3">
        {users.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">👤</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No users found</div>
          </div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Status</th>
                <th style={{ width: '70px' }}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="ent-avatar-badge">{initials(u)}</span>
                      <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {(u.roles || []).length === 0 && <span className="text-muted small">—</span>}
                      {(u.roles || []).map((r) => (
                        <span key={r.id} className="ent-pill ent-pill-neutral">{r.name}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {u.accountLocked ? (
                      <span className="ent-pill ent-pill-danger">Locked</span>
                    ) : u.enabled ? (
                      <span className="ent-pill ent-pill-success">Active</span>
                    ) : (
                      <span className="ent-pill ent-pill-warning">Disabled</span>
                    )}
                  </td>
                  <td className="text-end">
                    {canAssignRole && (
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => openAssign(u)}>Assign Roles</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <AssignRolesModal
        show={!!assignTarget}
        user={assignTarget}
        allRoles={allRoles}
        submitting={submitting}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
}

export default UsersPanel;