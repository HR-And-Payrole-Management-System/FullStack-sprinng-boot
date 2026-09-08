import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

import { reportService } from '../../services/report.service';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportCsv';

import LoadingSpinner from '../../components/LoadingSpinner';
import DonutChart from '../../components/charts/DonutChart';

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

function AttendanceReportTab() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    reportService
      .attendance(startDate, endDate)
      .then(setRows)
      .catch(() => showToast('មិនអាចទាញយក Report បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [startDate, endDate]);

  const statusChartData = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY', 'WEEKEND']
    .map((s) => ({ name: s, value: rows.filter((r) => r.status === s).length }))
    .filter((d) => d.value > 0);

  const handleExport = () => {
    if (rows.length === 0) return;
    exportToCsv(
      `attendance-report-${startDate}_${endDate}.csv`,
      rows.map((r) => ({
        Code: r.employeeCode,
        Name: r.employeeName,
        Date: r.workDate,
        Status: r.status,
        CheckIn: r.checkInTime,
        CheckOut: r.checkOutTime,
        WorkedMinutes: r.workedMinutes,
        LateMinutes: r.lateMinutes,
        OvertimeMinutes: r.overtimeMinutes,
      }))
    );
  };

  return (
    <div className="pt-2">
      <Row className="g-3 mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">From</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">To</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex justify-content-end gap-2">
          <Button variant="light" onClick={() => window.print()}>Print</Button>
          <Button className="ent-btn-primary" onClick={handleExport} disabled={rows.length === 0}>
            Export CSV
          </Button>
        </Col>
      </Row>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row className="g-3 mb-3">
            <Col md={4}>
              <DonutChart data={statusChartData} title="Status Breakdown" centerLabel="Total" height={200} />
            </Col>
            <Col md={8}>
              <div className="ent-card p-3 h-100 d-flex align-items-center justify-content-center">
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{rows.length}</div>
                <div className="ms-2" style={{ color: 'var(--color-text-muted)' }}>Records in this range</div>
              </div>
            </Col>
          </Row>

          <div className="ent-card p-3">
            {rows.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🕒</div>
                <div style={{ fontWeight: 600 }}>No data found</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th><th>Date</th><th>Check-in</th><th>Check-out</th>
                    <th>Worked</th><th>Late</th><th>OT</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.employeeName}</div>
                        <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{r.employeeCode}</div>
                      </td>
                      <td>{r.workDate}</td>
                      <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td>{r.workedMinutes != null ? `${Math.round(r.workedMinutes / 60)}h ${r.workedMinutes % 60}m` : '—'}</td>
                      <td>{r.lateMinutes ? `${r.lateMinutes}m` : '—'}</td>
                      <td>{r.overtimeMinutes ? `${r.overtimeMinutes}m` : '—'}</td>
                      <td>
                        <span className={`ent-pill ${r.status === 'PRESENT' ? 'ent-pill-success' : r.status === 'LATE' ? 'ent-pill-warning' : r.status === 'ABSENT' ? 'ent-pill-danger' : 'ent-pill-neutral'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceReportTab;