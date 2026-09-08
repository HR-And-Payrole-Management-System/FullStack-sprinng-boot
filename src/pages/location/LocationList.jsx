import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

import { locationService } from '../../services/location.service';
import { branchService } from '../../services/branch.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import LocationFormModal from './LocationFormModal';

function LocationList() {
  const { showToast } = useToast();
  const canCreate = useHasPermission('LOCATION_CREATE');
  const canUpdate = useHasPermission('LOCATION_UPDATE');
  const canDelete = useHasPermission('LOCATION_DELETE');

  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formShow, setFormShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([locationService.list(), branchService.list()])
      .then(([l, b]) => { setLocations(l); setBranches(b); })
      .catch(() => showToast('Unable to load locations.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.branchName?.toLowerCase().includes(q)
    );
  }, [locations, search]);

  const total = locations.length;
  const active = locations.filter((l) => l.status === 'ACTIVE').length;
  const primaryCount = locations.filter((l) => l.primary).length;

  const byCountry = useMemo(() => {
    const map = {};
    locations.forEach((l) => {
      const key = l.country || 'Unknown';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [locations]);

  const openCreate = () => { setEditing(null); setFormShow(true); };
  const openEdit = (l) => { setEditing(l); setFormShow(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await locationService.update(editing.id, values);
        showToast('Location updated successfully.', 'success');
      } else {
        await locationService.create(values);
        showToast('Location created successfully.', 'success');
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
      await locationService.remove(deleteTarget.id);
      showToast('Location deleted successfully.', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this location.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Locations</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Physical addresses and sites tied to your branches
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={openCreate}>+ New Location</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <TrendStatCard label="Total Locations" value={total} icon="📍" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Active" value={active} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Primary Locations" value={primaryCount} icon="⭐" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={byCountry} title="Locations by Country" centerLabel="Total" />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div className="ent-search mb-3" style={{ maxWidth: '300px' }}>
              <span className="ent-search-icon">🔍</span>
              <Form.Control
                placeholder="Search name, city or branch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">📍</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No locations found</div>
                <div className="small">Try a different search, or add your first location.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Branch</th>
                    <th>City / Country</th>
                    <th>Primary</th>
                    <th>Status</th>
                    <th style={{ width: '70px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.name}</td>
                      <td>{l.branchName || <span className="text-muted">—</span>}</td>
                      <td>{l.city}{l.country ? `, ${l.country}` : ''}</td>
                      <td>
                        {l.primary
                          ? <span className="ent-pill ent-pill-warning">Primary</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <span className={`ent-pill ${l.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {(canUpdate || canDelete) ? (
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                              {canUpdate && <Dropdown.Item onClick={() => openEdit(l)}>Edit</Dropdown.Item>}
                              {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(l)}>Delete</Dropdown.Item>}
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

      <LocationFormModal
        show={formShow}
        initialData={editing}
        branches={branches}
        submitting={submitting}
        onClose={() => setFormShow(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Location"
        body={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default LocationList;