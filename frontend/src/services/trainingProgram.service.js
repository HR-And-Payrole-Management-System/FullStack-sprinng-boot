import { trainingProgramApi } from '../api/trainingProgram.api';

const buildPayload = ({ title, description, provider, durationHours, startDate, endDate, status }) => ({
  title,
  description,
  provider,
  durationHours: durationHours ? Number(durationHours) : null,
  startDate: startDate || null,
  endDate: endDate || null,
  status: status || null,
});

export const trainingProgramService = {
  async list() {
    const res = await trainingProgramApi.getAll();
    return res.data || [];
  },

  async create(values) {
    const res = await trainingProgramApi.create(buildPayload(values));
    return res.data;
  },

  async update(id, values) {
    const res = await trainingProgramApi.update(id, buildPayload(values));
    return res.data;
  },

  async remove(id) {
    await trainingProgramApi.remove(id);
  },
};