import axiosClient from './axiosClient';

export const userApi = {
  search: (keyword) => axiosClient.get('/users', { params: { keyword } }),
  getById: (id) => axiosClient.get(`/users/${id}`),
  assignRoles: (userId, roleIds) => axiosClient.post(`/users/${userId}/roles`, { roleIds }),
  removeRole: (userId, roleId) => axiosClient.delete(`/users/${userId}/roles/${roleId}`),
};