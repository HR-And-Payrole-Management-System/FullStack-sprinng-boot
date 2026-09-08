
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Briefcase,
  MapPin,
  UserPlus,
  Activity,
  FileBarChart,
  BarChart3,
  LayoutGrid,
  Wallet,
  Star,
  Clock,
  Palmtree,
  GraduationCap,
  UserCog,
  Settings,
  ScrollText,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  Building2,
  Store,
  Target,
  ShieldCheck,
  UserCheck,
  Users2,
  FileText,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getPrimaryRole } from '../utils/roleUtils';
import { resolveUploadUrl } from '../utils/url';
import SidebarParticles from './common/SidebarParticles';
import { useState, useEffect, useRef } from 'react'; // (update your existing useState import to include useEffect)
import { companyService } from '../services/company.service';

import { companyApi } from '../api/company.api';

const menuGroups = [
  {
    key: 'main',
    label: 'Dashboard',
    items: [
      { label: 'Admin Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN'], real: true },
      { label: 'HR Dashboard', path: '/dashboard/hr', icon: ShieldCheck, roles: ['ADMIN', 'HR'], real: true },
      { label: 'HR Manager Dashboard', path: '/dashboard/hr-manager', icon: UserCheck, roles: ['ADMIN', 'HR_MANAGER'], real: true },
      { label: 'Manager Dashboard', path: '/dashboard/manager', icon: Users2, roles: ['ADMIN', 'MANAGER'], real: true },
      { label: 'Employee Dashboard', path: '/dashboard/employee', icon: LayoutGrid, roles: ['ADMIN', 'EMPLOYEE', 'HR', 'HR_MANAGER', 'MANAGER'], real: true },
    ],
  },
  {
    key: 'organization',
    label: 'Organization',
    items: [
      { label: 'Company', path: '/company', icon: Building2, permission: 'COMPANY_VIEW', real: true },
      { label: 'Branch', path: '/branch', icon: Store, permission: 'BRANCH_VIEW', real: true },
      { label: 'Department', path: '/department', icon: FolderTree, permission: 'DEPARTMENT_VIEW', real: true },
      { label: 'Job Roles', path: '/job-roles', icon: Briefcase, permission: 'JOB_ROLE_VIEW', real: true },
      { label: 'Locations',path: '/locations', icon: MapPin,permission: 'LOCATION_VIEW', real: true },
      { label: 'Recruitment', path: '/recruitment', icon: UserPlus, permission: 'RECRUITMENT_VIEW', real: true },
      { label: 'Positions', path: '/position', icon: Briefcase, permission: 'POSITION_VIEW', real: true },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Workforce Insights', path: '/analytics/workforce-insights', icon: Activity, permission: 'DASHBOARD_VIEW', real: true },
      { label: 'Reports', path: '/reports', icon: FileBarChart, permission: 'REPORT_VIEW', real: true },
      { label: 'Analytics', path: '/analytics', icon: BarChart3, permission: 'ANALYTICS_VIEW', real: true },
    ],
  },
  {
    key: 'management',
    label: 'Management',
    items: [
      { label: 'Employee', path: '/employee', icon: Users, permission: 'EMPLOYEE_VIEW', real: true },
      { label: 'Documents', path: '/documents', icon: FileText, permission: 'DOCUMENT_VIEW', real: true },
      { label: 'Work Schedule', path: '/work-schedule', icon: Clock, permission: 'SCHEDULE_VIEW', real: true },
      { label: 'Payroll', path: '/payroll', icon: Wallet, permission: 'PAYROLL_VIEW', real: true },
      { label: 'Performance', path: '/management/performance', icon: Target, permission: 'PERFORMANCE_VIEW', real: true },
      { label: 'Attendance', path: '/attendance', icon: Clock, permission: 'ATTENDANCE_VIEW', real: true },
      { label: 'Leave Management', path: '/leave', icon: Palmtree, permission: 'LEAVE_VIEW', real: true },
      { label: 'Training & Development', path: '/training', icon: GraduationCap, permission: 'TRAINING_VIEW', real: true },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    items: [
      { label: 'Users & Roles', path: '/settings/users-roles', icon: UserCog, permission: 'USER_VIEW', real: true },
      { label: 'System Settings', path: '/settings/system-settings', icon: Settings, permission: 'SETTINGS_VIEW', real: true },
      { label: 'Audit Logs', path: '/settings/audit-logs', icon: ScrollText, permission: 'AUDIT_VIEW', real: true },
    ],
  },
];

function initials(user) {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
}

function Sidebar({ collapsed, onToggle }) {
  const { user, hasPermission, hasRole } = useAuth();

  // Accordion state — all groups open by default
  const [openGroups, setOpenGroups] = useState(
    () => Object.fromEntries(menuGroups.map((g) => [g.key, true]))
  );

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Extended to also support `roles` (any-of match) alongside the
  // existing `permission` check — items can use either or both.
  const canSee = (item) => {
    if (hasRole('ADMIN')) return true;
    const permOk = !item.permission || hasPermission(item.permission);
    const roleOk = !item.roles || item.roles.some((r) => hasRole(r));
    return permOk && roleOk;
  };
  const [companyLogo, setCompanyLogo] = useState(null);
  const [company, setCompany] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

useEffect(() => {
  companyService
    .list()
    .then((companies) => {
      const first = companies?.[0];
      if (first) {
        setCompany(first);
        if (first.logoUrl) setCompanyLogo(resolveUploadUrl(first.logoUrl));
      }
    })
    .catch(() => {});
}, []);

const handleLogoClick = () => {
  fileInputRef.current?.click();
};

const handleLogoChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !company) return;

  setUploading(true);
  try {
    const updated = await companyApi.uploadLogo(company.id, file);
    const newLogoUrl = updated?.data?.logoUrl;
    if (newLogoUrl) {
      setCompanyLogo(resolveUploadUrl(newLogoUrl));
    }
  } catch (err) {
    console.error('Logo upload failed', err);
  } finally {
    setUploading(false);
    e.target.value = ''; // reset so picking the same file again still fires onChange
  }
};

  const visibleGroups = menuGroups
    .map((group) => ({ ...group, items: group.items.filter(canSee) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="ent-sidebar" style={{ width: collapsed ? '72px' : '260px', height: '100vh' }}>
                <SidebarParticles />

                <div className="ent-sidebar-brand">
                  <div className="ent-sidebar-brand-icon" style={{ position: 'relative' }}>
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }}
              />
            ) : (
              <Users size={20} />
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogoClick}
                disabled={uploading}
                title="Change logo"
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#5B7BFF',
                  border: '2px solid var(--sidebar-bg)',
                  color: '#fff',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  padding: 0,
                }}
              >
                ✎
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
          </div>
        {!collapsed && (
          <div>
            <div className="ent-sidebar-brand-title">HRMS</div>
            <div className="ent-sidebar-brand-sub">Enterprise</div>
          </div>
        )}
      </div>

      <div className="flex-grow-1 ent-sidebar-scroll" style={{ overflowY: 'auto' }}>
        {visibleGroups.map((group) => {
          const isOpen = collapsed ? true : openGroups[group.key];

          return (
            <div key={group.key}>
              {!collapsed && (
                <button
                  className="ent-sidebar-group-header"
                  onClick={() => toggleGroup(group.key)}
                >
                  <span className="ent-sidebar-section-label" style={{ padding: 0 }}>
                    {group.label}
                  </span>
                  <ChevronRight className={`ent-sidebar-group-chevron ${isOpen ? 'open' : ''}`} />
                </button>
              )}

              <div className={collapsed ? '' : `ent-sidebar-group-body ${isOpen ? 'open' : ''}`}>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  if (!item.real) {
                    return (
                      <button
                        key={item.label}
                        className="ent-sidebar-link disabled"
                        title={collapsed ? `${item.label} (Coming Soon)` : undefined}
                        disabled
                      >
                        <Icon className="ent-sidebar-icon" />
                        {!collapsed && <span>{item.label}</span>}
                        {!collapsed && <span className="ent-sidebar-soon">Soon</span>}
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) => `ent-sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="ent-sidebar-icon" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ent-sidebar-user">
        <button onClick={onToggle} className="ent-sidebar-collapse-btn" aria-label="Toggle sidebar">
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
        <div className="ent-sidebar-user-avatar">
          {user?.photoUrl ? (
            <img
              src={resolveUploadUrl(user.photoUrl)}
              alt="avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : (
            initials(user)
          )}
        </div>
        {!collapsed && (
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div className="ent-sidebar-user-name">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </div>
            <div className="ent-sidebar-user-role">{getPrimaryRole(user?.roles)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;