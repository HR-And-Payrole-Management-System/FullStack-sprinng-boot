import { useEffect, useState, useMemo } from 'react'; 
import { Row, Col, Table, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
import AdvancedFiltersModal from './AdvancedFiltersModal';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
// =======================================================================
// Small presentational helpers — kept local to this file so the page
// stays a single self-contained unit while the backend catches up.
// =======================================================================

function ChartPlaceholder({ title, note }) {
  const { t } = useTranslation();
  return (
    <div className="ent-card p-3 h-100">
      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">{title}</div>
      <div className="ent-empty" style={{ padding: '2rem 1rem' }}>
        <div className="ent-empty-icon">📊</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>
          {t('dashboard.backendNotAvailable')}
        </div>
        <div className="small">{note}</div>
      </div>
    </div>
  );
}

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
// One-shot typewriter (types once, then stops) — same visual style as
// AuthLayout's typewriter, but for a single line instead of a looping cycle.
function useTypewriterLoop(text, speedMs = 40, holdMs = 1800, resetMs = 300) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'holding' | 'resetting'

  useEffect(() => {
    let timer;
    if (phase === 'typing') {
      if (count < chars.length) {
        timer = setTimeout(() => setCount((c) => c + 1), speedMs);
      } else {
        timer = setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('resetting'), holdMs);
    } else if (phase === 'resetting') {
      setCount(0);
      timer = setTimeout(() => setPhase('typing'), resetMs);
    }
    return () => clearTimeout(timer);
  }, [phase, count, chars, speedMs, holdMs, resetMs]);

  return { display: chars.slice(0, count).join(''), done: phase !== 'typing' };
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
      <div style={{ height: 6, borderRadius: 4, background: 'var(--color-bg)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
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

// Fades + slides a section up on mount. `i` controls the stagger delay
// via the --reveal-i CSS variable consumed in theme.css.
function Reveal({ i = 0, className = '', style = {}, children }) {
  return (
    <div className={`ent-reveal ${className}`} style={{ '--reveal-i': i, ...style }}>
      {children}
    </div>
  );
}

// =======================================================================
// Main component
// =======================================================================

function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, hasRole, hasPermission } = useAuth();
  const canViewEmployeeDirectory = hasRole('ADMIN') || hasPermission('EMPLOYEE_VIEW');
  const welcomeText = `${t('dashboard.welcomeBack')}${user?.firstName ? `, ${user.firstName}${user?.lastName ? ` ${user.lastName}` : ''}` : ''} 👋`;
  const { display: welcomeDisplay, done: welcomeDone } = useTypewriterLoop(welcomeText, 40, 1800, 300);
  const [data, setData] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Single, correct declaration — 'This Year' is a real option in
  // DATE_RANGES (the old default 'Jan 2023 - Dec 2023' wasn't).
  const [filters, setFilters] = useState({
    dateRange: 'This Year',
    department: 'All',
    jobRole: 'All',
    location: 'All',
  });

  const [workforce, setWorkforce] = useState(null);

  const selectedDepartmentId =
    filters.department !== 'All'
      ? departments.find((d) => d.name === filters.department)?.id
      : null;
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  // Load the department list once, separately, so the filter dropdown has
  // options before the user picks anything.
  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.loadAll(selectedDepartmentId, filters.dateRange),
      dashboardService.loadWorkforce(),
      dashboardService.loadAttendanceTrend(7),
      canViewEmployeeDirectory
        ? employeeService.list({
            page: 0,
            size: 6,
            sortBy: 'hireDate',
            direction: 'desc',
            departmentId: selectedDepartmentId || undefined,
          })
        : Promise.resolve({ content: [] }),
    ])
      .then(([dashboard, wf, trend, employeesPage]) => {
        setData(dashboard);
        setWorkforce(wf);
        setAttendanceTrend(trend);
        setRecentEmployees(employeesPage.content || []);
        setLoadError('');
      })
      .catch((err) => {
        setLoadError(
          err.response?.status === 403
            ? t('dashboard.errorNoPermission')
            : t('dashboard.errorLoadFailed')
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewEmployeeDirectory, selectedDepartmentId, filters.dateRange]);

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

  const pendingApprovals = data.pendingApprovals || {};
  const upcomingHolidays = data.upcomingHolidays || [];
  const birthdays = data.birthdays || [];
  const announcements = data.announcements || [];
  const complianceAlerts = data.complianceAlerts || [];
  const recruitment = data.recruitment || null;
  const trainingCompletion = data.trainingCompletion;
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

  const today = new Date().toLocaleDateString(i18n.language === 'km' ? 'km-KH' : undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
    
  const totalPendingApprovals =
    (pendingApprovals.leave ?? 0) +
    (pendingApprovals.payroll ?? 0) +
    (pendingApprovals.documents ?? 0) +
    (pendingApprovals.recruitment ?? 0);

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
      <Reveal i={0} className="mb-4">
      <div
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
            <div className="ent-typewriter" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 4 }}>
              {welcomeDisplay}
              {!welcomeDone && <span className="ent-typewriter-cursor" />}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginTop: 4 }}>
              {t('dashboard.welcomeSubtitle')}
            </div>
          </Col>

          <Col lg={5}>
            <Row className="g-2">
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{summary?.totalEmployees ?? '—'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>{t('dashboard.heroEmployees')}</div>
                </div>
              </Col>
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{attendanceRate != null ? `${attendanceRate}%` : '—'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>{t('dashboard.heroAttendance')}</div>
                </div>
              </Col>
              <Col xs={4}>
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{money(payroll?.netSalary)}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>{t('dashboard.heroNetPayroll')}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      </Reveal>

      {/* ============ Header + Filter Bar ============ */}
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">{t('dashboard.pageTitle')}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {t('dashboard.pageSubtitle')}
          </div>
        </div>
        <DashboardFilterBar
          values={filters}
          onChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
          departmentOptions={['All', ...departments.map((d) => d.name)]}
          onOpenFilters={() => setShowAdvancedFilters(true)}
        />

        <AdvancedFiltersModal
          show={showAdvancedFilters}
          initialFilters={filters}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* ============ Row 1: KPI cards (color-coded accents) ============ */}
      <Row className="g-3 mb-4 align-items-stretch">
        <Col md={4} lg={2}>
          <Reveal i={1}>
          <KpiSlot accent="var(--kpi-purple)">
            <TrendStatCard
              label={t('dashboard.kpiTotalEmployees')}
              value={summary?.totalEmployees ?? '—'}
              icon="👥"
              iconBg="var(--kpi-purple-soft)"
              iconColor="var(--kpi-purple)"
              delta={summary?.totalEmployeesDeltaPercent != null ? `${Math.abs(summary.totalEmployeesDeltaPercent)}%` : null}
              deltaDirection={summary?.totalEmployeesDeltaDirection}
              note={t('dashboard.kpiVsLastYear')}
            />
          </KpiSlot>
          </Reveal>
        </Col>
        <Col md={4} lg={2}>
          <Reveal i={2}>
          <KpiSlot accent="var(--kpi-green)">
            <TrendStatCard label={t('dashboard.kpiActiveEmployees')} value={summary?.activeEmployees ?? '—'} icon="🆕" iconBg="var(--kpi-green-soft)" iconColor="var(--kpi-green)" />
          </KpiSlot>
          </Reveal>
        </Col>
        <Col md={4} lg={2}>
          <Reveal i={3}>
          <KpiSlot accent="var(--kpi-orange)">
            <TrendStatCard label={t('dashboard.kpiCompanies')} value={summary?.totalCompanies ?? organization?.companies ?? '—'} icon="🏢" iconBg="var(--kpi-orange-soft)" iconColor="var(--kpi-orange)" />
          </KpiSlot>
          </Reveal>
        </Col>
        <Col md={4} lg={2}>
          <Reveal i={4}>
          <KpiSlot accent="var(--kpi-pink)">
            <TrendStatCard label={t('dashboard.kpiDepartments')} value={summary?.totalDepartments ?? organization?.departments ?? '—'} icon="🗂️" iconBg="var(--kpi-pink-soft)" iconColor="var(--kpi-pink)" />
          </KpiSlot>
          </Reveal>
        </Col>
        <Col md={4} lg={2}>
          <Reveal i={5}>
          <KpiSlot accent="var(--kpi-teal)">
            <TrendStatCard label={t('dashboard.kpiPresentToday')} value={attendance?.present ?? '—'} icon="🟢" iconBg="var(--kpi-teal-soft)" iconColor="var(--kpi-teal)" />
          </KpiSlot>
          </Reveal>
        </Col>
        <Col md={4} lg={2}>
          <Reveal i={6}>
          <KpiSlot accent="var(--kpi-gold)">
            <TrendStatCard label={t('dashboard.kpiNetPayrollMonth')} value={money(payroll?.netSalary)} icon="💰" iconBg="var(--kpi-gold-soft)" iconColor="var(--kpi-gold)" />
          </KpiSlot>
          </Reveal>
        </Col>
      </Row>

      {/* ============ Section: Workforce Overview ============ */}
      <Reveal i={7}>
      <SectionLabel icon="📋">{t('dashboard.workforceOverview')}</SectionLabel>
      <Row className="g-3 mb-4">
        <Col lg={4}>
          <AttendanceTrendChart data={attendanceTrend} height={200} />
        </Col>

        <Col lg={4}>
          {leaveChartData.length > 0
            ? <DonutChart data={leaveChartData} title={t('dashboard.leaveRequestsThisYear')} centerLabel={t('dashboard.totalRequests')} height={220} />
            : <ChartPlaceholder title={t('dashboard.leaveRequestsThisYear')} note={t('dashboard.noLeaveRequests')} />}
        </Col>

        <Col lg={4}>
          {payrollStatusData.length > 0
            ? <DonutChart data={payrollStatusData} title={t('dashboard.payrollStatusThisMonth')} centerLabel={t('dashboard.payrollRuns')} height={220} />
            : <ChartPlaceholder title={t('dashboard.payrollStatusThisMonth')} note={t('dashboard.noPayrollRuns')} />}
        </Col>
      </Row>
      </Reveal>

      {/* ============ Two-column layout: main content + right rail ============ */}
      <Row className="g-3">
        {/* ---------------- Main column ---------------- */}
        <Col lg={8} className="d-flex flex-column mt-5">

          {/* ---- Trends & Attrition ---- */}
          <Reveal i={8}>
          <SectionLabel icon="📈">{t('dashboard.trendsAttrition')}</SectionLabel>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6}>
              <LineTrendChart
                data={workforce.trend}
                xKey="name"
                lineKey="value"
                title={t('dashboard.employeesTrend')}
              />
            </Col>
            <Col lg={4} md={6}>
              {workforce.attritionByDept.length > 0
                ? <DonutChart data={workforce.attritionByDept} title={t('dashboard.attritionByDept')} centerLabel={t('dashboard.totalAttrition')} />
                : <ChartPlaceholder title={t('dashboard.attritionByDept')} note={t('dashboard.noResigned')} />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.attritionByPosition.length > 0
                ? <HorizontalBarChart data={workforce.attritionByPosition} title={t('dashboard.attritionByJobRole')} />
                : <ChartPlaceholder title={t('dashboard.attritionByJobRole')} note={t('dashboard.noResigned')} />}
            </Col>
          </Row>
          </Reveal>

          {/* ---- Demographics ---- */}
          <Reveal i={9}>
          <SectionLabel icon="🧬">{t('dashboard.demographics')}</SectionLabel>
          <Row className="g-3 mb-4">
            <Col lg={4} md={6}>
              {workforce.ageGroups.some((d) => d.value > 0)
                ? <DonutChart data={workforce.ageGroups} title={t('dashboard.employeesByAgeGroup')} centerLabel={t('common.total', 'Total')} />
                : <ChartPlaceholder title={t('dashboard.employeesByAgeGroup')} note={t('dashboard.noDobData')} />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.gender.some((d) => d.value > 0)
                ? <DonutChart data={workforce.gender} title={t('dashboard.genderDiversity')} centerLabel={t('common.total', 'Total')} />
                : <ChartPlaceholder title={t('dashboard.genderDiversity')} note={t('dashboard.noGenderData')} />}
            </Col>
            <Col lg={4} md={6}>
              {workforce.tenure.some((d) => d.value > 0)
                ? <HorizontalBarChart data={workforce.tenure} title={t('dashboard.tenureDistribution')} />
                : <ChartPlaceholder title={t('dashboard.tenureDistribution')} note={t('dashboard.noHireDateData')} />}
            </Col>
          </Row>
          </Reveal>

          {/* ---- Top Departments by Headcount ---- */}
          <Reveal i={10}>
          <SectionLabel icon="🏆">{t('dashboard.topDepartments')}</SectionLabel>
          <div className="ent-card p-3 mb-4">
            {topDepartments.length === 0 ? (
              <ChartPlaceholder title="" note={t('dashboard.noHeadcountData')} />
            ) : (
              topDepartments.map((d) => (
                <div key={d.id} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{d.name}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>{d.employeeCount}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${maxDeptCount > 0 ? Math.round((d.employeeCount / maxDeptCount) * 100) : 0}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          </Reveal>

          {/* ---- Recruitment Pipeline + Training Completion ---- */}
          <Reveal i={11}>
          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="ent-card p-3 h-100">
                <SectionLabel icon="🧑‍💻">{t('dashboard.recruitmentPipeline')}</SectionLabel>
                {!recruitment ? (
                  <ChartPlaceholder title="" note={t('dashboard.noRecruitmentData')} />
                ) : (
                  <>
                    <PipelineStage label={t('dashboard.pipelineApplied')} value={recruitment.applied ?? 0} max={recruitmentMax} color="var(--chart-6)" />
                    <PipelineStage label={t('dashboard.pipelineScreening')} value={recruitment.screening ?? 0} max={recruitmentMax} color="var(--chart-1)" />
                    <PipelineStage label={t('dashboard.pipelineInterview')} value={recruitment.interview ?? 0} max={recruitmentMax} color="var(--chart-4)" />
                    <PipelineStage label={t('dashboard.pipelineOffer')} value={recruitment.offer ?? 0} max={recruitmentMax} color="var(--chart-5)" />
                    <PipelineStage label={t('dashboard.pipelineHired')} value={recruitment.hired ?? 0} max={recruitmentMax} color="var(--color-success)" />
                  </>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="ent-card p-3 h-100">
                <SectionLabel icon="🎓">{t('dashboard.trainingCompletion')}</SectionLabel>
                {trainingCompletion == null ? (
                  <ChartPlaceholder title="" note={t('dashboard.noTrainingData')} />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 py-3">
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {trainingCompletion}%
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                      {t('dashboard.trainingCompletionNote')}
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
          </Reveal>

          {/* ---- Key Insights ---- */}
          <Reveal i={12}>
          <SectionLabel icon="💡">{t('dashboard.keyInsights')}</SectionLabel>
          <Row className="g-3 mb-4">
            <Col md={6} lg={4}>
              <InsightCard icon="👥" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" accent="var(--color-primary)">
                {t('dashboard.insightHeadcountPrefix')} <strong>{summary?.totalEmployees ?? '—'}</strong> {t('dashboard.insightHeadcountMiddle')}{' '}
                <strong>{organization?.companies ?? '—'}</strong> {t('dashboard.insightHeadcountSuffix')}
              </InsightCard>
            </Col>
            <Col md={6} lg={4}>
              <InsightCard icon="🏬" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" accent="var(--color-warning)">
                <strong>{organization?.branches ?? '—'}</strong> {t('dashboard.insightBranchesMiddle')}{' '}
                <strong>{organization?.departments ?? '—'}</strong> {t('dashboard.insightBranchesSuffix')}
              </InsightCard>
            </Col>
            <Col md={6} lg={4}>
              <InsightCard icon="💰" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" accent="var(--color-success)">
                {t('dashboard.insightGrossSalaryPrefix')} <strong>{money(payroll?.grossSalary)}</strong>.
              </InsightCard>
            </Col>
          </Row>
          </Reveal>

          {/* ---- Recent Employees (admin/HR only) ---- */}
          {canViewEmployeeDirectory && (
            <>
              <Reveal i={13}>
              <SectionLabel icon="🧑‍💼">{t('dashboard.recentEmployees')}</SectionLabel>
              <div className="ent-card p-3 mb-4">
                <div className="d-flex justify-content-end align-items-center mb-2">
                  <span
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate('/employee')}
                  >
                    {t('common.viewAll')} →
                  </span>
                </div>

                {recentEmployees.length === 0 ? (
                  <div className="ent-empty" style={{ padding: '1.5rem' }}>
                    <div className="ent-empty-icon">👥</div>
                    <div className="small">{t('dashboard.noEmployeesYet')}</div>
                  </div>
                ) : (
                  <Table responsive className="ent-table ent-mini-table mb-0">
                    <thead>
                      <tr>
                        <th>{t('nav.employee')}</th>
                        <th>{t('nav.department')}</th>
                        <th>{t('dashboard.tablePosition')}</th>
                        <th>{t('dashboard.tableHireDate')}</th>
                        <th>{t('common.status')}</th>
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
              </Reveal>
            </>
          )}

          {/* ---- Recent Activity feed ---- */}
          <Reveal i={14}>
          <SectionLabel icon="🕘">{t('dashboard.recentActivity')}</SectionLabel>
          <div className="ent-card p-3 mb-4">
            {recentActivity.length === 0 ? (
              <WidgetEmpty note={t('dashboard.noActivity')} />
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
          </Reveal>
        </Col>

        {/* ---------------- Right rail ---------------- */}
        <Col lg={4} className="d-flex flex-column mt-5">

          {/* ---- Quick Actions ---- */}
          <Reveal i={7} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard title={t('dashboard.quickActions')} icon="⚡" accent="var(--color-primary)">
            <Row className="g-2">
              <Col xs={4}>
                <QuickActionButton icon="👤" label={t('dashboard.qaAddEmployee')} onClick={() => navigate('/employee')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="🗂️" label={t('dashboard.qaAddDepartment')} onClick={() => navigate('/department')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="💰" label={t('dashboard.qaRunPayroll')} onClick={() => navigate('/payroll')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="🌴" label={t('dashboard.qaLeaveRequests')} onClick={() => navigate('/leave')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="📊" label={t('nav.reports')} onClick={() => navigate('/reports')} />
              </Col>
              <Col xs={4}>
                <QuickActionButton icon="⚙️" label={t('nav.settings')} onClick={() => navigate('/settings/system-settings')} />
              </Col>
            </Row>
          </RailCard>
          </Reveal>

          {/* ---- Pending Approvals ---- */}
          <Reveal i={8} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard
            title={t('dashboard.pendingApprovals')}
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
              <WidgetEmpty note={t('dashboard.noApprovalsData')} />
            ) : (
              <>
                <ApprovalRow label={t('dashboard.approvalLeaveRequests')} count={pendingApprovals.leave} color="var(--kpi-teal)" />
                <ApprovalRow label={t('dashboard.approvalPayrollApprovals')} count={pendingApprovals.payroll} color="var(--kpi-gold)" />
                <ApprovalRow label={t('dashboard.approvalDocumentReviews')} count={pendingApprovals.documents} color="var(--kpi-purple)" />
                <ApprovalRow label={t('dashboard.approvalRecruitmentOffers')} count={pendingApprovals.recruitment} color="var(--kpi-pink)" />
              </>
            )}
          </RailCard>
          </Reveal>

          {/* ---- Upcoming Holidays ---- */}
          <Reveal i={9} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard title={t('dashboard.upcomingHolidays')} icon="📅" accent="var(--kpi-blue)">
            {upcomingHolidays.length === 0 ? (
              <WidgetEmpty note={t('dashboard.noHolidays')} />
            ) : (
              upcomingHolidays.slice(0, 5).map((h, i) => (
                <div key={i} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{h.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{formatDate(h.date)}</span>
                </div>
              ))
            )}
          </RailCard>
          </Reveal>

          {/* ---- Birthdays This Month ---- */}
          <Reveal i={10} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard title={t('dashboard.birthdaysThisMonth')} icon="🎂" accent="var(--kpi-pink)">
            {birthdays.length === 0 ? (
              <WidgetEmpty note={t('dashboard.noBirthdays')} />
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
          </Reveal>

          {/* ---- Announcements ---- */}
          <Reveal i={11} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard title={t('nav.announcements')} icon="📣" accent="var(--kpi-orange)">
            {announcements.length === 0 ? (
              <WidgetEmpty note={t('dashboard.noAnnouncements')} />
            ) : (
              announcements.slice(0, 4).map((a, i) => (
                <div key={i} className="py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{a.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(a.postedDate)}</div>
                </div>
              ))
            )}
          </RailCard>
          </Reveal>

          {/* ---- Compliance Alerts ---- */}
          <Reveal i={12} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <RailCard title={t('dashboard.complianceAlerts')} icon="⚠️" accent="var(--color-danger)">
            {complianceAlerts.length === 0 ? (
              <WidgetEmpty note={t('dashboard.noComplianceAlerts')} />
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
          </Reveal>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;