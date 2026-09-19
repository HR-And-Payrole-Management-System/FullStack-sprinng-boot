import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import OrgChart from './pages/OrgChart';
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AnnouncementsPage from './pages/settings/announcements/AnnouncementsPage';
import OnboardingList from './pages/onboarding/OnboardingList';
import OnboardingDetail from './pages/onboarding/OnboardingDetail';
import OffboardingList from './pages/offboarding/OffboardingList';
import OffboardingDetail from './pages/offboarding/OffboardingDetail';

const Home = lazy(() => import("./pages/Home"))

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const OAuthCallback = lazy(() => import("./pages/auth/OAuthCallback"));

// Dashboard pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const HrDashboard = lazy(() => import("./pages/dashboard/HrDashboard"));
const HrManagerDashboard = lazy(() => import("./pages/dashboard/HrManagerDashboard"));
const ManagerDashboard = lazy(() => import("./pages/dashboard/ManagerDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/dashboard/EmployeeDashboard"));

// Org structure
const CompanyList = lazy(() => import("./pages/company/CompanyList"));
const BranchList = lazy(() => import("./pages/branch/BranchList"));
const DepartmentList = lazy(() => import("./pages/department/DepartmentList"));
const PositionList = lazy(() => import("./pages/position/PositionList"));
const JobRoleList = lazy(() => import("./pages/jobRole/JobRoleList"));
const LocationList = lazy(() => import("./pages/location/LocationList"));

// Employee
const EmployeeList = lazy(() => import("./pages/employee/EmployeeList"));
const EmployeeFormPage = lazy(() => import("./pages/employee/EmployeeFormPage"));
const EmployeeProfile = lazy(() => import("./pages/employee/EmployeeProfile"));

// Work / Attendance / Leave / Payroll
const WorkforcePlanningPage = lazy(() => import("./pages/schedule/WorkforcePlanningPage"));
const AttendanceList = lazy(() => import("./pages/attendance/AttendanceList"));
const LeaveManagementPage = lazy(() => import("./pages/leave/LeaveManagementPage"));
const PayrollManagementPage = lazy(() => import("./pages/payroll/PayrollManagementPage"));
const PayslipView = lazy(() => import("./pages/payroll/PayslipView"));

// Reports / Analytics / Performance / Recruitment / Training
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const AnalyticsPage = lazy(() => import("./pages/analytics/AnalyticsPage"));
const WorkforceInsightsPage = lazy(() => import("./pages/analytics/WorkforceInsightsPage"));
const PerformancePage = lazy(() => import("./pages/performance/PerformancePage"));
const RecruitmentPage = lazy(() => import("./pages/recruitment/RecruitmentPage"));
const TrainingPage = lazy(() => import("./pages/training/TrainingPage"));

// Settings / Account / Misc
const UsersRolesPage = lazy(() => import("./pages/settings/UsersRolesPage"));
const AuditLogPage = lazy(() => import("./pages/settings/audit/AuditLogPage"));
const SystemSettingsPage = lazy(() => import("./pages/settings/system/SystemSettingsPage"));
const AccountSettings = lazy(() => import("./pages/account/AccountSettings"));
const NotificationsPage = lazy(() => import("./pages/notifications/NotificationsPage"));
const CalendarPage = lazy(() => import("./pages/calendar/CalendarPage"));
const MailPage = lazy(() => import("./pages/mail/MailPage"));
const DocumentsPage = lazy(() => import("./pages/documents/DocumentsPage"));
const AttendanceKiosk = lazy(() => import("./pages/attendance/AttendanceKiosk"));
const AttendanceScan = lazy(() => import("./pages/attendance/AttendanceScan"));
import ContactPage from "./pages/ContactPage";
// Errors
const NotFound = lazy(() => import("./pages/errors/NotFound"));
const Forbidden = lazy(() => import("./pages/errors/Forbidden"));

const IdCardPage = lazy(() => import("./pages/idcard/IdCardPage"));
const IdCardPrint = lazy(() => import("./pages/idcard/IdCardPrint"));
const IdCardLanyardPrint = lazy(() => import("./pages/idcard/IdCardLanyardPrint"));
import BenefitsPage from './pages/benefits/BenefitsPage';
import ExpenseApprovalsPage from './pages/expenses/ExpenseApprovalsPage';
import GoalsOkrPage from './pages/okr/GoalsOkrPage';
import SuccessionPlanningPage from './pages/succession/SuccessionPlanningPage';
import ComplianceCenterPage from './pages/compliance/ComplianceCenterPage';
import PoliciesPage from './pages/policies/PoliciesPage';
import MyPoliciesPage from './pages/policies/MyPoliciesPage';
import SurveysPage from './pages/surveys/SurveysPage';
import MySurveysPage from './pages/surveys/MySurveysPage';
import RecognitionPage from './pages/recognition/RecognitionPage';
const IntegrationsPage = lazy(() => import("./pages/settings/integrations/IntegrationsPage"));
const BillingPage = lazy(() => import("./pages/settings/billing/BillingPage"));
export default function App() {
  return (
    <ErrorBoundary>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 rounded">
        Skip to main content
      </a>
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/hr" element={<HrDashboard />} />
              <Route path="/dashboard/hr-manager" element={<HrManagerDashboard />} />
              <Route path="/dashboard/manager" element={<ManagerDashboard />} />
              <Route path="/dashboard/employee" element={<EmployeeDashboard />} />

              <Route path="/company" element={<CompanyList />} />
              <Route path="/branch" element={<BranchList />} />
              <Route path="/department" element={<DepartmentList />} />
              <Route path="/position" element={<PositionList />} />
              <Route path="/job-roles" element={<JobRoleList />} />
              <Route path="/locations" element={<LocationList />} />

              <Route path="/employee" element={<EmployeeList />} />
              <Route path="/employee/new" element={<EmployeeFormPage />} />
              <Route path="/employee/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/employee/:id" element={<EmployeeProfile />} />

              <Route path="/work-schedule" element={<WorkforcePlanningPage />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/attendance/kiosk" element={<AttendanceKiosk />} />
              <Route path="/attendance/scan" element={<AttendanceScan />} />
              <Route path="/leave" element={<LeaveManagementPage />} />
              <Route path="/payroll" element={<PayrollManagementPage />} />
              <Route path="/payroll/payslip/:payrollId" element={<PayslipView />} />

              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/analytics/workforce-insights" element={<WorkforceInsightsPage />} />
              <Route path="/management/performance" element={<PerformancePage />} />
              <Route path="/recruitment" element={<RecruitmentPage />} />
              <Route path="/training" element={<TrainingPage />} />

              <Route path="/settings/users-roles" element={<UsersRolesPage />} />
              <Route path="/settings/audit-logs" element={<AuditLogPage />} />
              <Route path="/settings/system-settings" element={<SystemSettingsPage />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/mail" element={<MailPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/settings/announcements" element={<AnnouncementsPage />} />
              <Route path="/id-card" element={<IdCardPage />} />
              <Route path="/id-card/:id/print" element={<IdCardPrint />} />
              <Route path="/id-card/:id/print-lanyard" element={<IdCardLanyardPrint />} />
              <Route path="/org-chart" element={<OrgChart/>} />
              <Route path="/onboarding" element={<OnboardingList />} />
              <Route path="/onboarding/:employeeId" element={<OnboardingDetail />} />
              <Route path="/offboarding" element={<OffboardingList />} />
              <Route path="/offboarding/:employeeId" element={<OffboardingDetail />} />
              <Route path="/benefits" element={<BenefitsPage />} />
              <Route path="/expenses" element={<ExpenseApprovalsPage />} />
              <Route path="/goals-okrs" element={<GoalsOkrPage />} />
              <Route path="/succession-planning" element={<SuccessionPlanningPage />} />
              <Route path="/compliance-center" element={<ComplianceCenterPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/my-policies" element={<MyPoliciesPage />} />
              <Route path="/surveys" element={<SurveysPage />} />
              <Route path="/my-surveys" element={<MySurveysPage />} />
              <Route path="/settings/integrations" element={<IntegrationsPage />} />
              <Route path="/settings/billing" element={<BillingPage />} />
              <Route path="/recognition" element={<RecognitionPage />} />
              <Route path="/403" element={<Forbidden />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}