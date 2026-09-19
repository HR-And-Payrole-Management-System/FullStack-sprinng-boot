import axiosClient from './axiosClient';

export const integrationApi = {
  getAll: () => axiosClient.get('/integrations'),
  getSummary: () => axiosClient.get('/integrations/summary'),
  connect: (id, data) => axiosClient.post(`/integrations/${id}/connect`, data),
  disconnect: (id) => axiosClient.post(`/integrations/${id}/disconnect`),
  create: (data) => axiosClient.post('/integrations', data),
  remove: (id) => axiosClient.delete(`/integrations/${id}`),
};