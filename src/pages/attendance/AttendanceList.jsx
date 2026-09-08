import { useEffect, useState } from 'react';
import { Table, Row, Col, Pagination, Dropdown } from 'react-bootstrap';

import { attendanceService } from '../../services/attendance.service';
import { departmentService } from '../../services/department.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import FilterBar from '../../components/charts/FilterBar';
import CheckInOutWidget from './CheckInOutWidget';
import AdjustAttendanceModal from './AdjustAttendanceModal';

const STATUS_OPTIONS = ['All', 'PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY', 'WEEKEND'];

function fmtTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AttendanceList() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const canAdjust = useHasPermission('ATTENDANCE_ADJUST');

  const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0, page: 0 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ status: 'All', startDate: '', endDate: '' });
  const [page, setPage] = useState(0);

  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    attendanceService
      .search({
        page, size: 10,
        status: filters.status !== 'All' ? filters.status : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      })
      .then(setPageData)
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { departmentService.list().then(setDepartments).catch(() => {}); }, []);
  useEffect(load, [page, filters]);

  const handleAdjust = async (values) => {
    setAdjustSubmitting(true);
    try {
      await attendanceService.adjust(adjustTarget.id, {
        checkInTime: values.checkInTime ? `${values.checkInTime}:00` : null,
        checkOutTime: values.checkOutTime ? `${values.checkOutTime}:00` : null,
        reason: values.reason,
      });
      showToast('កែសម្រួល attendance ជោគជ័យ', 'success');
      setAdjustTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចកែសម្រួលបានទេ', 'danger');
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const statusChartData = STATUS_OPTIONS.slice(1).map((s) => ({
    name: s,
    value: pageData.content.filter((a) => a.status === s).length,
  })).filter((d) => d.value > 0);

  const presentCount = pageData.content.filter((a) => a.status === 'PRESENT').length;
  const lateCount = pageData.content.filter((a) => a.status === 'LATE').length;
  const absentCount = pageData.content.filter((a) => a.status === 'ABSENT').length;

  if (loading && pageData.content.length === 0) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-page-title mb-3">Attendance</div>

      <div className="mb-3">
        <CheckInOutWidget onDone={load} />
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}><TrendStatCard label="Total Records" value={pageData.totalElements} icon="🕒" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></Col>
        <Col md={3}><TrendStatCard label="Present (this page)" value={presentCount} icon="🟢" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></Col>
        <Col md={3}><TrendStatCard label="Late (this page)" value={lateCount} icon="🟡" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></Col>
        <Col md={3}><TrendStatCard label="Absent (this page)" value={absentCount} icon="🔴" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" /></Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={statusChartData} title="Status Breakdown (this page)" centerLabel="Shown" height={200} />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <FilterBar
              filters={[
                { key: 'status', type: 'select', label: 'Status', options: STATUS_OPTIONS },
                { key: 'startDate', type: 'date', label: 'From' },
                { key: 'endDate', type: 'date', label: 'To' },
              ]}
              values={filters}
              onChange={(key, val) => { setPage(0); setFilters((f) => ({ ...f, [key]: val })); }}
            />
          </div>
        </Col>
      </Row>

      <div className="ent-card p-3">
        {pageData.content.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">🕒</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No attendance records found</div>
            <div className="small">Adjust filters, or check in to create your first record.</div>
          </div>
        ) : (
          <>
            <Table responsive className="ent-table mb-3">
              <thead>
                <tr>
                  <th>Employee</th><th>Date</th><th>Check-in</th><th>Check-out</th>
                  <th>Worked</th><th>Late</th><th>OT</th><th>Status</th>
                  {canAdjust && <th style={{ width: 60 }}></th>}
                </tr>
              </thead>
              <tbody>
                {pageData.content.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.employeeName}</div>
                      <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{a.employeeCode}</div>
                    </td>
                    <td>{a.workDate}</td>
                    <td>{fmtTime(a.checkInTime)}</td>
                    <td>{fmtTime(a.checkOutTime)}</td>
                    <td>{a.workedMinutes != null ? `${Math.round(a.workedMinutes / 60)}h ${a.workedMinutes % 60}m` : '—'}</td>
                    <td>{a.lateMinutes ? `${a.lateMinutes}m` : '—'}</td>
                    <td>{a.overtimeMinutes ? `${a.overtimeMinutes}m` : '—'}</td>
                    <td>
                      <span className={`ent-pill ${a.status === 'PRESENT' ? 'ent-pill-success' : a.status === 'LATE' ? 'ent-pill-warning' : a.status === 'ABSENT' ? 'ent-pill-danger' : 'ent-pill-neutral'}`}>
                        {a.status}
                      </span>
                    </td>
                    {canAdjust && (
                      <td className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setAdjustTarget(a)}>Adjust</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="justify-content-end mb-0">
              <Pagination.Prev disabled={pageData.page === 0} onClick={() => setPage((p) => p - 1)} />
              {Array.from({ length: pageData.totalPages }).map((_, i) => (
                <Pagination.Item key={i} active={i === pageData.page} onClick={() => setPage(i)}>{i + 1}</Pagination.Item>
              ))}
              <Pagination.Next disabled={pageData.page >= pageData.totalPages - 1} onClick={() => setPage((p) => p + 1)} />
            </Pagination>
          </>
        )}
      </div>

      <AdjustAttendanceModal
        show={!!adjustTarget}
        record={adjustTarget}
        submitting={adjustSubmitting}
        onClose={() => setAdjustTarget(null)}
        onSubmit={handleAdjust}
      />
    </div>
  );
}

export default AttendanceList;