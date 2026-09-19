import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

import { reportService } from '../../services/report.service';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportCsv';

import LoadingSpinner from '../../components/LoadingSpinner';

function money(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function PayrollReportTab() {
  const { showToast } = useToast();
  const now = new Date();
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reportService
      .payroll(year, month)
      .then(setRows)
      .catch(() => showToast('មិនអាចទាញយក Report បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [year, month]);

  const totals = rows.reduce(
    (acc, r) => ({
      basic: acc.basic + (Number(r.basicSalary) || 0),
      gross: acc.gross + (Number(r.grossSalary) || 0),
      deduction: acc.deduction + (Number(r.totalDeduction) || 0),
      net: acc.net + (Number(r.netSalary) || 0),
    }),
    { basic: 0, gross: 0, deduction: 0, net: 0 }
  );

  const handleExport = () => {
    if (rows.length === 0) return;
    exportToCsv(
      `payroll-report-${year}-${month}.csv`,
      rows.map((r) => ({
        Code: r.employeeCode,
        Name: r.employeeName,
        Year: r.year,
        Month: r.month,
        BasicSalary: r.basicSalary,
        TotalAllowance: r.totalAllowance,
        OvertimePay: r.overtimePay,
        TaxAmount: r.taxAmount,
        TotalDeduction: r.totalDeduction,
        GrossSalary: r.grossSalary,
        NetSalary: r.netSalary,
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
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Month</Form.Label>
            <Form.Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
              ))}
            </Form.Select>
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
            <Col md={3}><div className="ent-card p-3 text-center"><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total Basic</div><div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{money(totals.basic)}</div></div></Col>
            <Col md={3}><div className="ent-card p-3 text-center"><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total Gross</div><div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{money(totals.gross)}</div></div></Col>
            <Col md={3}><div className="ent-card p-3 text-center"><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total Deduction</div><div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{money(totals.deduction)}</div></div></Col>
            <Col md={3}><div className="ent-card p-3 text-center" style={{ borderColor: 'var(--color-primary)' }}><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total Net</div><div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>{money(totals.net)}</div></div></Col>
          </Row>

          <div className="ent-card p-3">
            {rows.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">💰</div>
                <div style={{ fontWeight: 600 }}>No data found</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th><th>Basic</th><th>Allowance</th><th>OT Pay</th>
                    <th>Tax</th><th>Deduction</th><th>Gross</th><th>Net</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.employeeName}</div>
                        <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{r.employeeCode}</div>
                      </td>
                      <td>{money(r.basicSalary)}</td>
                      <td>{money(r.totalAllowance)}</td>
                      <td>{money(r.overtimePay)}</td>
                      <td>{money(r.taxAmount)}</td>
                      <td>{money(r.totalDeduction)}</td>
                      <td>{money(r.grossSalary)}</td>
                      <td style={{ fontWeight: 600 }}>{money(r.netSalary)}</td>
                      <td>
                        <span className={`ent-pill ${r.status === 'PAID' ? 'ent-pill-success' : r.status === 'APPROVED' ? 'ent-pill-warning' : 'ent-pill-neutral'}`}>
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

export default PayrollReportTab;