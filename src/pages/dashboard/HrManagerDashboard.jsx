import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';

function HrManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { dashboardService.loadAll().then(setData); }, []);
  if (!data) return <LoadingSpinner fullPage />;

  const { leaves, payroll, organization } = data;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">HR Manager Dashboard</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Approvals overview — leave requests and payroll status
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3"><TrendStatCard label="Leave Pending" value={leaves?.pending ?? 0} icon="⏳" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></div>
        <div className="col-md-3"><TrendStatCard label="Payroll Calculated" value={payroll?.calculated ?? 0} icon="🧮" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></div>
        <div className="col-md-3"><TrendStatCard label="Payroll Approved" value={payroll?.approved ?? 0} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></div>
        <div className="col-md-3"><TrendStatCard label="Departments" value={organization?.departments ?? 0} icon="🏢" iconBg="var(--color-bg)" iconColor="var(--color-text)" /></div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <DonutChart
            title="Leave Status Breakdown"
            centerLabel="Total"
            data={[
              { name: 'Pending', value: leaves?.pending ?? 0 },
              { name: 'Approved', value: leaves?.approved ?? 0 },
              { name: 'Rejected', value: leaves?.rejected ?? 0 },
            ]}
          />
        </div>
        <div className="col-md-6">
          <DonutChart
            title="Payroll Status"
            centerLabel="Total"
            data={[
              { name: 'Calculated', value: payroll?.calculated ?? 0 },
              { name: 'Approved', value: payroll?.approved ?? 0 },
              { name: 'Paid', value: payroll?.paid ?? 0 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default HrManagerDashboard;