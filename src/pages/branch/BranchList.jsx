import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { branchService } from '../../services/branch.service';
import { companyService } from '../../services/company.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import KpiCard from '../../components/KpiCard';
import BranchFormModal from './BranchFormModal';
import { Dropdown } from 'react-bootstrap';
import { resolveUploadUrl } from '../../utils/url';


const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)'];

function initials(name = '') {
  return name.trim().slice(0, 2).toUpperCase();
}

function BranchList() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('BRANCH_CREATE');
  const canUpdate = useHasPermission('BRANCH_UPDATE');
  const canDelete = useHasPermission('BRANCH_DELETE');

  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formShow, setFormShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([branchService.list(), companyService.list()])
      .then(([b, c]) => { setBranches(b); setCompanies(c); })
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.code?.toLowerCase().includes(q) ||
        b.companyName?.toLowerCase().includes(q)
    );
  }, [branches, search]);

  const totalBranches = branches.length;
  const headOfficeCount = branches.filter((b) => b.headOffice).length;
  const activeCount = branches.filter((b) => b.status === 'ACTIVE').length;
  const companiesCovered = new Set(branches.map((b) => b.companyId)).size;

  const byCompany = useMemo(() => {
    const map = {};
    branches.forEach((b) => {
      const key = b.companyName || 'Unassigned';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [branches]);

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (b) => { setEditing(b); setFormShow(true); };

  const handleSubmit = async (values, logoFile) => {
    setSubmitting(true);
    try {
      const payload = { ...values, companyId: Number(values.companyId) };
      let saved;
      if (editing) {
        saved = await branchService.update(editing.id, payload);
        showToast('កែប្រែសាខាជោគជ័យ', 'success');
      } else {
        saved = await branchService.create(payload);
        showToast('បង្កើតសាខាជោគជ័យ', 'success');
      }

      if (logoFile && saved?.id) {
        saved = await branchService.uploadLogo(saved.id, logoFile);
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
      await branchService.remove(deleteTarget.id);
      showToast('លុបសាខាជោគជ័យ', 'success');
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
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Branches</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Branch network overview
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={openCreate}>+ New Branch</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <KpiCard label="Total Branches" value={totalBranches} icon="🏬" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <KpiCard label="Head Offices" value={headOfficeCount} icon="⭐" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <KpiCard label="Active" value={activeCount} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <KpiCard label="Companies Covered" value={companiesCovered} icon="🏢" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="ent-card p-3 h-100">
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">Branches by Company</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byCompany} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {byCompany.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {byCompany.map((entry, i) => (
                <span key={entry.name} className="d-flex align-items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length], display: 'inline-block' }} />
                  {entry.name} ({entry.value})
                </span>
              ))}
            </div>
          </div>
        </Col>

        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div className="ent-search mb-3" style={{ maxWidth: '320px' }}>
              <span className="ent-search-icon">🔍</span>
              <Form.Control
                placeholder="Search code, name, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🏬</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No branches found</div>
                <div className="small">Try a different search, or add your first branch.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th style={{  whiteSpace: 'nowrap' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td>
                      <div className="d-flex align-items-center gap-2">
                        {b.logoUrl ? (
                          <img
                            src={resolveUploadUrl(b.logoUrl)}
                            alt={b.name}
                            style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="ent-avatar-badge">{initials(b.code || b.name)}</span>
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{b.name}</div>
                          <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{b.code}</div>
                        </div>
                      </div>
                    </td>
                      <td>{b.companyName}</td>
                      <td>
                        {b.headOffice
                          ? <span className="ent-pill ent-pill-warning">Head Office</span>
                          : <span className="ent-pill ent-pill-neutral">Branch</span>}
                      </td>
                      <td>
                        <span className={`ent-pill ${b.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0">
                          ⋮
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {canUpdate && (
                            <Dropdown.Item onClick={() => openEdit(b)}>Edit</Dropdown.Item>
                          )}

                          {canDelete && (
                            <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(b)}>
                              Delete
                            </Dropdown.Item>
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
        </Col>
      </Row>

      <BranchFormModal
        show={formShow}
        initialData={editing}
        companies={companies}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Branch"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTarget?.name}" មែនទេ?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default BranchList;