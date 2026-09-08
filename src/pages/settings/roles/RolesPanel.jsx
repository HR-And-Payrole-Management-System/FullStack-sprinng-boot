import { useEffect, useState } from 'react';
import { Table, Button, Form, Dropdown, Pagination } from 'react-bootstrap';

import { roleService } from '../../../services/role.service';
import { useHasPermission } from '../../../hooks/useHaspermission';
import { useToast } from '../../../context/ToastContext';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmModal from '../../../components/ConfirmModal';
import RoleFormModal from './RoleFormModal';
import ManagePermissionsModal from './ManagePermissionsModal';

function RolesPanel() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('ROLE_CREATE');
  const canUpdate = useHasPermission('ROLE_UPDATE');
  const canDelete = useHasPermission('ROLE_DELETE');
  const canAssignPermission = useHasPermission('ROLE_ASSIGN_PERMISSION');

  const [pageData, setPageData] = useState({ content: [], page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [formShow, setFormShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [permTarget, setPermTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = (page = 0, kw = keyword) => {
    setLoading(true);
    roleService
      .list({ page, size: 10, keyword: kw })
      .then(setPageData)
      .catch(() => showToast('មិនអាចទាញយកតួនាទីបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(0, ''); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(0, keyword); };

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (role) => { setEditing(role); setFormShow(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await roleService.update(editing.id, values);
        showToast('កែប្រែតួនាទីជោគជ័យ', 'success');
      } else {
        await roleService.create(values);
        showToast('បង្កើតតួនាទីជោគជ័យ', 'success');
      }
      setFormShow(false);
      load(pageData.page, keyword);
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await roleService.remove(deleteTarget.id);
      showToast('លុបតួនាទីជោគជ័យ', 'success');
      setDeleteTarget(null);
      load(pageData.page, keyword);
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form className="d-flex gap-2" onSubmit={handleSearch} style={{ maxWidth: 320 }}>
          <Form.Control
            placeholder="Search roles..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="light">Search</Button>
        </Form>
        {canCreate && <Button className="ent-btn-primary" onClick={openCreate}>+ New Role</Button>}
      </div>

      <div className="ent-card p-3">
        {pageData.content.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">🛡️</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No roles found</div>
          </div>
        ) : (
          <>
            <Table responsive className="ent-table mb-0">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Description</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th style={{ width: '70px' }}></th>
                </tr>
              </thead>
              <tbody>
                {pageData.content.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.description || <span className="text-muted">—</span>}</td>
                    <td>
                      <span className="ent-pill ent-pill-neutral">
                        {(r.permissions || []).length} assigned
                      </span>
                    </td>
                    <td>
                      <span className={`ent-pill ${r.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {canAssignPermission && (
                            <Dropdown.Item onClick={() => setPermTarget(r)}>Manage Permissions</Dropdown.Item>
                          )}
                          {canUpdate && <Dropdown.Item onClick={() => openEdit(r)}>Edit</Dropdown.Item>}
                          {canDelete && (
                            <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(r)}>Delete</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {pageData.totalPages > 1 && (
              <Pagination className="justify-content-end mt-3 mb-0">
                {Array.from({ length: pageData.totalPages }).map((_, i) => (
                  <Pagination.Item key={i} active={i === pageData.page} onClick={() => load(i, keyword)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </>
        )}
      </div>

      <RoleFormModal
        show={formShow}
        initialData={editing}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ManagePermissionsModal
        show={!!permTarget}
        role={permTarget}
        onClose={() => setPermTarget(null)}
        onSaved={() => { setPermTarget(null); showToast('កំណត់សិទ្ធិជោគជ័យ', 'success'); load(pageData.page, keyword); }}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Role"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTarget?.name}" មែនទេ?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default RolesPanel;