import { candidateApi } from '../api/candidate.api';

const buildPayload = ({ firstName, lastName, email, phone, resumeUrl, resumeFileName, source, notes }) => ({
  firstName,
  lastName,
  email,
  phone,
  resumeUrl,
  resumeFileName,
  source: source || null,
  notes,
});

export const candidateService = {
  async list() {
    const res = await candidateApi.getAll();
    return res.data || [];
  },

  async create(values) {
    const res = await candidateApi.create(buildPayload(values));
    return res.data;
  },

  async update(id, values) {
    const res = await candidateApi.update(id, buildPayload(values));
    return res.data;
  },

  async remove(id) {
    await candidateApi.remove(id);
  },
};