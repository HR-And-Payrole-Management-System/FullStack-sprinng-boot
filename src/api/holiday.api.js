import axiosClient from './axiosClient';

export const holidayApi = {
  getAll: () => axiosClient.get('/holidays'),
  getById: (id) => axiosClient.get(`/holidays/${id}`),
  getByRange: (startDate, endDate) => axiosClient.get('/holidays/range', { params: { startDate, endDate } }),
  create: (data) => axiosClient.post('/holidays', data),
  update: (id, data) => axiosClient.put(`/holidays/${id}`, data),
  remove: (id) => axiosClient.delete(`/holidays/${id}`),
};