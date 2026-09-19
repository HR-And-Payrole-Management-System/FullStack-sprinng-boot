import axiosClient from './axiosClient';

export const payrollApi = {
  generate: (data) => axiosClient.post('/payrolls/generate', data),
  getAll: () => axiosClient.get('/payrolls'),
  getById: (id) => axiosClient.get(`/payrolls/${id}`),
  approve: (id) => axiosClient.put(`/payrolls/${id}/approve`),
  markPaid: (id) => axiosClient.put(`/payrolls/${id}/paid`),
};