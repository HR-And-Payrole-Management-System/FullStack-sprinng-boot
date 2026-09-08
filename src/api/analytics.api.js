import axiosClient from './axiosClient';

export const analyticsApi = {
  getPayrollCostTrend: (months = 6) => axiosClient.get(`/analytics/payroll-cost-trend?months=${months}`),
  getPayrollCostByDepartment: () => axiosClient.get('/analytics/payroll-cost-by-department'),
  getLeaveUtilizationByType: () => axiosClient.get('/analytics/leave-utilization-by-type'),
  getLeaveUtilizationByDepartment: () => axiosClient.get('/analytics/leave-utilization-by-department'),
  getAttendanceTrend: (days = 14) => axiosClient.get(`/analytics/attendance-trend?days=${days}`),
  getRecruitmentFunnel: () => axiosClient.get('/analytics/recruitment-funnel'),
};