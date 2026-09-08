// src/api/notification.api.js
import axiosClient from './axiosClient';

export const notificationApi = {
  getByEmployee: (employeeId) =>
    axiosClient.get(`/notifications/employees/${employeeId}`),
  markRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllRead: (employeeId) =>
    axiosClient.put(`/notifications/employees/${employeeId}/read-all`),
  remove: (id) => axiosClient.delete(`/notifications/${id}`),
};