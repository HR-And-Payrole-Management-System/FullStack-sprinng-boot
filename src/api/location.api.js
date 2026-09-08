import axiosClient from './axiosClient';

export const locationApi = {
  getAll: () => axiosClient.get('/locations'),
  getById: (id) => axiosClient.get(`/locations/${id}`),
  getByBranchId: (branchId) => axiosClient.get(`/locations/branch/${branchId}`),
  create: (data) => axiosClient.post('/locations', data),
  update: (id, data) => axiosClient.put(`/locations/${id}`, data),
  remove: (id) => axiosClient.delete(`/locations/${id}`),
};