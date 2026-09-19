import axiosClient from './axiosClient';

export const policyApi = {
  getAll: () => axiosClient.get('/policies'),
  getPending: (employeeId) => axiosClient.get('/policies/pending', { params: { employeeId } }),
  create: (data) => axiosClient.post('/policies', data),
  publishVersion: (id, data) => axiosClient.post(`/policies/${id}/versions`, data),
  acknowledge: (id, employeeId) => axiosClient.post(`/policies/${id}/acknowledge`, null, { params: { employeeId } }),
  update: (id, data) => axiosClient.put(`/policies/${id}`, data),
archive: (id) => axiosClient.put(`/policies/${id}/archive`),
remove: (id) => axiosClient.delete(`/policies/${id}`),
};