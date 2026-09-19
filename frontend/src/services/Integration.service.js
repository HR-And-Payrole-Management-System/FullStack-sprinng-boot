import { integrationApi } from '../api/integration.api';

export const integrationService = {
  async list() {
    const res = await integrationApi.getAll();
    return res.data || [];
  },

  async summary() {
    const res = await integrationApi.getSummary();
    return res.data || { total: 0, connected: 0, disconnected: 0 };
  },

  async connect(id, { apiKey, webhookUrl }) {
    const res = await integrationApi.connect(id, { apiKey: apiKey || null, webhookUrl: webhookUrl || null });
    return res.data;
  },

  async disconnect(id) {
    const res = await integrationApi.disconnect(id);
    return res.data;
  },

  async remove(id) {
    await integrationApi.remove(id);
  },
};