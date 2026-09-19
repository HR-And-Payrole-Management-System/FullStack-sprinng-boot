import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';

import { reportService } from '../../services/report.service';
import { departmentService } from '../../services/department.service';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportCsv';

import LoadingSpinner from '../../components/LoadingSpinner';
import DonutChart from '../../components/charts/DonutChart';

function EmployeeReportTab() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reportService
      .employees(departmentId || undefined)
      .then(setRows)
      .catch(() => showToast('មិនអាចទាញយក Report បានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  }, []);

  useEffect(load, [departmentId]);

  const statusChartData = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED', 'TERMINATED']
    .map((s) => ({ name: s, value: rows.filter((r) => r.status === s).length }))
    .filter((d) => d.value > 0);

  const handleExport = () => {
    if (rows.length === 0) return;
    exportToCsv(
      `employee-report-${Date.now()}.csv`,
      rows.map((r) => ({
        Code: r.employeeCode,
        Name: r.fullName,
        Email: r.email,
        Company: r.companyName,
        Branch: r.branchName,
        Department: r.departmentName,
        Position: r.positionName,
        Status: r.status,
        HireDate: r.hireDate,
      }))
    );
  };

  return (
    <div className="pt-2">
      <Row className="g-3 mb-3 align-items-end">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Filter by Department</Form.Label>
            <Form.Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              <option value="">-- All Departments --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8} className="d-flex justify-content-end gap-2">
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
              <DonutChart data={statusChartData} title="Employees by Status" centerLabel="Total" height={200} />
            </Col>
            <Col md={8}>
              <div className="ent-card p-3 h-100 d-flex align-items-center justify-content-center">
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{rows.length}</div>
                <div className="ms-2" style={{ color: 'var(--color-text-muted)' }}>Total employees matching filter</div>
              </div>
            </Col>
          </Row>

          <div className="ent-card p-3">
            {rows.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">👥</div>
                <div style={{ fontWeight: 600 }}>No data found</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Code</th><th>Name</th><th>Email</th><th>Company</th>
                    <th>Branch</th><th>Department</th><th>Position</th>
                    <th>Status</th><th>Hire Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.employeeCode}</td>
                      <td style={{ fontWeight: 600 }}>{r.fullName}</td>
                      <td>{r.email}</td>
                      <td>{r.companyName || '—'}</td>
                      <td>{r.branchName || '—'}</td>
                      <td>{r.departmentName || '—'}</td>
                      <td>{r.positionName || '—'}</td>
                      <td>
                        <span className={`ent-pill ${r.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>{r.status}</span>
                      </td>
                      <td>{r.hireDate}</td>
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

export default EmployeeReportTab;