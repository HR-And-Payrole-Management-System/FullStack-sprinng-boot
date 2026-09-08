import axiosClient from './axiosClient';

export const workScheduleApi = {
  getAll: () => axiosClient.get('/work-schedules'),
  getById: (id) => axiosClient.get(`/work-schedules/${id}`),
  create: (data) => axiosClient.post('/work-schedules', data),
  update: (id, data) => axiosClient.put(`/work-schedules/${id}`, data),
  remove: (id) => axiosClient.delete(`/work-schedules/${id}`),
};