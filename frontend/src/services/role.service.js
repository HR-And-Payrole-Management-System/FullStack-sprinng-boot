import { roleApi } from '../api/role.api';

export const roleService = {
  // Paginated list for the Roles table.
  async list({ page = 0, size = 10, keyword = '', sortBy = 'id', direction = 'asc' } = {}) {
    const res = await roleApi.getAll({ page, size, keyword, sortBy, direction });
    return res.data; // { content, page, size, totalElements, totalPages, first, last }
  },

  // Unpaginated — used by the "assign roles to user" picker.
  async listAll() {
    const res = await roleApi.getAll({ page: 0, size: 200 });
    return res.data?.content || [];
  },

  async getById(id) {
    const res = await roleApi.getById(id);
    return res.data;
  },

  async create({ name, description }) {
    const res = await roleApi.create({ name, description });
    return res.data;
  },

  async update(id, { name, description }) {
    const res = await roleApi.update(id, { name, description });
    return res.data;
  },

  async remove(id) {
    await roleApi.remove(id);
  },

  // Same diff-and-sync approach as syncRoles — backend has no
  // "replace all permissions" endpoint, only add-batch / remove-one.
  async syncPermissions(roleId, currentPermissionIds, nextPermissionIds) {
    const toAdd = nextPermissionIds.filter((id) => !currentPermissionIds.includes(id));
    const toRemove = currentPermissionIds.filter((id) => !nextPermissionIds.includes(id));

    if (toAdd.length) {
      await roleApi.assignPermissions(roleId, toAdd);
    }
    for (const permissionId of toRemove) {
      await roleApi.removePermission(roleId, permissionId);
    }

    const res = await roleApi.getById(roleId);
    return res.data;
  },
};