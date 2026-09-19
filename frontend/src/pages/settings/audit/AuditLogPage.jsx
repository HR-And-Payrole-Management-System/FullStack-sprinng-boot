import { useEffect, useMemo, useState } from 'react';
import { Table, Form, Button, Pagination } from 'react-bootstrap';

import { auditLogService } from '../../../services/auditLog.service';
import { useToast } from '../../../context/ToastContext';
import { exportToCsv } from '../../../utils/exportCsv';

import LoadingSpinner from '../../../components/LoadingSpinner';
import FilterBar from '../../../components/charts/FilterBar';
import TrendStatCard from '../../../components/charts/TrendStatCard';
import AuditLogDetailModal from './AuditLogDetailModal';

const ACTION_OPTIONS = [
  'All', 'CREATE', 'UPDATE', 'DELETE',
  'LOGIN_SUCCESS', 'LOGIN_FAILED', 'APPROVE', 'REJECT', 'VERIFY', 'PROCESS',
];

const ACTION_PILL = {
  CREATE: 'ent-pill-success',
  APPROVE: 'ent-pill-success',
  VERIFY: 'ent-pill-success',
  LOGIN_SUCCESS: 'ent-pill-success',
  UPDATE: 'ent-pill-warning',
  PROCESS: 'ent-pill-warning',
  DELETE: 'ent-pill-danger',
  REJECT: 'ent-pill-danger',
  LOGIN_FAILED: 'ent-pill-danger',
};

const PAGE_SIZE = 20;

function AuditLogPage() {
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: 'All', entityType: 'All', dateFrom: '', dateTo: '' });
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [detailLog, setDetailLog] = useState(null);

  const load = () => {
    setLoading(true);
    auditLogService
      .list()
      .then(setLogs)
      .catch(() => showToast('មិនអាចទាញយកកំណត់ត្រាសវនកម្មបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const entityTypeOptions = useMemo(
    () => ['All', ...new Set(logs.map((l) => l.entityType).filter(Boolean))],
    [logs]
  );

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const actionMatch = filters.action === 'All' || l.action === filters.action;
      const entityMatch = filters.entityType === 'All' || l.entityType === filters.entityType;
      const dateStr = l.createdAt?.slice(0, 10);
      const fromMatch = !filters.dateFrom || (dateStr && dateStr >= filters.dateFrom);
      const toMatch = !filters.dateTo || (dateStr && dateStr <= filters.dateTo);
      const kwMatch =
        !keyword ||
        l.actor?.toLowerCase().includes(keyword.toLowerCase()) ||
        l.description?.toLowerCase().includes(keyword.toLowerCase());
      return actionMatch && entityMatch && fromMatch && toMatch && kwMatch;
    });
  }, [logs, filters, keyword]);

  useEffect(() => { setPage(0); }, [filters, keyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const failedLogins = logs.filter((l) => l.action === 'LOGIN_FAILED').length;
  const deletes = logs.filter((l) => l.action === 'DELETE').length;

  // Exports whatever is currently filtered — not just the visible page —
  // so "filter then export" behaves the way a user expects.
  const handleExport = () => {
    if (filtered.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    exportToCsv(
      `audit-logs-${stamp}.csv`,
      filtered.map((l) => ({
        Id: l.id,
        Timestamp: l.createdAt?.replace('T', ' '),
        Actor: l.actor,
        Action: l.action,
        EntityType: l.entityType,
        EntityId: l.entityId,
        Description: l.description,
        IpAddress: l.ipAddress,
      }))
    );
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Audit Logs</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            System-wide activity trail — every create, update, delete, and auth event
          </div>
        </div>
        <Button variant="light" onClick={handleExport} disabled={filtered.length === 0}>
          ⬇ Export CSV
        </Button>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <TrendStatCard label="Total Events" value={logs.length} icon="📜" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </div>
        <div className="col-md-3">
          <TrendStatCard label="Failed Logins" value={failedLogins} icon="⛔" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </div>
        <div className="col-md-3">
          <TrendStatCard label="Deletions" value={deletes} icon="🗑️" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </div>
        <div className="col-md-3">
          <TrendStatCard label="Filtered Results" value={filtered.length} icon="🔍" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <FilterBar
          filters={[
            { key: 'action', type: 'select', label: 'Action', options: ACTION_OPTIONS },
            { key: 'entityType', type: 'select', label: 'Entity', options: entityTypeOptions },
            { key: 'dateFrom', type: 'date', label: 'From' },
            { key: 'dateTo', type: 'date', label: 'To' },
          ]}
          values={filters}
          onChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
        />
        <Form.Control
          placeholder="Search actor or description..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ maxWidth: 240 }}
        />
      </div>

      <div className="ent-card p-3">
        {pageItems.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">📜</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No audit events found</div>
            <div className="small">Adjust filters to see more results.</div>
          </div>
        ) : (
          <>
            <Table responsive hover className="ent-table mb-0">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Description</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((l) => (
                  <tr key={l.id} onClick={() => setDetailLog(l)} style={{ cursor: 'pointer' }}>
                    <td className="small text-muted">{l.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                    <td>{l.actor}</td>
                    <td>
                      <span className={`ent-pill ${ACTION_PILL[l.action] || 'ent-pill-neutral'}`}>{l.action}</span>
                    </td>
                    <td>{l.entityType}{l.entityId ? ` #${l.entityId}` : ''}</td>
                    <td className="text-truncate" style={{ maxWidth: 320 }}>{l.description}</td>
                    <td className="small text-muted">{l.ipAddress || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <Pagination className="justify-content-end mt-3 mb-0">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </>
        )}
      </div>

      <AuditLogDetailModal show={!!detailLog} log={detailLog} onClose={() => setDetailLog(null)} />
    </div>
  );
}

export default AuditLogPage;