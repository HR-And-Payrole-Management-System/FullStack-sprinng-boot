import axiosClient from './axiosClient';

export const attendanceApi = {
  // Self-service (any logged-in employee, own record only)
  checkInSelf: () => axiosClient.post('/attendances/check-in'),
  checkOutSelf: () => axiosClient.post('/attendances/check-out'),
  getTodaySelf: () => axiosClient.get('/attendances/today'),

  // Admin/HR only
  checkInFor: (employeeId) => axiosClient.post(`/attendances/employees/${employeeId}/check-in`),
  checkOutFor: (employeeId) => axiosClient.post(`/attendances/employees/${employeeId}/check-out`),
  getById: (id) => axiosClient.get(`/attendances/${id}`),
  search: (params) => axiosClient.get('/attendances', { params }),
  getMonthlySummary: (employeeId, year, month) =>
    axiosClient.get(`/attendances/employees/${employeeId}/monthly-summary`, { params: { year, month } }),
  adjust: (id, data) => axiosClient.put(`/attendances/${id}/adjust`, data),
};