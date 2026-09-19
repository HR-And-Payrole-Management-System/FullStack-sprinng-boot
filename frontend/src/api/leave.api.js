import axiosClient from './axiosClient';

export const leaveApi = {
  getByEmployeeId: (employeeId, page = 0, size = 10) =>
    axiosClient.get(`/leaves/employees/${employeeId}`, { params: { page, size } }),
  create: (employeeId, data) => axiosClient.post(`/leaves/employees/${employeeId}`, data),
  approve: (id, data) => axiosClient.put(`/leaves/${id}/approve`, data),
  reject: (id, data) => axiosClient.put(`/leaves/${id}/reject`, data),
  cancel: (id) => axiosClient.put(`/leaves/${id}/cancel`),
};