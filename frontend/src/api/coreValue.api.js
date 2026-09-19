import axiosClient from './axiosClient';

export const coreValueApi = {
  getAll: () => axiosClient.get('/core-values'),
  create: (data) => axiosClient.post('/core-values', data),
  remove: (id) => axiosClient.delete(`/core-values/${id}`),
};