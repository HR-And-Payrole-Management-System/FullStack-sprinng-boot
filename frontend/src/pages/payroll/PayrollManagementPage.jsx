import { useEffect, useState } from 'react';
import { Tabs, Tab, Table, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  CheckCircle2,
  Landmark,
  DollarSign,
  Eye,
  ThumbsUp,
  BadgeCheck,
  MoreVertical,
  Inbox,
  Zap,
} from 'lucide-react';

import { salaryStructureService, employeeSalaryService, payrollService } from '../../services/payroll.service';
import { employeeService } from '../../services/employee.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import SalaryStructureFormModal from './SalaryStructureFormModal';
import AssignSalaryModal from './AssignSalaryModal';
import GeneratePayrollModal from './GeneratePayrollModal';
import GenerateBatchModal from './GenerateBatchModal';

function money(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

const STATUS_DOT = {
  DRAFT: 'var(--color-text-subtle)',
  CALCULATED: 'var(--color-info)',
  APPROVED: 'var(--color-warning)',
  PAID: 'var(--color-success)',
};

function StatusPill({ status }) {
  const cls =
    status === 'PAID' ? 'ent-pill-success' : status === 'APPROVED' ? 'ent-pill-warning' : 'ent-pill-neutral';
  return (
    <span className={`ent-pill ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: STATUS_DOT[status] || 'var(--color-text-subtle)',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
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

  const [batchShow, setBatchShow] = useState(false);
  const [batchSubmitting, setBatchSubmitting] = useState(false);

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

  const handleBatchSubmit = async (values) => {
    setBatchSubmitting(true);
    try {
      const created = await payrollService.generateBatch(Number(values.year), Number(values.month));
      showToast(`បង្កើត Payroll ជោគជ័យសម្រាប់ ${created} នាក់`, 'success');
      setBatchShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាច generate batch បានទេ', 'danger');
    } finally {
      setBatchSubmitting(false);
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
            <Button className="ent-btn-secondary" onClick={() => setStructFormShow(true)}>+ Salary Structure</Button>
            <Button className="ent-btn-secondary" onClick={() => setAssignShow(true)}>Assign to Employee</Button>
            <Button className="ent-btn-primary" onClick={() => setGenerateShow(true)}>+ Generate Payroll</Button>
            <Button className="ent-btn-secondary" onClick={() => setBatchShow(true)}>
              <Zap size={14} strokeWidth={2} className="me-1" />
              Generate for All
            </Button>
          </div>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <TrendStatCard
            label="Total Payroll Runs"
            value={payrolls.length}
            icon={<Wallet size={20} strokeWidth={2} />}
            iconBg="var(--color-primary-soft)"
            iconColor="var(--color-primary)"
          />
        </Col>
        <Col md={3}>
          <TrendStatCard
            label="Approved"
            value={payrolls.filter((p) => p.status === 'APPROVED').length}
            icon={<CheckCircle2 size={20} strokeWidth={2} />}
            iconBg="var(--color-success-soft)"
            iconColor="var(--color-success)"
          />
        </Col>
        <Col md={3}>
          <TrendStatCard
            label="Paid"
            value={payrolls.filter((p) => p.status === 'PAID').length}
            icon={<Landmark size={20} strokeWidth={2} />}
            iconBg="var(--color-warning-soft)"
            iconColor="var(--color-warning)"
          />
        </Col>
        <Col md={3}>
          <TrendStatCard
            label="Total Net (all)"
            value={money(totalNet)}
            icon={<DollarSign size={20} strokeWidth={2} />}
            iconBg="var(--color-danger-soft)"
            iconColor="var(--color-danger)"
          />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={statusChartData} title="Payroll Status" centerLabel="Total" height={200} />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }} className="mb-2">
              Salary Structures
            </div>
            {structures.length === 0 ? (
              <div className="text-muted small">No salary structures yet. Click "+ Salary Structure" to add one.</div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead><tr><th>Name</th><th>Basic</th><th>Housing</th><th>Transport</th><th>Meal</th></tr></thead>
                <tbody>
                  {structures.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{s.name}</td>
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
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }} className="mb-3">
          Payroll Runs
        </div>
        {payrolls.length === 0 ? (
          <div className="ent-empty">
            <div className="ent-empty-icon">
              <Inbox size={26} strokeWidth={1.75} />
            </div>
            <div style={{ fontWeight: 600 }}>No payroll runs yet</div>
          </div>
        ) : (
          <Table responsive className="ent-table mb-0">
            <thead><tr><th>Employee</th><th>Period</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th style={{ width: 90 }}></th></tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{p.employeeName}</div>
                    <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{p.employeeCode}</div>
                  </td>
                  <td>{new Date(0, p.month - 1).toLocaleString('en', { month: 'short' })} {p.year}</td>
                  <td>{money(p.grossSalary)}</td>
                  <td>{money(p.totalDeduction)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{money(p.netSalary)}</td>
                  <td>
                    <StatusPill status={p.status} />
                  </td>
                  <td className="text-end">
                    <Dropdown align="end">
                      <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                      <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                        <Dropdown.Item onClick={() => navigate(`/payroll/payslip/${p.id}`)} className="d-flex align-items-center gap-2">
                          <Eye size={14} strokeWidth={2} /> View Payslip
                        </Dropdown.Item>
                        {canApprove && p.status === 'CALCULATED' && (
                          <Dropdown.Item onClick={() => handleApprove(p.id)} className="d-flex align-items-center gap-2">
                            <ThumbsUp size={14} strokeWidth={2} /> Approve
                          </Dropdown.Item>
                        )}
                        {canPay && p.status === 'APPROVED' && (
                          <Dropdown.Item onClick={() => handleMarkPaid(p.id)} className="d-flex align-items-center gap-2">
                            <BadgeCheck size={14} strokeWidth={2} /> Mark Paid
                          </Dropdown.Item>
                        )}
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
      <GenerateBatchModal show={batchShow} submitting={batchSubmitting} onClose={() => setBatchShow(false)} onSubmit={handleBatchSubmit} />
    </div>
  );
}

export default PayrollManagementPage;