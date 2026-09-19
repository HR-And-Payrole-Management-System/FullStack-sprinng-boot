import { useEffect, useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { benefitApi } from '../../api/benefit.api';
import { employeeApi } from '../../api/employee.api';
import BenefitRuleFormModal from './BenefitRuleFormModal';
import { Form } from 'react-bootstrap';

const TYPE_BADGE = {
  EMPLOYER_CONTRIBUTION: 'success',
  EMPLOYEE_DEDUCTION: 'danger',
  ALLOWANCE: 'info',
};

export default function BenefitsPage() {
  const [rules, setRules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [showRuleModal, setShowRuleModal] = useState(false);

  const loadRules = () => benefitApi.getRules().then((res) => setRules(res.data));
  const loadEnrollments = (employeeId) => {
    if (!employeeId) { setEnrollments([]); return; }
    benefitApi.getByEmployee(employeeId).then((res) => setEnrollments(res.data));
  };

  useEffect(() => {
    loadRules();
    employeeApi.getAll({ page: 0, size: 1000 }).then((res) => setEmployees(res.data.content));
  }, []);

  useEffect(() => { loadEnrollments(selectedEmployeeId); }, [selectedEmployeeId]);

  const enrollmentFor = (ruleId) => enrollments.find((e) => e.benefitRuleId === ruleId);

  const toggleEnrollment = async (rule) => {
    const existing = enrollmentFor(rule.id);
    if (existing && existing.status === 'ENROLLED') {
      await benefitApi.waive(existing.id);
    } else {
      await benefitApi.enroll({
        employeeId: Number(selectedEmployeeId),
        benefitRuleId: rule.id,
        effectiveDate: new Date().toISOString().slice(0, 10),
      });
    }
    loadEnrollments(selectedEmployeeId);
  };

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="ent-page-title">Benefits</div>
        <Button variant="primary" size="sm" onClick={() => setShowRuleModal(true)}>+ New Benefit Rule</Button>
      </div>

      <div className="ent-card p-3 mb-4">
        <Form.Label className="small fw-semibold">Manage enrollment for</Form.Label>
        <select
          className="form-select"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
        >
          <option value="">-- Select Employee --</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>

      <Table hover className="ent-table">
        <thead>
          <tr><th>Rule</th><th>Type</th><th>Amount</th><th>Status</th><th style={{ width: 140 }}></th></tr>
        </thead>
        <tbody>
          {rules.map((r) => {
            const enrollment = enrollmentFor(r.id);
            const isEnrolled = enrollment?.status === 'ENROLLED';
            return (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td><Badge bg={TYPE_BADGE[r.type]}>{r.type.replace('_', ' ')}</Badge></td>
                <td>{r.percentage ? `${r.percentage}%` : ''} {r.fixedAmount ? `$${r.fixedAmount}` : ''}</td>
                <td>{enrollment ? (isEnrolled ? <Badge bg="success">Enrolled</Badge> : <Badge bg="secondary">Waived</Badge>) : <Badge bg="light" text="dark">Not enrolled</Badge>}</td>
                <td>
                  <Button
                    size="sm"
                    variant={isEnrolled ? 'outline-danger' : 'outline-success'}
                    disabled={!selectedEmployeeId}
                    onClick={() => toggleEnrollment(r)}
                  >
                    {isEnrolled ? 'Waive' : 'Enroll'}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <BenefitRuleFormModal show={showRuleModal} onHide={() => setShowRuleModal(false)} onSaved={loadRules} />
    </div>
  );
}