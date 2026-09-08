import axiosClient from './axiosClient';

export const leaveTypeApi = {
  getAll: () => axiosClient.get('/leave-types'),
  create: (data) => axiosClient.post('/leave-types', data),
  update: (id, data) => axiosClient.put(`/leave-types/${id}`, data),
  remove: (id) => axiosClient.delete(`/leave-types/${id}`),
};