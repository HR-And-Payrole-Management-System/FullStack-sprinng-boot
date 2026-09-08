import { useEffect, useState } from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';

import { performanceService } from '../../services/performance.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import CycleFormModal from './CycleFormModal';

const STATUS_PILL = {
  DRAFT: 'ent-pill-neutral',
  ACTIVE: 'ent-pill-success',
  CLOSED: 'ent-pill-danger',
};

function CyclesPanel() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('PERFORMANCE_CREATE');
  const canUpdate = useHasPermission('PERFORMANCE_UPDATE');

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formShow, setFormShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actingId, setActingId] = useState(null);

  const load = () => {
    setLoading(true);
    performanceService
      .listCycles()
      .then(setCycles)
      .catch(() => showToast('មិនអាចទាញយក Performance Cycles បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await performanceService.createCycle(values);
      showToast('បង្កើត Cycle ជោគជ័យ', 'success');
      setFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (id) => {
    setActingId(id);
    try {
      await performanceService.activateCycle(id);
      showToast('Cycle ត្រូវបានធ្វើឲ្យសកម្ម', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    } finally {
      setActingId(null);
    }
  };

  const handleClose = async (id) => {
    setActingId(id);
    try {
      await performanceService.closeCycle(id);
      showToast('Cycle ត្រូវបានបិទ', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        {canCreate && <Button className="ent-btn-primary" onClick={() => setFormShow(true)}>+ New Cycle</Button>}
      </div>

      <div className="ent-card p-3">
        {cycles.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">🎯</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No performance cycles yet</div>
          </div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead>
              <tr>
                <th>Cycle</th>
                <th>Period</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ width: '70px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td className="small">{c.startDate} → {c.endDate}</td>
                  <td className="text-muted small">{c.description || '—'}</td>
                  <td><span className={`ent-pill ${STATUS_PILL[c.status] || 'ent-pill-neutral'}`}>{c.status}</span></td>
                  <td className="text-end">
                    {canUpdate && c.status !== 'CLOSED' && (
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0" disabled={actingId === c.id}>⋮</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {c.status === 'DRAFT' && (
                            <Dropdown.Item onClick={() => handleActivate(c.id)}>Activate</Dropdown.Item>
                          )}
                          {c.status === 'ACTIVE' && (
                            <Dropdown.Item className="text-danger" onClick={() => handleClose(c.id)}>Close</Dropdown.Item>
                          )}
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

      <CycleFormModal show={formShow} submitting={submitting} onClose={() => setFormShow(false)} onSubmit={handleCreate} />
    </div>
  );
}

export default CyclesPanel;