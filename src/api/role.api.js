import axiosClient from './axiosClient';

export const roleApi = {
  getAll: (params) => axiosClient.get('/roles', { params }),
  getById: (id) => axiosClient.get(`/roles/${id}`),
  create: (data) => axiosClient.post('/roles', data),
  update: (id, data) => axiosClient.put(`/roles/${id}`, data),
  remove: (id) => axiosClient.delete(`/roles/${id}`),
  assignPermissions: (roleId, permissionIds) =>
    axiosClient.post(`/roles/${roleId}/permissions`, { permissionIds }),
  removePermission: (roleId, permissionId) =>
    axiosClient.delete(`/roles/${roleId}/permissions/${permissionId}`),
};