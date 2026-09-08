import axiosClient from './axiosClient';

export const systemSettingApi = {
  getAll: () => axiosClient.get('/settings'),
  getByCategory: (category) => axiosClient.get(`/settings/category/${category}`),
  getByKey: (key) => axiosClient.get(`/settings/${key}`),
  upsert: (data) => axiosClient.post('/settings', data),
  updateValue: (key, data) => axiosClient.patch(`/settings/${key}`, data),
  remove: (key) => axiosClient.delete(`/settings/${key}`),
};