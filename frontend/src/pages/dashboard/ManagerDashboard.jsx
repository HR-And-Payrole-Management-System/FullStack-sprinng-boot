import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';

// NOTE: the backend has no "manager's team" scoping (no managerId field
// on Employee, no cross-employee leave listing endpoint) — so this shows
// org-wide attendance/leave data, same as HR Dashboard, just reframed.
// A true team-filtered view needs backend work first.
function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { dashboardService.loadAll().then(setData); }, []);
  if (!data) return <LoadingSpinner fullPage />;

  const { attendance, leaves } = data;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Manager Dashboard</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Attendance and leave overview
          </div>
        </div>
      </div>

      <div className="ent-card p-2 mb-3" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)', fontSize: 'var(--text-sm)' }}>
        ⚠ Showing company-wide data — team-specific filtering isn't available yet (needs a manager-to-employee link on the backend).
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4"><TrendStatCard label="Present Today" value={attendance?.present ?? 0} icon="🟢" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></div>
        <div className="col-md-4"><TrendStatCard label="Absent Today" value={attendance?.absent ?? 0} icon="🔴" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" /></div>
        <div className="col-md-4"><TrendStatCard label="Leave Pending" value={leaves?.pending ?? 0} icon="⏳" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></div>
      </div>

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
  );
}

export default ManagerDashboard;