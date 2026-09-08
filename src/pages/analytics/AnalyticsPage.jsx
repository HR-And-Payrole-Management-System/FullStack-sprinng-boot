import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { analyticsService } from '../../services/analytics.service';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function AnalyticsPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);
  const [days, setDays] = useState(14);

  const [payrollTrend, setPayrollTrend] = useState([]);
  const [payrollByDept, setPayrollByDept] = useState([]);
  const [leaveByType, setLeaveByType] = useState([]);
  const [leaveByDept, setLeaveByDept] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [funnel, setFunnel] = useState([]);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      analyticsService.payrollCostTrend(months),
      analyticsService.payrollCostByDepartment(),
      analyticsService.leaveUtilizationByType(),
      analyticsService.leaveUtilizationByDepartment(),
      analyticsService.attendanceTrend(days),
      analyticsService.recruitmentFunnel(),
    ])
      .then(([pt, pd, lt, ld, at, fn]) => {
        setPayrollTrend(pt.map((p) => ({ ...p, value: Math.round(p.value) })));
        setPayrollByDept(pd.map((p) => ({ ...p, value: Math.round(p.value) })));
        setLeaveByType(lt);
        setLeaveByDept(ld);
        setAttendanceTrend(at);
        setFunnel(fn);
      })
      .catch(() => showToast('Unable to load analytics data.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, [months, days]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Analytics</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Cross-module trends across payroll, leave, attendance, and recruitment
          </div>
        </div>
      </div>

      <Row className="g-3 mb-3">
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Payroll Cost Trend</div>
              <Form.Select
                size="sm"
                style={{ width: '140px' }}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
              </Form.Select>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={payrollTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="value" name="Net Salary" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col md={4}>
          <HorizontalBarChart data={funnel} title="Recruitment Funnel" height={260} />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <HorizontalBarChart data={payrollByDept} title="Payroll Cost by Department (This Year)" />
        </Col>
        <Col md={6}>
          <HorizontalBarChart data={leaveByType} title="Leave Days Utilized by Type" singleColor="var(--chart-2)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <HorizontalBarChart data={leaveByDept} title="Leave Days Utilized by Department" singleColor="var(--chart-3)" />
        </Col>
        <Col md={6}>
          <div className="ent-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Attendance Trend</div>
              <Form.Select
                size="sm"
                style={{ width: '140px' }}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </Form.Select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="present" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="late" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="absent" stroke="var(--color-danger)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AnalyticsPage;