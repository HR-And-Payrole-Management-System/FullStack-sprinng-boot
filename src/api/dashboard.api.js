import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: (departmentId) =>
    axiosClient.get('/dashboard/summary', { params: { departmentId } }),
  getEmployeeStats: (departmentId) =>
    axiosClient.get('/dashboard/employees', { params: { departmentId } }),
  getAttendanceStats: (date) =>
    axiosClient.get('/dashboard/attendance', { params: { date } }),
  getLeaveStats: (year) =>
    axiosClient.get('/dashboard/leaves', { params: { year } }),
  getPayrollStats: (year, month) =>
    axiosClient.get('/dashboard/payroll', { params: { year, month } }),
  getOrganizationStats: () =>
    axiosClient.get('/dashboard/organization'),

  // Workforce insights sub-routes
  getWorkforceTrend: () =>
    axiosClient.get('/dashboard/workforce/trend'),
  getAttritionByDepartment: () =>
    axiosClient.get('/dashboard/workforce/attrition-by-department'),
  getAttritionByPosition: () =>
    axiosClient.get('/dashboard/workforce/attrition-by-position'),
  getAgeGroups: () =>
    axiosClient.get('/dashboard/workforce/age-groups'),
  getGenderDiversity: () =>
    axiosClient.get('/dashboard/workforce/gender-diversity'),
  getTenureDistribution: () =>
    axiosClient.get('/dashboard/workforce/tenure-distribution'),
  getPendingApprovals: () =>
    axiosClient.get('/dashboard/pending-approvals'),
    getRecruitmentPipeline: () =>
    axiosClient.get('/dashboard/recruitment-pipeline'),
  getTrainingCompletion: () =>
    axiosClient.get('/dashboard/training-completion'),
    getUpcomingHolidays: (limit = 5) =>
    axiosClient.get('/dashboard/upcoming-holidays', { params: { limit } }),
  getBirthdaysThisMonth: () =>
    axiosClient.get('/dashboard/birthdays'),
    getRecentAnnouncements: (limit = 4) =>
    axiosClient.get('/dashboard/recent-announcements', { params: { limit } }),
  getComplianceAlerts: () =>
    axiosClient.get('/dashboard/compliance-alerts'),

    getRecentActivity: (limit = 8) =>
    axiosClient.get('/dashboard/recent-activity', { params: { limit } }),
};