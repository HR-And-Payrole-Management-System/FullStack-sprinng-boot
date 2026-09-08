import axiosClient from './axiosClient';

export const auditLogApi = {
  getAll: () => axiosClient.get('/audit-logs'),
  getByActor: (actor) => axiosClient.get('/audit-logs/actor', { params: { actor } }),
  getByEntity: (entityType, entityId) =>
    axiosClient.get(`/audit-logs/entity/${entityType}/${entityId}`),
};