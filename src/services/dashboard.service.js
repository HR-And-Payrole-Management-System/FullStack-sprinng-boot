import { dashboardApi } from '../api/dashboard.api';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const dashboardService = {
  // Loads everything the Dashboard page needs in one call.
  // Each stat is independently caught so one failing widget
  // doesn't blank the whole page.
  //
  // departmentId (optional) filters Summary + Employee stats only —
  // Attendance/Leave/Payroll/Organization endpoints don't support a
  // department filter on the backend yet.
    async loadAll(departmentId) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

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
};