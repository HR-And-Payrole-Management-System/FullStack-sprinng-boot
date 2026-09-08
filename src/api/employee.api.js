import axiosClient from './axiosClient';

export const employeeApi = {
  getAll: (params) => axiosClient.get('/employees', { params }),
  getById: (id) => axiosClient.get(`/employees/${id}`),
  create: (data) => axiosClient.post('/employees', data),
  update: (id, data) => axiosClient.put(`/employees/${id}`, data),
  assignOrganization: (id, data) => axiosClient.put(`/employees/${id}/organization`, data),
  changeStatus: (id, data) => axiosClient.put(`/employees/${id}/status`, data),
  remove: (id) => axiosClient.delete(`/employees/${id}`),
  getEmergencyContact: (id) => axiosClient.get(`/employees/${id}/emergency-contact`),
  saveEmergencyContact: (id, data) => axiosClient.put(`/employees/${id}/emergency-contact`, data),
  removeEmergencyContact: (id) => axiosClient.delete(`/employees/${id}/emergency-contact`),
  unlinkUser: (id) => axiosClient.delete(`/employees/${id}/user-link`),
  uploadPhoto: (id, formData) =>
  axiosClient.post(`/employees/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyTeam: () => axiosClient.get('/employees/me/team'),
};