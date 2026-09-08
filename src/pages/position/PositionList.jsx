import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

import { positionService } from '../../services/position.service';
import { companyService } from '../../services/company.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import PositionFormModal from './PositionFormModal';

function PositionList() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('POSITION_CREATE');
  const canUpdate = useHasPermission('POSITION_UPDATE');
  const canDelete = useHasPermission('POSITION_DELETE');

  const [positions, setPositions] = useState([]);
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
    Promise.all([positionService.list(), companyService.list()])
      .then(([p, c]) => { setPositions(p); setCompanies(c); })
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return positions;
    return positions.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.departmentName?.toLowerCase().includes(q)
    );
  }, [positions, search]);

  const total = positions.length;
  const assigned = positions.filter((p) => p.departmentId).length;
  const unassigned = total - assigned;

  const byLevel = useMemo(() => {
    const map = {};
    positions.forEach((p) => {
      const key = p.level || 'Not Set';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [positions]);

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (p) => { setEditing(p); setFormShow(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        companyId: values.companyId ? Number(values.companyId) : null,
        branchId: values.branchId ? Number(values.branchId) : null,
        departmentId: values.departmentId ? Number(values.departmentId) : null,
        level: values.level || null,
      };

      if (editing) {
        await positionService.update(editing.id, payload);
        showToast('កែប្រែតួនាទីជោគជ័យ', 'success');
      } else {
        await positionService.create(payload);
        showToast('បង្កើតតួនាទីជោគជ័យ', 'success');
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
      await positionService.remove(deleteTarget.id);
      showToast('លុបតួនាទីជោគជ័យ', 'success');
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
          <div className="ent-page-title">Positions</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Job titles across the organization
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={openCreate}>+ New Position</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <TrendStatCard label="Total Positions" value={total} icon="💼" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Assigned to Org" value={assigned} icon="🔗" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Unassigned" value={unassigned} icon="⚠️" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={byLevel} title="Positions by Level" centerLabel="Total" />
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
                <div className="ent-empty-icon">💼</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No positions found</div>
                <div className="small">Try a different search, or add your first position.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ width: '70px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.level ? <span className="ent-pill ent-pill-neutral">{p.level}</span> : '—'}</td>
                      <td>{p.departmentName || <span className="text-muted">—</span>}</td>
                      <td>
                        <span className={`ent-pill ${p.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                          <Dropdown.Menu>
                            {canUpdate && <Dropdown.Item onClick={() => openEdit(p)}>Edit</Dropdown.Item>}
                            {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(p)}>Delete</Dropdown.Item>}
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

      <PositionFormModal
        show={formShow}
        initialData={editing}
        companies={companies}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Position"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTarget?.name}" មែនទេ?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default PositionList;