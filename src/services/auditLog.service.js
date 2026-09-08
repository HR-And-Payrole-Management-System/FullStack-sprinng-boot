import { auditLogApi } from '../api/auditLog.api';

export const auditLogService = {
  async list() {
    const res = await auditLogApi.getAll();
    return res.data || [];
  },

  async listByActor(actor) {
    const res = await auditLogApi.getByActor(actor);
    return res.data || [];
  },

  async listByEntity(entityType, entityId) {
    const res = await auditLogApi.getByEntity(entityType, entityId);
    return res.data || [];
  },
};