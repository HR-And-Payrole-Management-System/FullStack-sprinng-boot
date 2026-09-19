import axiosClient from './axiosClient';

export const candidateApi = {
  getAll: () => axiosClient.get('/recruitment/candidates'),
  getById: (id) => axiosClient.get(`/recruitment/candidates/${id}`),
  create: (data) => axiosClient.post('/recruitment/candidates', data),
  update: (id, data) => axiosClient.put(`/recruitment/candidates/${id}`, data),
  remove: (id) => axiosClient.delete(`/recruitment/candidates/${id}`),
};