import { Link, useLocation } from 'react-router-dom';

const labelMap = {
  dashboard: 'Dashboard',
  company: 'Company',
  branch: 'Branch',
  department: 'Department',
  employee: 'Employee',
  attendance: 'Attendance',
  leave: 'Leave',
  payroll: 'Payroll',
  reports: 'Reports',
  notifications: 'Notifications',
  create: 'Create',
  edit: 'Edit',
  view: 'View',
  calendar: 'Calendar',
  document: 'Documents',
  
};

function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        {segments.map((seg, index) => {
          const path = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = labelMap[seg] || seg;

          return isLast ? (
            <li className="breadcrumb-item active" aria-current="page" key={path}>
              {label}
            </li>
          ) : (
            <li className="breadcrumb-item" key={path}>
              <Link to={path}>{label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;