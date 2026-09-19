import axiosClient from './axiosClient';

export const announcementApi = {
  create: (data) => axiosClient.post('/announcements', data),
  getAll: () => axiosClient.get('/announcements'),
  deactivate: (id) => axiosClient.delete(`/announcements/${id}`),
};