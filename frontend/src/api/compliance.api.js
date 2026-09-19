import axiosClient from './axiosClient';

export const complianceApi = {
  getAll: () => axiosClient.get('/compliance/requirements'),
  create: (data) => axiosClient.post('/compliance/requirements', data),
  update: (id, data) => axiosClient.put(`/compliance/requirements/${id}`, data),
  remove: (id) => axiosClient.delete(`/compliance/requirements/${id}`), 
};