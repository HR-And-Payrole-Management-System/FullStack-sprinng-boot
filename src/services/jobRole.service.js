import { jobRoleApi } from '../api/jobRole.api';

export const jobRoleService = {
  async list() {
    const res = await jobRoleApi.getAll();
    return res.data || [];
  },

  async create({ name, description, responsibilities, level, departmentId }) {
    const res = await jobRoleApi.create({
      name,
      description,
      responsibilities,
      level: level || null,
      departmentId: departmentId ? Number(departmentId) : null,
    });
    return res.data;
  },

  async update(id, { name, description, responsibilities, level, departmentId, status }) {
    const res = await jobRoleApi.update(id, {
      name,
      description,
      responsibilities,
      level: level || null,
      departmentId: departmentId ? Number(departmentId) : null,
      status: status || null,
    });
    return res.data;
  },

  async remove(id) {
    await jobRoleApi.remove(id);
  },
};