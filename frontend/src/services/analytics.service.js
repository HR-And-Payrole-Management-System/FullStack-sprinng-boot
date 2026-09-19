import { analyticsApi } from '../api/analytics.api';

export const analyticsService = {
  async payrollCostTrend(months = 6) {
    const res = await analyticsApi.getPayrollCostTrend(months);
    return res || [];
  },
  async payrollCostByDepartment() {
    const res = await analyticsApi.getPayrollCostByDepartment();
    return res || [];
  },
  async leaveUtilizationByType() {
    const res = await analyticsApi.getLeaveUtilizationByType();
    return res || [];
  },
  async leaveUtilizationByDepartment() {
    const res = await analyticsApi.getLeaveUtilizationByDepartment();
    return res || [];
  },
  async attendanceTrend(days = 14) {
    const res = await analyticsApi.getAttendanceTrend(days);
    return res || [];
  },
  async recruitmentFunnel() {
    const res = await analyticsApi.getRecruitmentFunnel();
    return res || [];
  },
};