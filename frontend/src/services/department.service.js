import { departmentApi } from '../api/department.api';

export const departmentService = {
  async list() {
    const res = await departmentApi.getAll();
    return res.data || [];
  },

  // Department create only accepts name+description; company/branch
  // assignment is a separate call — chain them here so the form only
  // needs one submit handler.
  async create({ name, description, companyId, branchId }) {
    const created = await departmentApi.create({ name, description });
    if (companyId && branchId) {
      const res = await departmentApi.assignOrganization(created.data.id, { companyId, branchId });
      return res.data;
    }
    return created.data;
  },

  async update(id, { name, description, companyId, branchId }) {
    await departmentApi.update(id, { name, description });
    if (companyId && branchId) {
      const res = await departmentApi.assignOrganization(id, { companyId, branchId });
      return res.data;
    }
    const res = await departmentApi.getById(id);
    return res.data;
  },

  async remove(id) {
    await departmentApi.remove(id);
  },
    async uploadLogo(id, file) {
    const res = await departmentApi.uploadLogo(id, file);
    return res.data;
  },
};