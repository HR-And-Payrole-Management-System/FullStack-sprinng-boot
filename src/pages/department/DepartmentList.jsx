import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Row, Col, Dropdown } from 'react-bootstrap';

import { departmentService } from '../../services/department.service';
import { companyService } from '../../services/company.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';
import FilterBar from '../../components/charts/FilterBar';
import DepartmentFormModal from './DepartmentFormModal';
import { resolveUploadUrl } from '../../utils/url';

function initials(name = '') {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function DepartmentList() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('DEPARTMENT_CREATE');
  const canUpdate = useHasPermission('DEPARTMENT_UPDATE');
  const canDelete = useHasPermission('DEPARTMENT_DELETE');

  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ company: 'All', status: 'All' });

  const [formShow, setFormShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([departmentService.list(), companyService.list()])
      .then(([d, c]) => { setDepartments(d); setCompanies(c); })
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // ---- Filtering ----
  const filtered = useMemo(() => {
    return departments.filter((d) => {
      const companyMatch = filters.company === 'All' || d.companyName === filters.company;
      const statusMatch = filters.status === 'All' || d.status === filters.status;
      return companyMatch && statusMatch;
    });
  }, [departments, filters]);

  // ---- KPI values ----
  const total = departments.length;
  const assigned = departments.filter((d) => d.companyId).length;
  const unassigned = total - assigned;
  const activeCount = departments.filter((d) => d.status === 'ACTIVE').length;

  // ---- Chart data ----
  const byCompany = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      const key = d.companyName || 'Unassigned';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [departments]);

  const byBranch = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      const key = d.branchName || 'Unassigned';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [departments]);

  const companyOptions = ['All', ...companies.map((c) => c.name)];
  const statusOptions = ['All', 'ACTIVE', 'INACTIVE'];

  // ---- Handlers ----
  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (d) => { setEditing(d); setFormShow(true); };

  const handleSubmit = async (values, logoFile) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        companyId: values.companyId ? Number(values.companyId) : null,
        branchId: values.branchId ? Number(values.branchId) : null,
      };

      let saved;
      if (editing) {
        saved = await departmentService.update(editing.id, payload);
        showToast('កែប្រែនាយកដ្ឋានជោគជ័យ', 'success');
      } else {
        saved = await departmentService.create(payload);
        showToast('បង្កើតនាយកដ្ឋានជោគជ័យ', 'success');
      }

      if (logoFile && saved?.id) {
        await departmentService.uploadLogo(saved.id, logoFile);
      }

      setFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await departmentService.remove(deleteTarget.id);
      showToast('លុបនាយកដ្ឋានជោគជ័យ', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      {/* ---- Header + Filter Bar ---- */}
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Departments</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Organizational structure across companies and branches
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <FilterBar
            filters={[
              { key: 'company', type: 'select', label: 'Company', options: companyOptions },
              { key: 'status', type: 'select', label: 'Status', options: statusOptions },
            ]}
            values={filters}
            onChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
          />
          {canCreate && (
            <Button className="ent-btn-primary" onClick={openCreate}>+ New Department</Button>
          )}
        </div>
      </div>

      {/* ---- KPI Row ---- */}
      <Row className="g-3 mb-3">
        <Col md={3}>
          <TrendStatCard label="Total Departments" value={total} icon="🗂️" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Active" value={activeCount} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Assigned to Org" value={assigned} icon="🔗" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Unassigned" value={unassigned} icon="⚠️" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      {/* ---- Charts Row ---- */}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={byCompany} title="Departments by Company" centerLabel="Total" />
        </Col>
        <Col md={8}>
          <HorizontalBarChart data={byBranch} title="Top Branches by Department Count" />
        </Col>
      </Row>

      {/* ---- Table ---- */}
      <div className="ent-card p-3">
        {filtered.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">🗂️</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No departments found</div>
            <div className="small">Adjust filters, or add your first department.</div>
          </div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead>
              <tr>
                <th>Department</th>
                <th>Company</th>
                <th>Branch</th>
                <th>Status</th>
                <th style={{ width: '70px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                      <div className="d-flex align-items-center gap-2">
                        {d.logoUrl ? (
                          <img
                            src={resolveUploadUrl(d.logoUrl)}
                            alt={d.name}
                            style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="ent-avatar-badge">{initials(d.name)}</span>
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{d.name}</div>
                          {d.description && (
                            <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>
                              {d.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  <td>{d.companyName || <span className="text-muted">—</span>}</td>
                  <td>{d.branchName || <span className="text-muted">—</span>}</td>
                  <td>
                    <span className={`ent-pill ${d.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <Dropdown align="end">
                      <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {canUpdate && (
                          <Dropdown.Item onClick={() => openEdit(d)}>Edit</Dropdown.Item>
                        )}
                        {canDelete && (
                          <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(d)}>Delete</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <DepartmentFormModal
        show={formShow}
        initialData={editing}
        companies={companies}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Department"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTarget?.name}" មែនទេ?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default DepartmentList;