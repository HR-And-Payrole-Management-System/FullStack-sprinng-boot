import { announcementApi } from '../api/announcement.api';

export const announcementService = {
  async list() {
    const res = await announcementApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await announcementApi.create(payload);
    return res.data;
  },
  async deactivate(id) {
    await announcementApi.deactivate(id);
  },
};