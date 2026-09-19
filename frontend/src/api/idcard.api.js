import axiosClient from './axiosClient';

export const idCardApi = {
  create: (employeeId, data) => axiosClient.post(`/id-cards/employees/${employeeId}`, data),
  getById: (id) => axiosClient.get(`/id-cards/${id}`),
  getByEmployee: (employeeId) => axiosClient.get(`/id-cards/employees/${employeeId}`),
  getAll: (params) => axiosClient.get('/id-cards', { params }),
  update: (id, data) => axiosClient.put(`/id-cards/${id}`, data),
  remove: (id) => axiosClient.delete(`/id-cards/${id}`),
};