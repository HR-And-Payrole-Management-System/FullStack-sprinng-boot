import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

import { branchService } from '../../services/branch.service';
import { companyService } from '../../services/company.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import KpiCard from '../../components/KpiCard';
import BranchFormModal from './BranchFormModal';
import { Dropdown } from 'react-bootstrap';
import { resolveUploadUrl } from '../../utils/url';
import { createPortal } from 'react-dom';


const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)'];

function initials(name = '') {
  return name.trim().slice(0, 2).toUpperCase();
}

function BranchList() {
  const { t } = useTranslation();
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
      .catch(() => showToast(t('branch.errorLoadFailed'), 'danger'))
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
      const key = b.companyName || t('branch.unassigned');
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [branches, t]);

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (b) => { setEditing(b); setFormShow(true); };

  const handleSubmit = async (values, logoFile) => {
    setSubmitting(true);
    try {
      const payload = { ...values, companyId: Number(values.companyId) };
      let saved;
      if (editing) {
        saved = await branchService.update(editing.id, payload);
        showToast(t('branch.updateSuccess'), 'success');
      } else {
        saved = await branchService.create(payload);
        showToast(t('branch.createSuccess'), 'success');
      }

      if (logoFile && saved?.id) {
        saved = await branchService.uploadLogo(saved.id, logoFile);
      }

      setFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t('branch.errorGeneric'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await branchService.remove(deleteTarget.id);
      showToast(t('branch.deleteSuccess'), 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t('branch.errorDeleteFailed'), 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">{t('branch.pageTitle')}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {t('branch.pageSubtitle')}
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={openCreate}>{t('branch.newBranchBtn')}</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <KpiCard label={t('branch.statTotalBranches')} value={totalBranches} icon="🏬" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <KpiCard label={t('branch.statHeadOffices')} value={headOfficeCount} icon="⭐" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <KpiCard label={t('common.active')} value={activeCount} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <KpiCard label={t('branch.statCompaniesCovered')} value={companiesCovered} icon="🏢" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="ent-card p-3 h-100">
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{t('branch.branchesByCompany')}</div>

            <div style={{ position: 'relative' }}>
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

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalBranches}</span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }}>{t('common.total', 'Total')}</span>
              </div>
            </div>
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
                placeholder={t('branch.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🏬</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('branch.noBranchesFound')}</div>
                <div className="small">{t('branch.noBranchesHint')}</div>
              </div>
            ) : (
              <Table className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>{t('branch.thBranch')}</th>
                    <th>{t('nav.company')}</th>
                    <th>{t('branch.thType')}</th>
                    <th>{t('common.status')}</th>
                    <th style={{  whiteSpace: 'nowrap' }}>{t('common.actions')}</th>
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
                          ? <span className="ent-pill ent-pill-warning">{t('branch.headOffice')}</span>
                          : <span className="ent-pill ent-pill-neutral">{t('nav.branch')}</span>}
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

                        <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                          {canUpdate && (
                            <Dropdown.Item onClick={() => openEdit(b)}>{t('common.edit')}</Dropdown.Item>
                          )}

                          {canDelete && (
                            <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(b)}>
                              {t('common.delete')}
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
        title={t('branch.deleteBranchTitle')}
        body={`${t('branch.deleteBranchBodyPrefix')} "${deleteTarget?.name}" ${t('branch.deleteBranchBodySuffix')}`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default BranchList;