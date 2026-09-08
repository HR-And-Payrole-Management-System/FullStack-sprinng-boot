import { reportApi } from '../api/report.api';

// ⚠️ Report endpoints return the List directly (no ApiResponse wrapper) —
// axiosClient interceptor already unwraps response.data, so `res` here
// IS the array itself, not `res.data`.

export const reportService = {
  async employees(departmentId) {
    const res = await reportApi.getEmployeeReport(departmentId || undefined);
    return res || [];
  },
  async attendance(startDate, endDate) {
    const res = await reportApi.getAttendanceReport(startDate, endDate);
    return res || [];
  },
  async leaves(year) {
    const res = await reportApi.getLeaveReport(year);
    return res || [];
  },
  async payroll(year, month) {
    const res = await reportApi.getPayrollReport(year, month);
    return res || [];
  },
};