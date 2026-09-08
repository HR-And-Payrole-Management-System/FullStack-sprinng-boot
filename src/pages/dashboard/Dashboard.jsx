import { useEffect, useState } from 'react';
import { Row, Col, Table, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { dashboardService } from '../../services/dashboard.service';
import { employeeService } from '../../services/employee.service';
import { departmentService } from '../../services/department.service';
import { useAuth } from '../../context/AuthContext';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import DashboardFilterBar from '../../components/charts/DashboardFilterBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import LineTrendChart from '../../components/charts/LineTrendChart';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';
import { resolveUploadUrl } from '../../utils/url';
// =======================================================================
// Small presentational helpers — kept local to this file so the page
// stays a single self-contained unit while the backend catches up.
// =======================================================================

function ChartPlaceholder({ title, note }) {
  return (
    <div className="ent-card p-3 h-100">
      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{title}</div>
      <div className="ent-empty" style={{ padding: '2rem 1rem' }}>
        <div className="ent-empty-icon">📊</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>
          Backend data not available yet
        </div>
        <div className="small">{note}</div>
      </div>
    </div>
  );
}

// Compact empty-state for slim right-rail widgets — smaller padding
// than ChartPlaceholder so it doesn't dominate a narrow column.
function WidgetEmpty({ note }) {
  return (
    <div className="ent-empty" style={{ padding: '1rem 0.5rem' }}>
      <div className="ent-empty-icon" style={{ fontSize: '1.4rem' }}>🕓</div>
      <div className="small">{note}</div>
    </div>
  );
}

function money(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function initials(fn = '', ln = '') {
  return `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

function timeAgo(timestamp) {
  if (!timestamp) return '—';
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function SectionLabel({ icon, children, action }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex align-items-center gap-2">
        {icon && (
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
        <div
          style={{
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {children}
        </div>
      </div>
      {action}
    </div>
  );
}

function MiniStat({ value, label, color }) {
  return (
    <div className="text-center py-2">
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function InsightCard({ icon, iconBg, iconColor, accent, children }) {
  return (
    <div
      className="ent-card p-3 d-flex align-items-center gap-3 h-100"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-md)',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.05rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{children}</div>
    </div>
  );
}

// Wraps a KPI card with a colored top accent bar so the row reads as a
// coherent, color-coded strip instead of uniform white boxes.
function KpiSlot({ accent, children }) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        height: '100%',
      }}
    >
      <div style={{ height: 4, background: accent }} />
      <div style={{ background: 'var(--color-surface)' }}>{children}</div>
    </div>
  );
}

// A slim card used throughout the right rail — consistent padding/border
// so Quick Actions, Approvals, Holidays, etc. all feel like one family.
function RailCard({ title, icon, accent, action, children }) {
  return (
    <div
      className="ent-dash-card p-3 mb-3 d-flex flex-column"
      style={{ borderTop: `3px solid ${accent}`, flex: '1 1 0' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '0.95rem' }}>{icon}</span>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{title}</div>
        </div>
        {action}
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        {children}
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="d-flex flex-column align-items-center justify-content-center gap-1"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 0.25rem',
        width: '100%',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-soft)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.2 }}>
        {label}
      </span>
    </button>
  );
}

function ApprovalRow({ label, count, color }) {
  if (!count) return null;
  return (
    <div className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{label}</span>
      <span
        className="ent-pill"
        style={{ background: `${color}1A`, color, fontWeight: 700 }}
      >
        {count}
      </span>
    </div>
  );
}

function PipelineStage({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between mb-1">
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)' }}>{value}</span>
      </div>
      <ProgressBar now={pct} style={{ height: 6, borderRadius: 4 }} variant="" >
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </ProgressBar>
    </div>
  );
}

function ActivityRow({ actor, action, target, timestamp, icon }) {
  return (
    <div className="d-flex align-items-start gap-2 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          flexShrink: 0,
        }}
      >
        {icon || '•'}
      </span>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', flexGrow: 1 }}>
        <strong>{actor}</strong> {action} <strong>{target}</strong>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)' }}>{timeAgo(timestamp)}</div>
      </div>
    </div>
  );
}

// =======================================================================
// Main component
// =======================================================================

function Dashboard() {
  const navigate = useNavigate();
  const { user, hasRole, hasPermission } = useAuth();
  const canViewEmployeeDirectory = hasRole('ADMIN') || hasPermission('EMPLOYEE_VIEW');

  const [data, setData] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'Jan 2023 - Dec 2023',
    department: 'All',
    jobRole: 'All',
    location: 'All',
  });

  const [workforce, setWorkforce] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardService.loadAll(),
      dashboardService.loadWorkforce(),
      canViewEmployeeDirectory
        ? employeeService.list({ page: 0, size: 6, sortBy: 'hireDate', direction: 'desc' })
        : Promise.resolve({ content: [] }),
      departmentService.list().catch(() => []),
    ])
      .then(([dashboard, wf, employeesPage, depts]) => {
        setData(dashboard);
        setWorkforce(wf);
        setRecentEmployees(employeesPage.content || []);
        setDepartments(depts);
      })
      .catch((err) => {
        setLoadError(
          err.response?.status === 403
            ? 'You do not have permission to view all dashboard widgets.'
            : 'Failed to load dashboard data. Please try again.'
        );
      })
      .finally(() => setLoading(false));
  }, [canViewEmployeeDirectory]);

  if (loading) return <LoadingSpinner fullPage />;

  if (loadError) {
    return (
      <div className="ent-empty" style={{ padding: '3rem' }}>
        <div className="ent-empty-icon">⚠️</div>
        <div>{loadError}</div>
      </div>
    );
  }

  const { summary, attendance, leaves, payroll, organization } = data;

  // ---- Widgets below read from fields that don't exist in the API
  // response yet (pendingApprovals, upcomingHolidays, birthdays,
  // announcements, complianceAlerts, recruitment, trainingCompletion,
  // recentActivity). They're written defensively with optional
  // chaining + fallback arrays so the page renders a clean empty
  // state today, and lights up automatically once the matching
  // backend endpoints exist — no further frontend change needed.
  const pendingApprovals = data.pendingApprovals || {};
  const upcomingHolidays = data.upcomingHolidays || [];
  const birthdays = data.birthdays || [];
  const announcements = data.announcements || [];
  const complianceAlerts = data.complianceAlerts || [];
  const recruitment = data.recruitment || null;
  const trainingCompletion = data.trainingCompletion; // number | undefined
  const recentActivity = data.recentActivity || [];

  const leaveChartData = leaves
    ? [
        { name: 'Pending', value: leaves.pending ?? 0 },
        { name: 'Approved', value: leaves.approved ?? 0 },
        { name: 'Rejected', value: leaves.rejected ?? 0 },
        { name: 'Cancelled', value: leaves.cancelled ?? 0 },
      ].filter((d) => d.value > 0)
    : [];

  const payrollStatusData = payroll
    ? [
        { name: 'Calculated', value: payroll.calculated ?? 0 },
        { name: 'Approved', value: payroll.approved ?? 0 },
        { name: 'Paid', value: payroll.paid ?? 0 },
      ].filter((d) => d.value > 0)
    : [];

  const attendanceRate =
    attendance?.present != null && summary?.activeEmployees
      ? Math.round((attendance.present / summary.activeEmployees) * 100)
      : null;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const totalPendingApprovals =
    (pendingApprovals.leave ?? 0) +
    (pendingApprovals.payroll ?? 0) +
    (pendingApprovals.documents ?? 0) +
    (pendingApprovals.recruitment ?? 0);

  // Top departments by headcount — falls back gracefully if the
  // department objects don't carry an employeeCount field yet.
  const topDepartments = [...departments]
    .filter((d) => d.employeeCount != null)
    .sort((a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0))
    .slice(0, 5);
  const maxDeptCount = topDepartments.length > 0 ? topDepartments[0].employeeCount : 0;

  const recruitmentMax = recruitment
    ? Math.max(
        recruitment.applied ?? 0,
        recruitment.screening ?? 0,
        recruitment.interview ?? 0,
        recruitment.offer ?? 0,
        recruitment.hired ?? 0
      )
    : 0;

  return (
    <div>
      {/* ============ Hero Banner ============ */}
      <div
        className="mb-4"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #6366F1 55%, #818CF8 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          boxShadow: 'var(--shadow-md)',
          color: '#fff',
        }}
      >
        <Row className="align-items-center g-3">
          <Col lg={7}>
            <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {today}
            </div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 4 }}>
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''} 👋
            </div>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginTop: 4 }}>
              Here's what's happening across your organization today.
            </div>
          </Col>

          <Col lg={5}>
            <Row className="g-2">
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{summary?.totalEmployees ?? '—'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Employees</div>
                </div>
              </Col>
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{attendanceRate != null ? `${attendanceRate}%` : '—'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Attendance</div>
                </div>
              </Col>
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{money(payroll?.netSalary)}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Net Payroll</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* ============ Header + Filter Bar ============ */}
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">HR Analytics Dashboard</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Employee Overview &amp; Workforce Insights
          </div>
        </div>

        <DashboardFilterBar
          values={filters}
          onChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
          departmentOptions={['All', ...departments.map((d) => d.name)]}
          onOpenFilters={() => {}}
        />
      </div>

      {/* ============ Row 1: KPI cards (color-coded accents) ============ */}
      <Row className="g-3 mb-4 align-items-stretch">
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-purple)">
            <TrendStatCard
              label="Total Employees"
              value={summary?.totalEmployees ?? '—'}
              icon="👥"
              iconBg="var(--kpi-purple-soft)"
              iconColor="var(--kpi-purple)"
              delta={summary?.totalEmployeesDeltaPercent != null ? `${Math.abs(summary.totalEmployeesDeltaPercent)}%` : null}
              deltaDirection={summary?.totalEmployeesDeltaDirection}
              note="vs Last Year"
            />
          </KpiSlot>
        </Col>
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-green)">
            <TrendStatCard label="Active Employees" value={summary?.activeEmployees ?? '—'} icon="🆕" iconBg="var(--kpi-green-soft)" iconColor="var(--kpi-green)" />
          </KpiSlot>
        </Col>
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-orange)">
            <TrendStatCard label="Companies" value={summary?.totalCompanies ?? organization?.companies ?? '—'} icon="🏢" iconBg="var(--kpi-orange-soft)" iconColor="var(--kpi-orange)" />
          </KpiSlot>
        </Col>
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-pink)">
            <TrendStatCard label="Departments" value={summary?.totalDepartments ?? organization?.departments ?? '—'} icon="🗂️" iconBg="var(--kpi-pink-soft)" iconColor="var(--kpi-pink)" />
          </KpiSlot>
        </Col>
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-teal)">
            <TrendStatCard label="Present Today" value={attendance?.present ?? '—'} icon="🟢" iconBg="var(--kpi-teal-soft)" iconColor="var(--kpi-teal)" />
          </KpiSlot>
        </Col>
        <Col md={4} lg={2}>
          <KpiSlot accent="var(--kpi-gold)">
            <TrendStatCard label="Net Payroll (month)" value={money(payroll?.netSalary)} icon="💰" iconBg="var(--kpi-gold-soft)" iconColor="var(--kpi-gold)" />
          </KpiSlot>
        </Col>
      </Row>

      {/* ============ Section: Workforce Overview ============ */}
      <SectionLabel icon="📋">Workforce Overview</SectionLabel>
      <Row className="g-3 mb-4">
        <Col lg={4}>
          <div className="ent-card p-3 h-100" style={{ borderLeft: '3px solid var(--kpi-teal)' }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">Attendance Today</div>
            <Row className="g-2">
              <Col xs={4} style={{ borderRight: '1px solid var(--color-border)' }}>
                <MiniStat value={attendance?.present} label="Present" color="var(--color-success)" />
              </Col>
              <Col xs={4} style={{ borderRight: '1px solid var(--color-border)' }}>
                <MiniStat value={attendance?.absent} label="Absent" color="var(--color-danger)" />
              </Col>
              <Col xs={4}>
                <MiniStat value={attendance?.late} label="Late" color="var(--color-warning)" />
              </Col>
            </Row>
          </div>
        </Col>

        <Col lg={4}>
          {leaveChartData.length > 0
            ? <DonutChart data={leaveChartData} title="Leave Requests (this year)" centerLabel="Total Requests" height={220} />
            : <ChartPlaceholder title="Leave Requests (this year)" note="No leave requests recorded yet." />}
        </Col>

        <Col lg={4}>
          {payrollStatusData.length > 0
            ? <DonutChart data={payrollStatusData} title="Payroll Status (this month)" centerLabel="Payroll Runs" height={220} />
            : <ChartPlaceholder title="Payroll Status (this month)" note="No payroll runs recorded yet." />}
        </Col>
      </Row>

      {/* ============ Two-column layout: main content + right rail ============ */}
      <Row className="g-3">
        {/* ---------------- Main column ---------------- */}
        <Col lg={8} className="d-flex flex-column">

          {/* ---- Trends & Attrition ---- */}
          <SectionLabel icon="📈">Trends &amp; Attrition</SectionLabel>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6}>
              <LineTrendChart
                data={workforce.trend}
                xKey="name"
                lineKey="value"
                title="Employees Trend Over Time"
              />
            </Col>
            <Col lg={4} md={6}>
              {workforce.attritionByDept.length > 0
                ? <DonutChart data={workforce.attritionByDept} title="Attrition by Department" centerLabel="Total Attrition" />
                : <ChartPlaceholder title="Attrition by Department" note="No resigned employees recorded yet." />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.attritionByPosition.length > 0
                ? <HorizontalBarChart data={workforce.attritionByPosition} title="Attrition by Job Role" />
                : <ChartPlaceholder title="Attrition by Job Role" note="No resigned employees recorded yet." />}
            </Col>
          </Row>

          {/* ---- Demographics ---- */}
          <SectionLabel icon="🧬">Demographics</SectionLabel>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6}>
              {workforce.ageGroups.some((d) => d.value > 0)
                ? <DonutChart data={workforce.ageGroups} title="Employees by Age Group" centerLabel="Total" />
                : <ChartPlaceholder title="Employees by Age Group" note="No date of birth data recorded yet." />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.gender.some((d) => d.value > 0)
                ? <DonutChart data={workforce.gender} title="Gender Diversity" centerLabel="Total" />
                : <ChartPlaceholder title="Gender Diversity" note="No gender data recorded yet." />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.tenure.some((d) => d.value > 0)
                ? <HorizontalBarChart data={workforce.tenure} title="Tenure Distribution" />
                : <ChartPlaceholder title="Tenure Distribution" note="No hire date data recorded yet." />}
            </Col>
          </Row>

          {/* ---- Top Departments by Headcount ---- */}
          <SectionLabel icon="🏆">Top Departments by Headcount</SectionLabel>
          <div className="ent-card p-3 mb-4">
            {topDepartments.length === 0 ? (
              <ChartPlaceholder title="" note="Department headcount data not available yet — add employeeCount to the department response." />
            ) : (
              topDepartments.map((d) => (
                <div key={d.id} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{d.name}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>{d.employeeCount}</span>
                  </div>
                  <ProgressBar style={{ height: 8, borderRadius: 4 }}>
                    <div
                      style={{
                        width: `${maxDeptCount > 0 ? Math.round((d.employeeCount / maxDeptCount) * 100) : 0}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        borderRadius: 4,
                      }}
                    />
                  </ProgressBar>
                </div>
              ))
            )}
          </div>

          {/* ---- Recruitment Pipeline + Training Completion ---- */}
          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="ent-card p-3 h-100">
                <SectionLabel icon="🧑‍💻">Recruitment Pipeline</SectionLabel>
                {!recruitment ? (
                  <ChartPlaceholder title="" note="Recruitment funnel data not available yet." />
                ) : (
                  <>
                    <PipelineStage label="Applied" value={recruitment.applied ?? 0} max={recruitmentMax} color="var(--chart-6)" />
                    <PipelineStage label="Screening" value={recruitment.screening ?? 0} max={recruitmentMax} color="var(--chart-1)" />
                    <PipelineStage label="Interview" value={recruitment.interview ?? 0} max={recruitmentMax} color="var(--chart-4)" />
                    <PipelineStage label="Offer" value={recruitment.offer ?? 0} max={recruitmentMax} color="var(--chart-5)" />
                    <PipelineStage label="Hired" value={recruitment.hired ?? 0} max={recruitmentMax} color="var(--color-success)" />
                  </>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="ent-card p-3 h-100">
                <SectionLabel icon="🎓">Training Completion</SectionLabel>
                {trainingCompletion == null ? (
                  <ChartPlaceholder title="" note="Training completion data not available yet." />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 py-3">
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {trainingCompletion}%
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                      of active employees completed required training
                    </div>
                    <ProgressBar style={{ width: '100%', height: 8, borderRadius: 4 }}>
                      <div
                        style={{
                          width: `${trainingCompletion}%`,
                          height: '100%',
                          background: 'var(--color-primary)',
                          borderRadius: 4,
                        }}
                      />
                    </ProgressBar>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* ---- Key Insights ---- */}
          <SectionLabel icon="💡">Key Insights</SectionLabel>
          <Row className="g-3 mb-4">
            <Col md={6} lg={4}>
              <InsightCard icon="👥" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" accent="var(--color-primary)">
                Total headcount: <strong>{summary?.totalEmployees ?? '—'}</strong> employees across{' '}
                <strong>{organization?.companies ?? '—'}</strong> companies.
              </InsightCard>
            </Col>
            <Col md={6} lg={4}>
              <InsightCard icon="🏬" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" accent="var(--color-warning)">
                <strong>{organization?.branches ?? '—'}</strong> branches across{' '}
                <strong>{organization?.departments ?? '—'}</strong> departments.
              </InsightCard>
            </Col>
            <Col md={6} lg={4}>
              <InsightCard icon="💰" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" accent="var(--color-success)">
                Gross salary this month: <strong>{money(payroll?.grossSalary)}</strong>.
              </InsightCard>
            </Col>
          </Row>

          {/* ---- Recent Employees (admin/HR only) ---- */}
          {/* ---- Recent Employees (admin/HR only) ---- */}
          {canViewEmployeeDirectory && (
            <>
              <SectionLabel icon="🧑‍💼">Recent Employees</SectionLabel>
              <div className="ent-card p-3 mb-4">
                <div className="d-flex justify-content-end align-items-center mb-2">
                  <span
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate('/employee')}
                  >
                    View all →
                  </span>
                </div>

                {recentEmployees.length === 0 ? (
                  <div className="ent-empty" style={{ padding: '1.5rem' }}>
                    <div className="ent-empty-icon">👥</div>
                    <div className="small">No employees yet.</div>
                  </div>
                ) : (
                  <Table responsive className="ent-table ent-mini-table mb-0">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Hire Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEmployees.map((e) => (
                        <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employee/${e.id}`)}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {e.photoUrl ? (
                                <img
                                  src={resolveUploadUrl(e.photoUrl)}
                                  alt={`${e.firstName} ${e.lastName}`}
                                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                  onError={(ev) => { ev.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <span className="ent-avatar-badge">{initials(e.firstName, e.lastName)}</span>
                              )}
                              <div>
                                <div style={{ fontWeight: 600 }}>{e.firstName} {e.lastName}</div>
                                <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{e.employeeCode}</div>
                              </div>
                            </div>
                          </td>
                          <td>{e.departmentName || '—'}</td>
                          <td>{e.positionName || '—'}</td>
                          <td>{e.hireDate || '—'}</td>
                          <td>
                            <span className={`ent-pill ${e.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>{e.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </>
          )}

          {/* ---- Recent Activity feed ---- */}
          <SectionLabel icon="🕘">Recent Activity</SectionLabel>
          <div className="ent-card p-3 mb-4">
            {recentActivity.length === 0 ? (
              <WidgetEmpty note="No recent activity recorded yet — hook this up to your audit log endpoint." />
            ) : (
              recentActivity.slice(0, 8).map((a, i) => (
                <ActivityRow
                  key={i}
                  actor={a.actor}
                  action={a.action}
                  target={a.target}
                  timestamp={a.timestamp}
                  icon={a.icon}
                />
              ))
            )}
          </div>
        </Col>

        {/* ---------------- Right rail ---------------- */}
        <Col lg={4} className="d-flex flex-column">

          {/* ---- Quick Actions ---- */}
          <RailCard title="Quick Actions" icon="⚡" accent="var(--color-primary)">
            <Row className="g-2">
              <Col xs={4}>
                <QuickActionButton icon="👤" label="Add Employee" onClick={() => navigate('/employee')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="🗂️" label="Add Department" onClick={() => navigate('/department')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="💰" label="Run Payroll" onClick={() => navigate('/payroll')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="🌴" label="Leave Requests" onClick={() => navigate('/leave')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="📊" label="Reports" onClick={() => navigate('/reports')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="⚙️" label="Settings" onClick={() => navigate('/settings/system-settings')} />
              </Col>
            </Row>
          </RailCard>

          {/* ---- Pending Approvals ---- */}
          <RailCard
            title="Pending Approvals"
            icon="✅"
            accent="var(--color-warning)"
            action={
              totalPendingApprovals > 0 && (
                <span className="ent-pill" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)', fontWeight: 700 }}>
                  {totalPendingApprovals}
                </span>
              )
            }
          >
            {totalPendingApprovals === 0 ? (
              <WidgetEmpty note="No pending approvals data available yet." />
            ) : (
              <>
                <ApprovalRow label="Leave requests" count={pendingApprovals.leave} color="var(--kpi-teal)" />
                <ApprovalRow label="Payroll approvals" count={pendingApprovals.payroll} color="var(--kpi-gold)" />
                <ApprovalRow label="Document reviews" count={pendingApprovals.documents} color="var(--kpi-purple)" />
                <ApprovalRow label="Recruitment offers" count={pendingApprovals.recruitment} color="var(--kpi-pink)" />
              </>
            )}
          </RailCard>

          {/* ---- Upcoming Holidays ---- */}
          <RailCard title="Upcoming Holidays" icon="📅" accent="var(--kpi-blue)">
            {upcomingHolidays.length === 0 ? (
              <WidgetEmpty note="No upcoming holidays configured yet." />
            ) : (
              upcomingHolidays.slice(0, 5).map((h, i) => (
                <div key={i} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{h.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{formatDate(h.date)}</span>
                </div>
              ))
            )}
          </RailCard>

          {/* ---- Birthdays This Month ---- */}
          <RailCard title="Birthdays This Month" icon="🎂" accent="var(--kpi-pink)">
            {birthdays.length === 0 ? (
              <WidgetEmpty note="No birthday data available yet." />
            ) : (
              birthdays.slice(0, 5).map((b, i) => (
                <div key={i} className="d-flex align-items-center gap-2 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="ent-avatar-badge">{initials(b.firstName, b.lastName)}</span>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                      {b.firstName} {b.lastName}
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{formatDate(b.date)}</span>
                </div>
              ))
            )}
          </RailCard>

          {/* ---- Announcements ---- */}
          <RailCard title="Announcements" icon="📣" accent="var(--kpi-orange)">
            {announcements.length === 0 ? (
              <WidgetEmpty note="No announcements posted yet." />
            ) : (
              announcements.slice(0, 4).map((a, i) => (
                <div key={i} className="py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{a.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(a.date)}</div>
                </div>
              ))
            )}
          </RailCard>

          {/* ---- Compliance Alerts ---- */}
          <RailCard title="Compliance Alerts" icon="⚠️" accent="var(--color-danger)">
            {complianceAlerts.length === 0 ? (
              <WidgetEmpty note="No compliance alerts — nothing expiring soon." />
            ) : (
              complianceAlerts.slice(0, 5).map((c, i) => (
                <div key={i} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{c.label}</span>
                  <span
                    className="ent-pill"
                    style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger)', fontWeight: 700 }}
                  >
                    {c.daysLeft}d
                  </span>
                </div>
              ))
            )}
          </RailCard>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;