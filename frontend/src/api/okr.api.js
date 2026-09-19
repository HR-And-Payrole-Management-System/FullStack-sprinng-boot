import axiosClient from './axiosClient';

export const okrApi = {
  createObjective: (data) => axiosClient.post('/okr/objectives', data),
  addKeyResult: (objectiveId, data) => axiosClient.post(`/okr/objectives/${objectiveId}/key-results`, data),
  updateKeyResultProgress: (keyResultId, currentValue) =>
    axiosClient.put(`/okr/key-results/${keyResultId}/progress`, { currentValue }),
  getTopLevel: (cycleId) => axiosClient.get(`/okr/cycles/${cycleId}/objectives`),
};