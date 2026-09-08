import axiosClient from './axiosClient';

export const permissionApi = {
  getAll: () => axiosClient.get('/permissions'),
  getById: (id) => axiosClient.get(`/permissions/${id}`),
  create: (data) => axiosClient.post('/permissions', data),
  update: (id, data) => axiosClient.put(`/permissions/${id}`, data),
  remove: (id) => axiosClient.delete(`/permissions/${id}`),
};