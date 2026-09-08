import { leaveTypeApi } from '../api/leaveType.api';

export const leaveTypeService = {
  async list() {
    const res = await leaveTypeApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await leaveTypeApi.create(payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await leaveTypeApi.update(id, payload);
    return res.data;
  },
  async remove(id) {
    await leaveTypeApi.remove(id);
  },
};