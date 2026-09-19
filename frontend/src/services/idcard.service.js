import { idCardApi } from '../api/idcard.api';

export const idCardService = {
  // Returns null if the employee doesn't have a card issued yet, instead of throwing —
  // callers can use this to decide whether to show an "Issue Card" action.
  async getByEmployee(employeeId) {
    try {
      const res = await idCardApi.getByEmployee(employeeId);
      return res.data;
    } catch {
      return null;
    }
  },

  async create(employeeId, payload) {
    const res = await idCardApi.create(employeeId, payload);
    return res.data;
  },

  async list({ page = 0, size = 8, status } = {}) {
    const res = await idCardApi.getAll({ page, size, status: status || undefined });
    return res.data; // PageResponse<IdCardResponse>
  },

  async update(id, payload) {
    const res = await idCardApi.update(id, payload);
    return res.data;
  },

  async remove(id) {
    await idCardApi.remove(id);
  },
};