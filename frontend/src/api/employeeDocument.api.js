import axiosClient from './axiosClient';

export const employeeDocumentApi = {
  upload: (formData) =>
    axiosClient.post('/employee-documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  create: (employeeId, data) => axiosClient.post(`/employee-documents/employees/${employeeId}`, data),
  getByEmployee: (employeeId) => axiosClient.get(`/employee-documents/employees/${employeeId}`),
  getById: (id) => axiosClient.get(`/employee-documents/${id}`),
  update: (id, data) => axiosClient.put(`/employee-documents/${id}`, data),
  verify: (id, data) => axiosClient.put(`/employee-documents/${id}/verify`, data),
  getExpiring: (startDate, endDate) =>
    axiosClient.get('/employee-documents/expiring', { params: { startDate, endDate } }),
  markExpired: () => axiosClient.put('/employee-documents/mark-expired'),
  markExpiringSoon: (days = 7) =>
    axiosClient.put('/employee-documents/mark-expiring-soon', null, { params: { days } }),
  remove: (id) => axiosClient.delete(`/employee-documents/${id}`),
};