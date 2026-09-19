import { permissionApi } from '../api/permission.api';

export const permissionService = {
  async list() {
    const res = await permissionApi.getAll();
    return res.data || [];
  },

  async create({ name, description }) {
    const res = await permissionApi.create({ name, description });
    return res.data;
  },

  async update(id, { name, description }) {
    const res = await permissionApi.update(id, { name, description });
    return res.data;
  },

  async remove(id) {
    await permissionApi.remove(id);
  },
};