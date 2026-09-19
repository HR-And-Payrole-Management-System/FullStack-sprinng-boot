import { userApi } from '../api/user.api';

export const userService = {
  async list(keyword = '') {
    const res = await userApi.search(keyword);
    return res.data || [];
  },

  async getById(id) {
    const res = await userApi.getById(id);
    return res.data;
  },

  // Backend only exposes "add a batch of roles" and "remove one role" —
  // diff current vs. next selection and call the right endpoints.
  async syncRoles(userId, currentRoleIds, nextRoleIds) {
    const toAdd = nextRoleIds.filter((id) => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter((id) => !nextRoleIds.includes(id));

    if (toAdd.length) {
      await userApi.assignRoles(userId, toAdd);
    }
    for (const roleId of toRemove) {
      await userApi.removeRole(userId, roleId);
    }

    const res = await userApi.getById(userId);
    return res.data;
  },
};