import { branchApi } from '../api/branch.api';

export const branchService = {
  async list() {
    const res = await branchApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await branchApi.create(payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await branchApi.update(id, payload);
    return res.data;
  },
  async remove(id) {
    await branchApi.remove(id);
  },
  async uploadLogo(id, file) {
    const res = await branchApi.uploadLogo(id, file);
    return res.data;
  },
};