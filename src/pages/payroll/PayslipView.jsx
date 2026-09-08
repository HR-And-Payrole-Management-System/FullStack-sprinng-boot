import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';

import { payslipService } from '../../services/payroll.service';
import LoadingSpinner from '../../components/LoadingSpinner';

function money(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function Row2({ label, value, strong }) {
  return (
    <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{label}</span>
      <span style={{ fontWeight: strong ? 700 : 600, fontSize: strong ? 'var(--text-lg)' : 'var(--text-sm)' }}>{value}</span>
    </div>
  );
}

function PayslipView() {
  const { payrollId } = useParams();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payslipService.get(payrollId).then(setPayslip).finally(() => setLoading(false));
  }, [payrollId]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!payslip) return <div className="ent-empty">Payslip not found</div>;

  return (
    <div>
      <div className="ent-toolbar">
        <div className="ent-page-title">Payslip</div>
        <div className="d-flex gap-2">
          <Button variant="light" onClick={() => navigate('/payroll')}>Back</Button>
          <Button className="ent-btn-primary" onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      <div className="ent-card p-4 mx-auto" style={{ maxWidth: 600 }}>
        <div className="text-center mb-4">
          <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>{payslip.employeeName}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {payslip.employeeCode} · {new Date(0, payslip.month - 1).toLocaleString('en', { month: 'long' })} {payslip.year}
          </div>
          <span className={`ent-pill ${payslip.status === 'PAID' ? 'ent-pill-success' : 'ent-pill-neutral'} mt-2`}>{payslip.status}</span>
        </div>

        <Row>
          <Col md={6}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">Earnings</div>
            <Row2 label="Basic Salary" value={money(payslip.basicSalary)} />
            <Row2 label="Allowance" value={money(payslip.allowance)} />
            <Row2 label="Overtime Pay" value={money(payslip.overtimePay)} />
            <Row2 label="Gross Salary" value={money(payslip.grossSalary)} strong />
          </Col>
          <Col md={6}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }} className="mb-2">Deductions</div>
            <Row2 label="Tax" value={money(payslip.tax)} />
            <Row2 label="Employee Contribution" value={money(payslip.employeeContribution)} />
            <Row2 label="Other Deduction" value={money(payslip.otherDeduction)} />
            <Row2 label="Employer Contribution" value={money(payslip.employerContribution)} />
          </Col>
        </Row>

        <div className="mt-3 pt-3" style={{ borderTop: '2px solid var(--color-text)' }}>
          <Row2 label="NET SALARY" value={money(payslip.netSalary)} strong />
        </div>
      </div>
    </div>
  );
}

export default PayslipView;