import { useEffect, useState } from 'react';
import { Tabs, Tab, Table, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { salaryStructureService, employeeSalaryService, payrollService } from '../../services/payroll.service';
import { employeeService } from '../../services/employee.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import SalaryStructureFormModal from './SalaryStructureFormModal';
import AssignSalaryModal from './AssignSalaryModal';
import GeneratePayrollModal from './GeneratePayrollModal';

function money(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function PayrollManagementPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = useHasPermission('PAYROLL_CREATE');
  const canApprove = useHasPermission('PAYROLL_APPROVE');
  const canPay = useHasPermission('PAYROLL_PAY');

  const [payrolls, setPayrolls] = useState([]);
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [structFormShow, setStructFormShow] = useState(false);
  const [structSubmitting, setStructSubmitting] = useState(false);

  const [assignShow, setAssignShow] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const [generateShow, setGenerateShow] = useState(false);
  const [generateSubmitting, setGenerateSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      payrollService.list(),
      salaryStructureService.list(),
      employeeService.list({ page: 0, size: 200 }),
    ]).then(([p, s, empPage]) => {
      setPayrolls(p);
      setStructures(s);
      setEmployees(empPage.content || []);
    }).catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStructSubmit = async (values) => {
    setStructSubmitting(true);
    try {
      await salaryStructureService.create(values);
      showToast('បង្កើត Salary Structure ជោគជ័យ', 'success');
      setStructFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setStructSubmitting(false);
    }
  };

  const handleAssignSubmit = async (values) => {
    setAssignSubmitting(true);
    try {
      await employeeSalaryService.assign(values.employeeId, {
        salaryStructureId: Number(values.salaryStructureId),
        effectiveDate: values.effectiveDate,
        endDate: values.endDate || null,
      });
      showToast('ភ្ជាប់ Salary Structure ជោគជ័យ', 'success');
      setAssignShow(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleGenerateSubmit = async (values) => {
    setGenerateSubmitting(true);
    try {
      await payrollService.generate({ employeeId: Number(values.employeeId), year: Number(values.year), month: Number(values.month) });
      showToast('Generate payroll ជោគជ័យ', 'success');
      setGenerateShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាច generate បានទេ (ត្រូវប្រាកដថា employee មាន salary structure ភ្ជាប់ស្រាប់)', 'danger');
    } finally {
      setGenerateSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await payrollService.approve(id);
      showToast('Approve payroll ជោគជ័យ', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាច approve បានទេ', 'danger');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await payrollService.markPaid(id);
      showToast('កត់ត្រា Paid ជោគជ័យ', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    }
  };

  const statusChartData = ['DRAFT', 'CALCULATED', 'APPROVED', 'PAID']
    .map((s) => ({ name: s, value: payrolls.filter((p) => p.status === s).length }))
    .filter((d) => d.value > 0);

  const totalNet = payrolls.reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div className="ent-page-title">Payroll</div>
        {canManage && (
          <div className="d-flex gap-2">
            <Button variant="light" onClick={() => setStructFormShow(true)}>+ Salary Structure</Button>
            <Button variant="light" onClick={() => setAssignShow(true)}>Assign to Employee</Button>
            <Button className="ent-btn-primary" onClick={() => setGenerateShow(true)}>+ Generate Payroll</Button>
          </div>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}><TrendStatCard label="Total Payroll Runs" value={payrolls.length} icon="💰" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></Col>
        <Col md={3}><TrendStatCard label="Approved" value={payrolls.filter((p) => p.status === 'APPROVED').length} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></Col>
        <Col md={3}><TrendStatCard label="Paid" value={payrolls.filter((p) => p.status === 'PAID').length} icon="🏦" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></Col>
        <Col md={3}><TrendStatCard label="Total Net (all)" value={money(totalNet)} icon="💵" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" /></Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={statusChartData} title="Payroll Status" centerLabel="Total" height={200} />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">Salary Structures</div>
            {structures.length === 0 ? (
              <div className="text-muted small">No salary structures yet. Click "+ Salary Structure" to add one.</div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead><tr><th>Name</th><th>Basic</th><th>Housing</th><th>Transport</th><th>Meal</th></tr></thead>
                <tbody>
                  {structures.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{money(s.basicSalary)}</td>
                      <td>{money(s.housingAllowance)}</td>
                      <td>{money(s.transportAllowance)}</td>
                      <td>{money(s.mealAllowance)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>

      <div className="ent-card p-3">
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-3">Payroll Runs</div>
        {payrolls.length === 0 ? (
          <div className="ent-empty"><div className="ent-empty-icon">💰</div><div style={{ fontWeight: 600 }}>No payroll runs yet</div></div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead><tr><th>Employee</th><th>Period</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th style={{ width: 90 }}></th></tr></thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.employeeName}</div>
                    <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{p.employeeCode}</div>
                  </td>
                  <td>{new Date(0, p.month - 1).toLocaleString('en', { month: 'short' })} {p.year}</td>
                  <td>{money(p.grossSalary)}</td>
                  <td>{money(p.totalDeduction)}</td>
                  <td style={{ fontWeight: 600 }}>{money(p.netSalary)}</td>
                  <td>
                    <span className={`ent-pill ${p.status === 'PAID' ? 'ent-pill-success' : p.status === 'APPROVED' ? 'ent-pill-warning' : 'ent-pill-neutral'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <Dropdown align="end">
                      <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/payroll/payslip/${p.id}`)}>View Payslip</Dropdown.Item>
                        {canApprove && p.status === 'CALCULATED' && <Dropdown.Item onClick={() => handleApprove(p.id)}>Approve</Dropdown.Item>}
                        {canPay && p.status === 'APPROVED' && <Dropdown.Item onClick={() => handleMarkPaid(p.id)}>Mark Paid</Dropdown.Item>}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <SalaryStructureFormModal show={structFormShow} submitting={structSubmitting} onClose={() => setStructFormShow(false)} onSubmit={handleStructSubmit} />
      <AssignSalaryModal show={assignShow} employees={employees} structures={structures} submitting={assignSubmitting} onClose={() => setAssignShow(false)} onSubmit={handleAssignSubmit} />
      <GeneratePayrollModal show={generateShow} employees={employees} submitting={generateSubmitting} onClose={() => setGenerateShow(false)} onSubmit={handleGenerateSubmit} />
    </div>
  );
}

export default PayrollManagementPage;