import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';
import * as Icons from 'lucide-react';
import { Plug } from 'lucide-react';

import { integrationService } from '../../../services/Integration.service';
import { useHasPermission } from '../../../hooks/useHaspermission';
import { useToast } from '../../../context/ToastContext';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmModal from '../../../components/ConfirmModal';
import TrendStatCard from '../../../components/charts/TrendStatCard';
import ConnectIntegrationModal from './ConnectIntegrationModal';

const CATEGORY_LABEL = {
  COMMUNICATION: 'Communication',
  PRODUCTIVITY: 'Productivity',
  FINANCE: 'Finance',
  STORAGE: 'Storage',
  DEVELOPER_TOOLS: 'Developer Tools',
};

function IntegrationsPage() {
  const { showToast } = useToast();
  const canManage = useHasPermission('INTEGRATION_MANAGE');

  const [integrations, setIntegrations] = useState([]);
  const [summary, setSummary] = useState({ total: 0, connected: 0, disconnected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const [connectTarget, setConnectTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([integrationService.list(), integrationService.summary()])
      .then(([list, sum]) => { setIntegrations(list); setSummary(sum); })
      .catch(() => showToast('Unable to load integrations.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categories = useMemo(
    () => ['ALL', ...new Set(integrations.map((i) => i.category))],
    [integrations]
  );

  const filtered = useMemo(
    () => (activeCategory === 'ALL' ? integrations : integrations.filter((i) => i.category === activeCategory)),
    [integrations, activeCategory]
  );

  const handleConnect = async (values) => {
    setSubmitting(true);
    try {
      await integrationService.connect(connectTarget.id, values);
      showToast(`${connectTarget.displayName} connected successfully.`, 'success');
      setConnectTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to connect. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await integrationService.disconnect(disconnectTarget.id);
      showToast(`${disconnectTarget.displayName} disconnected.`, 'success');
      setDisconnectTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to disconnect.', 'danger');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Integrations</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Connect third-party apps to extend your HR workflows
          </div>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <TrendStatCard label="Total Integrations" value={summary.total} icon="🔌" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Connected" value={summary.connected} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={4}>
          <TrendStatCard label="Not Connected" value={summary.disconnected} icon="⭕" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
      </Row>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            className={`ent-filter-chip ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c === 'ALL' ? 'All' : CATEGORY_LABEL[c] || c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ent-empty">
          <div className="ent-empty-icon">🔌</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No integrations found</div>
        </div>
      ) : (
        <Row className="g-3">
          {filtered.map((item) => {
            const Icon = Icons[item.iconKey] || Plug;
            const isConnected = item.status === 'CONNECTED';
            return (
              <Col md={6} lg={4} key={item.id}>
                <div className="ent-card p-3 h-100 d-flex flex-column">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.displayName}</div>
                        <span className={`ent-pill ${isConnected ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                          {isConnected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                    {canManage && (
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                        <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                          {!isConnected && <Dropdown.Item onClick={() => setConnectTarget(item)}>Connect</Dropdown.Item>}
                          {isConnected && <Dropdown.Item onClick={() => setConnectTarget(item)}>Update Config</Dropdown.Item>}
                          {isConnected && (
                            <Dropdown.Item className="text-danger" onClick={() => setDisconnectTarget(item)}>
                              Disconnect
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', flexGrow: 1 }}>
                    {item.description}
                  </div>
                  {isConnected && item.connectedBy && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 8 }}>
                      Connected by {item.connectedBy}
                    </div>
                  )}
                  {!isConnected && canManage && (
                    <Button
                      size="sm"
                      className="ent-btn-primary mt-3"
                      onClick={() => setConnectTarget(item)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      <ConnectIntegrationModal
        show={!!connectTarget}
        integration={connectTarget}
        submitting={submitting}
        onClose={() => setConnectTarget(null)}
        onSubmit={handleConnect}
      />

      <ConfirmModal
        show={!!disconnectTarget}
        title="Disconnect Integration"
        body={`Disconnect ${disconnectTarget?.displayName}? Any stored credentials will be removed.`}
        confirming={disconnecting}
        onConfirm={handleDisconnect}
        onCancel={() => setDisconnectTarget(null)}
      />
    </div>
  );
}

export default IntegrationsPage;