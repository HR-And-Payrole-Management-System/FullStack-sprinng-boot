import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';

import { billingService } from '../../../services/Billing.service';
import { useHasPermission } from '../../../hooks/useHaspermission';
import { useToast } from '../../../context/ToastContext';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmModal from '../../../components/ConfirmModal';
import TrendStatCard from '../../../components/charts/TrendStatCard';

function BillingPage() {
  const { showToast } = useToast();
  const canManage = useHasPermission('BILLING_MANAGE');

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [changingPlan, setChangingPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      billingService.subscription(),
      billingService.plans(),
      billingService.invoices(),
      billingService.summary(),
    ])
      .then(([sub, pl, inv, sum]) => {
        setSubscription(sub); setPlans(pl); setInvoices(inv); setSummary(sum);
      })
      .catch(() => showToast('Unable to load billing information.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const usagePercent = useMemo(() => {
    if (!summary || !summary.employeeLimit || summary.employeeLimit <= 0) return 0;
    return Math.min(100, Math.round((summary.employeesUsed / summary.employeeLimit) * 100));
  }, [summary]);

  const handleChangePlan = async () => {
    setSubmitting(true);
    try {
      await billingService.changePlan(changingPlan.planKey);
      showToast(`Switched to ${changingPlan.planName} plan.`, 'success');
      setChangingPlan(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to change plan.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      await billingService.cancel();
      showToast('Subscription canceled.', 'success');
      setShowCancel(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to cancel subscription.', 'danger');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Billing & Subscription</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Manage your plan, usage, and payment history
          </div>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <TrendStatCard label="Current Plan" value={summary?.currentPlanName || '—'} icon="💳" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Employees Used" value={`${summary?.employeesUsed ?? 0} / ${summary?.employeeLimit === 2147483647 ? '∞' : summary?.employeeLimit ?? 0}`} icon="👥" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Next Billing" value={summary?.nextBillingDate || '—'} icon="📅" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Total Spent" value={`$${summary?.totalSpent ?? 0}`} icon="💰" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
      </Row>

      {/* Current plan card */}
      <div className="ent-card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{subscription?.planName} Plan</div>
            <span className={`ent-pill ${subscription?.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
              {subscription?.status}
            </span>
            <span className="text-muted ms-2" style={{ fontSize: 'var(--text-sm)' }}>
              ${subscription?.price} / {subscription?.billingCycle?.toLowerCase()}
            </span>
          </div>
          {canManage && subscription?.status === 'ACTIVE' && (
            <Button variant="outline-danger" size="sm" onClick={() => setShowCancel(true)}>
              Cancel Subscription
            </Button>
          )}
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between" style={{ fontSize: 'var(--text-sm)' }}>
            <span>Employee usage</span>
            <span>{usagePercent}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${usagePercent}%`, height: '100%', background: 'var(--color-primary)' }} />
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="ent-page-title mb-3" style={{ fontSize: 'var(--text-md)' }}>Available Plans</div>
      <Row className="g-3 mb-4">
        {plans.map((plan) => {
          const isCurrent = plan.planKey === subscription?.planKey;
          return (
            <Col md={6} lg={3} key={plan.planKey}>
              <div
                className="ent-card p-3 h-100 d-flex flex-column"
                style={plan.highlighted ? { borderColor: 'var(--color-primary)', borderWidth: 2 } : {}}
              >
                {plan.highlighted && <span className="ent-pill ent-pill-warning mb-2">Most Popular</span>}
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{plan.planName}</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '8px 0' }}>
                  ${plan.monthlyPrice}<span style={{ fontSize: 'var(--text-sm)', fontWeight: 400 }}>/mo</span>
                </div>
                <ul style={{ paddingLeft: 18, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', flexGrow: 1 }}>
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                {canManage && (
                  <Button
                    className={isCurrent ? 'ent-btn-secondary' : 'ent-btn-primary'}
                    disabled={isCurrent}
                    onClick={() => setChangingPlan(plan)}
                  >
                    {isCurrent ? 'Current Plan' : 'Switch to this Plan'}
                  </Button>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Invoice history */}
      <div className="ent-card p-3">
        <div className="ent-page-title mb-3" style={{ fontSize: 'var(--text-md)' }}>Billing History</div>
        {invoices.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">🧾</div>
            <div>No invoices yet</div>
          </div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td>{inv.planName}</td>
                  <td>${inv.amount}</td>
                  <td>
                    <span className={`ent-pill ${inv.status === 'PAID' ? 'ent-pill-success' : inv.status === 'FAILED' ? 'ent-pill-danger' : 'ent-pill-neutral'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>{inv.issuedDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

            <ConfirmModal
        show={!!changingPlan}
        title="Change Plan"
        body={`Switch to the ${changingPlan?.planName} plan at $${changingPlan?.monthlyPrice}/month?`}
        confirming={submitting}
        confirmText="Switch Plan"
        confirmingText="Switching..."
        confirmVariant="primary"
        onConfirm={handleChangePlan}
        onCancel={() => setChangingPlan(null)}
      />

      <ConfirmModal
        show={showCancel}
        title="Cancel Subscription"
        body="Are you sure you want to cancel your subscription? Your plan will remain active until the end of the billing period."
        confirming={canceling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </div>
  );
}

export default BillingPage;