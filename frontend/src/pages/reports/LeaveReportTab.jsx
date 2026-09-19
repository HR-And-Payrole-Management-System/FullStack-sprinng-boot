import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

import { reportService } from '../../services/report.service';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportCsv';

import LoadingSpinner from '../../components/LoadingSpinner';
import DonutChart from '../../components/charts/DonutChart';

function LeaveReportTab() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reportService
      .leaves(year)
      .then(setRows)
      .catch(() => showToast('មិនអាចទាញយក Report បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [year]);

  const statusChartData = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
    .map((s) => ({ name: s, value: rows.filter((r) => r.status === s).length }))
    .filter((d) => d.value > 0);

  const handleExport = () => {
    if (rows.length === 0) return;
    exportToCsv(
      `leave-report-${year}.csv`,
      rows.map((r) => ({
        Code: r.employeeCode,
        Name: r.employeeName,
        LeaveType: r.leaveTypeName,
        StartDate: r.startDate,
        EndDate: r.endDate,
        TotalDays: r.totalDays,
        Status: r.status,
      }))
    );
  };

  return (
    <div className="pt-2">
      <Row className="g-3 mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Year</Form.Label>
            <Form.Control type="number" min={2000} value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={9} className="d-flex justify-content-end gap-2">
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
              <DonutChart data={statusChartData} title="Leave Status" centerLabel="Total" height={200} />
            </Col>
            <Col md={8}>
              <div className="ent-card p-3 h-100 d-flex align-items-center justify-content-center">
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{rows.length}</div>
                <div className="ms-2" style={{ color: 'var(--color-text-muted)' }}>Requests in {year}</div>
              </div>
            </Col>
          </Row>

          <div className="ent-card p-3">
            {rows.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🌴</div>
                <div style={{ fontWeight: 600 }}>No data found</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th><th>Leave Type</th><th>Start</th><th>End</th><th>Days</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.employeeName}</div>
                        <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{r.employeeCode}</div>
                      </td>
                      <td>{r.leaveTypeName}</td>
                      <td>{r.startDate}</td>
                      <td>{r.endDate}</td>
                      <td>{r.totalDays}</td>
                      <td>
                        <span className={`ent-pill ${r.status === 'APPROVED' ? 'ent-pill-success' : r.status === 'REJECTED' ? 'ent-pill-danger' : r.status === 'PENDING' ? 'ent-pill-warning' : 'ent-pill-neutral'}`}>
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

export default LeaveReportTab;