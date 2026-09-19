import axiosClient from './axiosClient';

export const expenseApi = {
  submit: (data) => axiosClient.post('/expenses', data),
  approve: (id, approvedByEmployeeId) => axiosClient.put(`/expenses/${id}/approve`, null, { params: { approvedByEmployeeId } }),
  reject: (id, reason) => axiosClient.put(`/expenses/${id}/reject`, { reason }),
  getPending: () => axiosClient.get('/expenses/pending'),
  getByEmployee: (employeeId) => axiosClient.get(`/expenses/employee/${employeeId}`),
};