import { positionApi } from '../api/position.api';

export const positionService = {
  async list() {
    const res = await positionApi.getAll();
    return res.data || [];
  },

  async create({ name, description, companyId, branchId, departmentId, level }) {
    const created = await positionApi.create({ name, description });
    if (companyId && branchId && departmentId && level) {
      const res = await positionApi.assignOrganization(created.data.id, { companyId, branchId, departmentId, level });
      return res.data;
    }
    return created.data;
  },

  async update(id, { name, description, companyId, branchId, departmentId, level }) {
    await positionApi.update(id, { name, description });
    if (companyId && branchId && departmentId && level) {
      const res = await positionApi.assignOrganization(id, { companyId, branchId, departmentId, level });
      return res.data;
    }
    const res = await positionApi.getById(id);
    return res.data;
  },

  async remove(id) {
    await positionApi.remove(id);
  },
};