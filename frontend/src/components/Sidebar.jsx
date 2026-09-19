import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartHandshake } from 'lucide-react';
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
  Megaphone,
  QrCode,
  ScanLine,
  IdCard,
  LogIn,
  LogOut,
  Network,
  HeartPulse,
  Receipt,
  Goal,
  TrendingUp,
  ClipboardList,
  Award,
  FileCheck2,
  BookOpen,
  Plug,
  CreditCard,
  GitBranch,
  Heart,

} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getPrimaryRole } from '../utils/roleUtils';
import { resolveUploadUrl } from '../utils/url';
import SidebarParticles from './common/SidebarParticles';
import { useState, useEffect, useRef } from 'react';
import { companyService } from '../services/company.service';

import { companyApi } from '../api/company.api';

const menuGroups = [
  {
    key: 'main',
    label: 'Dashboard',
    tKey: 'nav.dashboard',
    items: [
      { label: 'Admin Dashboard', tKey: 'nav.adminDashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN'], real: true },
      { label: 'HR Dashboard', tKey: 'nav.hrDashboard', path: '/dashboard/hr', icon: ShieldCheck, roles: ['ADMIN', 'HR'], real: true },
      { label: 'HR Manager Dashboard', tKey: 'nav.hrManagerDashboard', path: '/dashboard/hr-manager', icon: UserCheck, roles: ['ADMIN', 'HR_MANAGER'], real: true },
      { label: 'Manager Dashboard', tKey: 'nav.managerDashboard', path: '/dashboard/manager', icon: Users2, roles: ['ADMIN', 'MANAGER'], real: true },
      { label: 'Employee Dashboard', tKey: 'nav.employeeDashboard', path: '/dashboard/employee', icon: LayoutGrid, roles: ['ADMIN', 'EMPLOYEE', 'HR', 'HR_MANAGER', 'MANAGER'], real: true },
    ],
  },
  {
    key: 'organization',
    label: 'Organization',
    tKey: 'nav.organization',
    items: [
      { label: 'Company', tKey: 'nav.company', path: '/company', icon: Building2, permission: 'COMPANY_VIEW', real: true },
      { label: 'Branch', tKey: 'nav.branch', path: '/branch', icon: Store, permission: 'BRANCH_VIEW', real: true },
      { label: 'Department', tKey: 'nav.department', path: '/department', icon: FolderTree, permission: 'DEPARTMENT_VIEW', real: true },
      { label: 'Job Roles', tKey: 'nav.jobRoles', path: '/job-roles', icon: Briefcase, permission: 'JOB_ROLE_VIEW', real: true },
      { label: 'Positions', tKey: 'nav.positions', path: '/position', icon: Briefcase, permission: 'POSITION_VIEW', real: true },
      { label: 'Locations', tKey: 'nav.locations', path: '/locations', icon: MapPin, permission: 'LOCATION_VIEW', real: true },
      { label: 'Org Chart', path: '/org-chart', tKey: 'nav.orgChart', icon: Network, permission: 'EMPLOYEE_VIEW', real: true },
    ],
  },
  {
    key: 'talent',
    label: 'Talent Acquisition',
    tKey: 'nav.talentAcquisition',
    items: [
      { label: 'Recruitment', tKey: 'nav.recruitment', path: '/recruitment', icon: UserPlus, permission: 'RECRUITMENT_VIEW', real: true },
      { label: 'Onboarding', tKey: 'nav.onboarding', path: '/onboarding', icon: LogIn, permission: 'EMPLOYEE_VIEW', real: true },
      { label: 'Offboarding', tKey: 'nav.offboarding', path: '/offboarding', icon: LogOut, permission: 'EMPLOYEE_MANAGE', real: true },
    ],
  },
  {
    key: 'management',
    label: 'Workforce',
    tKey: 'nav.workforce',
    items: [
      { label: 'Employee', tKey: 'nav.employee', path: '/employee', icon: Users, permission: 'EMPLOYEE_VIEW', real: true },
      { label: 'ID Card', tKey: 'nav.idCard', path: '/id-card', icon: IdCard, permission: 'EMPLOYEE_VIEW', real: true },
      { label: 'Documents', tKey: 'nav.documents', path: '/documents', icon: FileText, permission: 'DOCUMENT_VIEW', real: true },
      { label: 'Work Schedule', tKey: 'nav.workSchedule', path: '/work-schedule', icon: Clock, permission: 'SCHEDULE_VIEW', real: true },
      { label: 'Attendance', tKey: 'nav.attendance', path: '/attendance', icon: Clock, permission: 'ATTENDANCE_VIEW', real: true },
      { label: 'Attendance Kiosk', tKey: 'nav.attendanceKiosk', path: '/attendance/kiosk', icon: QrCode, permission: 'ATTENDANCE_ADJUST', real: true },
      { label: 'Scan Attendance QR', tKey: 'nav.scanAttendanceQr', path: '/attendance/scan', icon: ScanLine, real: true },
      { label: 'Leave Management', tKey: 'nav.leaveManagement', path: '/leave', icon: Palmtree, permission: 'LEAVE_VIEW', real: true },
    ],
  },
  {
    key: 'compensation',
    label: 'Compensation & Benefits',
    tKey: 'nav.compensationBenefits',
    items: [
      { label: 'Payroll', tKey: 'nav.payroll', path: '/payroll', icon: Wallet, permission: 'PAYROLL_VIEW', real: true },
      { label: 'Benefits', path: '/benefits', tKey: 'nav.benefits', icon: HeartHandshake, permission: 'EMPLOYEE_MANAGE', real: true },
      { label: 'Expense Management', path: '/expenses', tKey: 'nav.expenses', icon: Receipt, permission: 'EMPLOYEE_MANAGE', real: true },
    ],
  },
  {
    key: 'performance',
    label: 'Performance & Growth',
    tKey: 'nav.performanceGrowth',
    items: [
      { label: 'Performance', tKey: 'nav.performance', path: '/management/performance', icon: Target, permission: 'PERFORMANCE_VIEW', real: true },
      { label: 'Goals & OKRs', path: '/goals-okrs', tKey: 'nav.goalsOkrs', icon: Target, permission: 'PERFORMANCE_VIEW', real: true },
      { label: 'Training & Development', tKey: 'nav.training', path: '/training', icon: GraduationCap, permission: 'TRAINING_VIEW', real: true },
      { label: 'Succession Planning', path: '/succession-planning', tKey: 'nav.successionPlanning', icon: GitBranch, permission: 'EMPLOYEE_MANAGE', real: true },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    tKey: 'nav.analytics',
    items: [
      { label: 'Workforce Insights', tKey: 'nav.workforceInsights', path: '/analytics/workforce-insights', icon: Activity, permission: 'DASHBOARD_VIEW', real: true },
      { label: 'Reports', tKey: 'nav.reports', path: '/reports', icon: FileBarChart, permission: 'REPORT_VIEW', real: true },
      { label: 'Analytics', tKey: 'nav.analytics', path: '/analytics', icon: BarChart3, permission: 'ANALYTICS_VIEW', real: true },
    ],
  },
  {
    key: 'engagement',
    label: 'Engagement',
    tKey: 'nav.engagement',
    items: [
      { label: 'Announcements', tKey: 'nav.announcements', path: '/settings/announcements', icon: Megaphone, permission: 'SETTINGS_VIEW', real: true },
      { label: 'Surveys', path: '/surveys', tKey: 'nav.surveys', icon: ClipboardList, permission: 'EMPLOYEE_MANAGE', real: true },
      { label: 'My Surveys', path: '/my-surveys', tKey: 'nav.mySurveys', icon: ClipboardList, permission: 'EMPLOYEE_VIEW', real: true },
      { label: 'Recognition', path: '/recognition', tKey: 'nav.recognition', icon: Heart, permission: 'EMPLOYEE_VIEW', real: true },
    ],
  },
  {
    key: 'compliance',
    label: 'Compliance',
    tKey: 'nav.compliance',
    items: [
      { label: 'Audit Logs', tKey: 'nav.auditLogs', path: '/settings/audit-logs', icon: ScrollText, permission: 'AUDIT_VIEW', real: true },
      { label: 'Compliance Center', path: '/compliance-center', tKey: 'nav.complianceCenter', icon: ShieldCheck, permission: 'EMPLOYEE_MANAGE', real: true },
      { label: 'Policies', path: '/policies', tKey: 'nav.policies', icon: FileCheck2, permission: 'EMPLOYEE_MANAGE', real: true },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    tKey: 'nav.settings',
    items: [
      { label: 'Users & Roles', tKey: 'nav.usersRoles', path: '/settings/users-roles', icon: UserCog, permission: 'USER_VIEW', real: true },
      { label: 'System Settings', tKey: 'nav.systemSettings', path: '/settings/system-settings', icon: Settings, permission: 'SETTINGS_VIEW', real: true },
      { label: 'Integrations', tKey: 'nav.integrations', path: '/settings/integrations', icon: Plug, permission: 'INTEGRATION_VIEW', real: true },
      { label: 'Billing & Subscription', tKey: 'nav.billing', path: '/settings/billing', icon: CreditCard, permission: 'BILLING_VIEW', real: true },
    ],
  },
];

function spawnRipple(e) {
  const link = e.currentTarget;
  const rect = link.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ent-sidebar-ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  link.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function initials(user) {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
}

function Sidebar({ collapsed, onToggle }) {
  const { user, hasPermission, hasRole } = useAuth();
  const { t } = useTranslation();

  const [openGroups, setOpenGroups] = useState(
    () => Object.fromEntries(menuGroups.map((g) => [g.key, true]))
  );

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      e.target.value = '';
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
            <div className="ent-sidebar-brand-sub">Enterprise+</div>
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
                    {t(group.tKey, group.label)}
                  </span>
                  <ChevronRight className={`ent-sidebar-group-chevron ${isOpen ? 'open' : ''}`} />
                </button>
              )}

              <div className={collapsed ? '' : `ent-sidebar-group-body ${isOpen ? 'open' : ''}`}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const itemLabel = t(item.tKey, item.label);

                  if (!item.real) {
                    return (
                      <button
                        key={item.label}
                        className="ent-sidebar-link disabled"
                        title={collapsed ? `${itemLabel} (Coming Soon)` : undefined}
                        disabled
                      >
                        <Icon className="ent-sidebar-icon" />
                        {!collapsed && <span>{itemLabel}</span>}
                        {!collapsed && <span className="ent-sidebar-soon">Soon</span>}
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? itemLabel : undefined}
                      onClick={spawnRipple}
                      className={({ isActive }) => `ent-sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="ent-sidebar-icon" />
                      {!collapsed && <span>{itemLabel}</span>}
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