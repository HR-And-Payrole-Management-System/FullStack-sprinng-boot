import axiosClient from './axiosClient';

export const jobRoleApi = {
  getAll: () => axiosClient.get('/job-roles'),
  getById: (id) => axiosClient.get(`/job-roles/${id}`),
  getByDepartmentId: (departmentId) => axiosClient.get(`/job-roles/department/${departmentId}`),
  create: (data) => axiosClient.post('/job-roles', data),
  update: (id, data) => axiosClient.put(`/job-roles/${id}`, data),
  remove: (id) => axiosClient.delete(`/job-roles/${id}`),
};