import axiosClient from './axiosClient';

export const trainingProgramApi = {
  getAll: () => axiosClient.get('/training/programs'),
  getById: (id) => axiosClient.get(`/training/programs/${id}`),
  create: (data) => axiosClient.post('/training/programs', data),
  update: (id, data) => axiosClient.put(`/training/programs/${id}`, data),
  remove: (id) => axiosClient.delete(`/training/programs/${id}`),
};