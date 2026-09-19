import axiosClient from './axiosClient';

export const okrCycleApi = {
  getAll: () => axiosClient.get('/okr-cycles'),
  create: (data) => axiosClient.post('/okr-cycles', data),
  close: (id) => axiosClient.put(`/okr-cycles/${id}/close`),
};