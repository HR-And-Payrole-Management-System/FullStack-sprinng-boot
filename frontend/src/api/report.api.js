import axiosClient from './axiosClient';

export const reportApi = {
  getEmployeeReport: (departmentId) =>
    axiosClient.get('/reports/employees', { params: { departmentId } }),
  getAttendanceReport: (startDate, endDate) =>
    axiosClient.get('/reports/attendance', { params: { startDate, endDate } }),
  getLeaveReport: (year) =>
    axiosClient.get('/reports/leaves', { params: { year } }),
  getPayrollReport: (year, month) =>
    axiosClient.get('/reports/payroll', { params: { year, month } }),
};