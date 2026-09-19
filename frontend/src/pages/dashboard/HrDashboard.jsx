import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';

function HrDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { dashboardService.loadAll().then(setData); }, []);
  if (!data) return <LoadingSpinner fullPage />;

  const { employees, attendance, leaves } = data;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">HR Dashboard</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Headcount, today's attendance, and leave overview
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3"><TrendStatCard label="Total Employees" value={employees?.total ?? 0} icon="👥" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></div>
        <div className="col-md-3"><TrendStatCard label="Active" value={employees?.active ?? 0} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></div>
        <div className="col-md-3"><TrendStatCard label="Present Today" value={attendance?.present ?? 0} icon="🟢" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></div>
        <div className="col-md-3"><TrendStatCard label="Late Today" value={attendance?.late ?? 0} icon="🟡" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <DonutChart
            title="Attendance Today"
            centerLabel="Total"
            data={[
              { name: 'Present', value: attendance?.present ?? 0 },
              { name: 'Absent', value: attendance?.absent ?? 0 },
              { name: 'Late', value: attendance?.late ?? 0 },
            ]}
          />
        </div>
        <div className="col-md-6">
          <DonutChart
            title="Leave Requests (This Year)"
            centerLabel="Total"
            data={[
              { name: 'Pending', value: leaves?.pending ?? 0 },
              { name: 'Approved', value: leaves?.approved ?? 0 },
              { name: 'Rejected', value: leaves?.rejected ?? 0 },
              { name: 'Cancelled', value: leaves?.cancelled ?? 0 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default HrDashboard;