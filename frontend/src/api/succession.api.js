import axiosClient from './axiosClient';

export const successionApi = {
  getAll: () => axiosClient.get('/succession/key-positions'),
  getAtRisk: () => axiosClient.get('/succession/key-positions/at-risk'),
  createKeyPosition: (data) => axiosClient.post('/succession/key-positions', data),
  addCandidate: (keyPositionId, data) => axiosClient.post(`/succession/key-positions/${keyPositionId}/candidates`, data),
  updateKeyPosition: (id, data) => axiosClient.put(`/succession/key-positions/${id}`, data),
    deleteKeyPosition: (id) => axiosClient.delete(`/succession/key-positions/${id}`),
    updateCandidate: (candidateId, data) => axiosClient.put(`/succession/candidates/${candidateId}`, data),
    deleteCandidate: (candidateId) => axiosClient.delete(`/succession/candidates/${candidateId}`),
};