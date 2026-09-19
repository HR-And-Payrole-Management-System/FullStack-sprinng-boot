import { Tabs, Tab } from 'react-bootstrap';

import EmployeeReportTab from './EmployeeReportTab';
import AttendanceReportTab from './AttendanceReportTab';
import LeaveReportTab from './LeaveReportTab';
import PayrollReportTab from './PayrollReportTab';

function ReportsPage() {
  return (
    <div>
      <div className="ent-page-title mb-3">Reports</div>

      <div className="ent-card p-3">
        <Tabs defaultActiveKey="employee" className="mb-3">
          <Tab eventKey="employee" title="Employee">
            <EmployeeReportTab />
          </Tab>
          <Tab eventKey="attendance" title="Attendance">
            <AttendanceReportTab />
          </Tab>
          <Tab eventKey="leave" title="Leave">
            <LeaveReportTab />
          </Tab>
          <Tab eventKey="payroll" title="Payroll">
            <PayrollReportTab />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ReportsPage;