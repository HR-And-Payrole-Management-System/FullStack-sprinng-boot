import axiosClient from './axiosClient';

export const applicationApi = {
  getAll: () => axiosClient.get('/recruitment/applications'),
  getById: (id) => axiosClient.get(`/recruitment/applications/${id}`),
  getByPosting: (jobPostingId) => axiosClient.get(`/recruitment/applications/posting/${jobPostingId}`),
  getByCandidate: (candidateId) => axiosClient.get(`/recruitment/applications/candidate/${candidateId}`),
  create: (data) => axiosClient.post('/recruitment/applications', data),
  updateStage: (id, data) => axiosClient.patch(`/recruitment/applications/${id}/stage`, data),
  remove: (id) => axiosClient.delete(`/recruitment/applications/${id}`),
};