import { attendanceApi } from '../api/attendance.api';

export const attendanceService = {
  // Self-service
  async getTodaySelf() {
    const res = await attendanceApi.getTodaySelf();
    return res.data; // null if not checked in today
  },
  async checkInSelf() {
    const res = await attendanceApi.checkInSelf();
    return res.data;
  },
  async checkOutSelf() {
    const res = await attendanceApi.checkOutSelf();
    return res.data;
  },

  // Admin/HR
  async search({ page = 0, size = 10, employeeId, departmentId, branchId, status, startDate, endDate } = {}) {
    const res = await attendanceApi.search({ page, size, employeeId, departmentId, branchId, status, startDate, endDate });
    return res.data;
  },
  async getMonthlySummary(employeeId, year, month) {
    const res = await attendanceApi.getMonthlySummary(employeeId, year, month);
    return res.data;
  },
  async adjust(id, payload) {
    const res = await attendanceApi.adjust(id, payload);
    return res.data;
  },
};