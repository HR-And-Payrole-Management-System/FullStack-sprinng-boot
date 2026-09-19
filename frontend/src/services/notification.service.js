// src/services/notification.service.js
import { notificationApi } from '../api/notification.api';

export const notificationService = {
  async fetchForEmployee(employeeId) {
    if (!employeeId) return [];
    const res = await notificationApi.getByEmployee(employeeId);
    return res.data || [];
  },

  async markRead(id) {
    await notificationApi.markRead(id);
  },

  countUnread(notifications) {
    return notifications.filter((n) => !n.read).length;
  },
  async markAllRead(employeeId) {
  await notificationApi.markAllRead(employeeId);
},

async remove(id) {
  await notificationApi.remove(id);
},
};