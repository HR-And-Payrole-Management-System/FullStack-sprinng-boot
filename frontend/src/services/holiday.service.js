import { holidayApi } from '../api/holiday.api';

export const holidayService = {
  async list() {
    const res = await holidayApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await holidayApi.create(payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await holidayApi.update(id, payload);
    return res.data;
  },
  async remove(id) {
    await holidayApi.remove(id);
  },
};