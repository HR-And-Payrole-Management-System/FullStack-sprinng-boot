import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Table, Button, Form, Dropdown } from 'react-bootstrap';

import { systemSettingService } from '../../../services/systemSetting.service';
import { useHasPermission } from '../../../hooks/useHaspermission';
import { useToast } from '../../../context/ToastContext';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmModal from '../../../components/ConfirmModal';
import AddSettingModal from './AddSettingModal';

const CATEGORIES = ['GENERAL', 'NOTIFICATION', 'PAYROLL', 'SECURITY'];

function SettingValueInput({ setting, value, onChange }) {
  if (setting.dataType === 'BOOLEAN') {
    return (
      <Form.Check
        type="switch"
        checked={value === 'true'}
        onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
      />
    );
  }
  if (setting.dataType === 'NUMBER') {
    return (
      <Form.Control
        type="number"
        size="sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ maxWidth: '160px' }}
      />
    );
  }
  return (
    <Form.Control
      type="text"
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ maxWidth: '260px' }}
    />
  );
}

function SystemSettingsPage() {
  const { showToast } = useToast();
  const canUpdate = useHasPermission('SETTINGS_UPDATE');

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftValues, setDraftValues] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  const [addShow, setAddShow] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    systemSettingService.list()
      .then((data) => {
        setSettings(data);
        const drafts = {};
        data.forEach((s) => { drafts[s.settingKey] = s.settingValue ?? ''; });
        setDraftValues(drafts);
      })
      .catch(() => showToast('Unable to load settings.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const byCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => { map[c] = []; });
    settings.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [settings]);

  const isDirty = (setting) => draftValues[setting.settingKey] !== (setting.settingValue ?? '');

  const handleSave = async (setting) => {
    setSavingKey(setting.settingKey);
    try {
      await systemSettingService.updateValue(setting.settingKey, draftValues[setting.settingKey]);
      showToast(`"${setting.settingKey}" updated successfully.`, 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to update this setting.', 'danger');
    } finally {
      setSavingKey(null);
    }
  };

  const handleAddSetting = async (values) => {
    setAddSubmitting(true);
    try {
      await systemSettingService.upsert({ ...values, settingKey: values.settingKey.toUpperCase() });
      showToast('Setting added successfully.', 'success');
      setAddShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to add this setting.', 'danger');
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await systemSettingService.remove(deleteTarget.settingKey);
      showToast('Setting deleted successfully.', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this setting.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">System Settings</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Configure application-wide preferences by category
          </div>
        </div>
        {canUpdate && <Button className="ent-btn-primary" onClick={() => setAddShow(true)}>+ New Setting</Button>}
      </div>

      <Tabs defaultActiveKey={CATEGORIES[0]} className="mb-3">
        {CATEGORIES.map((category) => (
          <Tab eventKey={category} title={category.charAt(0) + category.slice(1).toLowerCase()} key={category}>
            <div className="ent-card p-3">
              {(byCategory[category] || []).length === 0 ? (
                <div className="ent-empty">
                  <div className="ent-empty-icon">⚙️</div>
                  <div style={{ fontWeight: 600 }}>No settings in this category yet</div>
                  <div className="small">Add a setting to configure {category.toLowerCase()} behavior.</div>
                </div>
              ) : (
                <Table responsive className="ent-table mb-0">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Description</th>
                      <th>Value</th>
                      <th style={{ width: '90px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCategory[category].map((s) => (
                      <tr key={s.settingKey}>
                        <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{s.settingKey}</td>
                        <td className="text-muted small">{s.description || '—'}</td>
                        <td>
                          {canUpdate ? (
                            <div className="d-flex align-items-center gap-2">
                              <SettingValueInput
                                setting={s}
                                value={draftValues[s.settingKey] ?? ''}
                                onChange={(v) => setDraftValues((prev) => ({ ...prev, [s.settingKey]: v }))}
                              />
                              {isDirty(s) && (
                                <Button
                                  size="sm"
                                  className="ent-btn-primary"
                                  disabled={savingKey === s.settingKey}
                                  onClick={() => handleSave(s)}
                                >
                                  {savingKey === s.settingKey ? 'Saving...' : 'Save'}
                                </Button>
                              )}
                            </div>
                          ) : (
                            <span>{s.settingValue || '—'}</span>
                          )}
                        </td>
                        <td className="text-end">
                          {canUpdate ? (
                            <Dropdown align="end">
                              <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(s)}>Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : <span className="text-muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>

      <AddSettingModal
        show={addShow}
        submitting={addSubmitting}
        onClose={() => setAddShow(false)}
        onSubmit={handleAddSetting}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Setting"
        body={`Are you sure you want to delete "${deleteTarget?.settingKey}"?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default SystemSettingsPage;