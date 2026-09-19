import { applicationApi } from '../api/application.api';

export const applicationService = {
  async list() {
    const res = await applicationApi.getAll();
    return res.data || [];
  },

  async listByPosting(jobPostingId) {
    const res = await applicationApi.getByPosting(jobPostingId);
    return res.data || [];
  },

  async listByCandidate(candidateId) {
    const res = await applicationApi.getByCandidate(candidateId);
    return res.data || [];
  },

  async create({ candidateId, jobPostingId, appliedDate, notes }) {
    const res = await applicationApi.create({
      candidateId: Number(candidateId),
      jobPostingId: Number(jobPostingId),
      appliedDate: appliedDate || null,
      notes,
    });
    return res.data;
  },

  async updateStage(id, { stage, notes }) {
    const res = await applicationApi.updateStage(id, { stage, notes });
    return res.data;
  },

  async remove(id) {
    await applicationApi.remove(id);
  },
};