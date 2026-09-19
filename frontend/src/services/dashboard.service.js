import { dashboardApi } from '../api/dashboard.api';

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // local calendar date, not UTC
}

export const dashboardService = {
  // Loads everything the Dashboard page needs in one call.
  // Each stat is independently caught so one failing widget
  // doesn't blank the whole page.
  //
  // departmentId (optional) filters Summary + Employee stats only.
  // dateRange maps to a year/month reference point — Leave stats are
  // yearly and Payroll stats are monthly on the backend today, so
  // finer-grained ranges ('This Month', 'Last 3 Months') aren't
  // distinguishable yet without new backend endpoints.
  async loadAll(departmentId, dateRange = 'This Year') {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    if (dateRange === 'Last Year') {
      year = year - 1;
    }

    const [
      summary, employees, attendance, leaves, payroll, organization,
      pendingApprovals, recruitment, trainingCompletion,
      upcomingHolidays, birthdays, announcements, complianceAlerts,
      recentActivity,
    ] = await Promise.all([
      dashboardApi.getSummary(departmentId).catch(() => null),
      dashboardApi.getEmployeeStats(departmentId).catch(() => null),
      dashboardApi.getAttendanceStats(todayIso()).catch(() => null),
      dashboardApi.getLeaveStats(year).catch(() => null),
      dashboardApi.getPayrollStats(year, month).catch(() => null),
      dashboardApi.getOrganizationStats().catch(() => null),
      dashboardApi.getPendingApprovals().catch(() => null),
      dashboardApi.getRecruitmentPipeline().catch(() => null),
      dashboardApi.getTrainingCompletion().catch(() => null),
      dashboardApi.getUpcomingHolidays(5).catch(() => []),
      dashboardApi.getBirthdaysThisMonth().catch(() => []),
      dashboardApi.getRecentAnnouncements(4).catch(() => []),
      dashboardApi.getComplianceAlerts().catch(() => []),
      dashboardApi.getRecentActivity(8).catch(() => []),
    ]);

    return {
      summary, employees, attendance, leaves, payroll, organization,
      pendingApprovals, recruitment, trainingCompletion,
      upcomingHolidays, birthdays, announcements, complianceAlerts,
      recentActivity,
    };
  },

  // Workforce insights (trend, attrition, demographics) — separate
  // endpoint group, no department filter support yet either.
  async loadWorkforce() {
    const [trend, attritionByDept, attritionByPosition, ageGroups, gender, tenure] =
      await Promise.all([
        dashboardApi.getWorkforceTrend().catch(() => []),
        dashboardApi.getAttritionByDepartment().catch(() => []),
        dashboardApi.getAttritionByPosition().catch(() => []),
        dashboardApi.getAgeGroups().catch(() => []),
        dashboardApi.getGenderDiversity().catch(() => []),
        dashboardApi.getTenureDistribution().catch(() => []),
      ]);

    return { trend, attritionByDept, attritionByPosition, ageGroups, gender, tenure };
  },
  async loadAttendanceTrend(days = 7) {
    return dashboardApi.getAttendanceTrend(days);
  },

};