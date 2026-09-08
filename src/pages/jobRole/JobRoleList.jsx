import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

import { jobRoleService } from '../../services/jobRole.service';
import { departmentService } from '../../services/department.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import JobRoleFormModal from './JobRoleFormModal';

function JobRoleList() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('JOB_ROLE_CREATE');
  const canUpdate = useHasPermission('JOB_ROLE_UPDATE');
  const canDelete = useHasPermission('JOB_ROLE_DELETE');

  const [jobRoles, setJobRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formShow, setFormShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([jobRoleService.list(), departmentService.list()])
      .then(([r, d]) => { setJobRoles(r); setDepartments(d); })
      .catch(() => showToast('Unable to load job roles.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobRoles;
    return jobRoles.filter(
      (r) => r.name?.toLowerCase().includes(q) || r.departmentName?.toLowerCase().includes(q)
    );
  }, [jobRoles, search]);

  const total = jobRoles.length;
  const active = jobRoles.filter((r) => r.status === 'ACTIVE').length;
  const unassigned = jobRoles.filter((r) => !r.departmentId).length;

  const byLevel = useMemo(() => {
    const map = {};
    jobRoles.forEach((r) => {
      const key = r.level || 'Not Set';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [jobRoles]);

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (r) => { setEditing(r); setFormShow(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await jobRoleService.update(editing.id, values);
        showToast('Job role updated successfully.', 'success');
      } else {
        await jobRoleService.create(values);
        showToast('Job role created successfully.', 'success');
      }
      setFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobRoleService.remove(deleteTarget.id);
      showToast('Job role deleted successfully.', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this job role.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Job Roles</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Reusable job title templates and responsibilities
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={openCreate}>+ New Job Role</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <TrendStatCard label="Total Job Roles" value={total} icon="🧩" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Active" value={active} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Unassigned to Department" value={unassigned} icon="⚠️" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={byLevel} title="Job Roles by Level" centerLabel="Total" />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div className="ent-search mb-3" style={{ maxWidth: '300px' }}>
              <span className="ent-search-icon">🔍</span>
              <Form.Control
                placeholder="Search name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🧩</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No job roles found</div>
                <div className="small">Try a different search, or add your first job role.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ width: '70px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.level ? <span className="ent-pill ent-pill-neutral">{r.level}</span> : '—'}</td>
                      <td>{r.departmentName || <span className="text-muted">—</span>}</td>
                      <td>
                        <span className={`ent-pill ${r.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {(canUpdate || canDelete) ? (
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                              {canUpdate && <Dropdown.Item onClick={() => openEdit(r)}>Edit</Dropdown.Item>}
                              {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(r)}>Delete</Dropdown.Item>}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>

      <JobRoleFormModal
        show={formShow}
        initialData={editing}
        departments={departments}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Job Role"
        body={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default JobRoleList;