import { trainingEnrollmentApi } from '../api/trainingEnrollment.api';

export const trainingEnrollmentService = {
  async list() {
    const res = await trainingEnrollmentApi.getAll();
    return res.data || [];
  },

  async create({ employeeId, trainingProgramId, enrolledDate }) {
    const res = await trainingEnrollmentApi.create({
      employeeId: Number(employeeId),
      trainingProgramId: Number(trainingProgramId),
      enrolledDate: enrolledDate || null,
    });
    return res.data;
  },

  async update(id, { status, completionDate, score, certificateUrl }) {
    const res = await trainingEnrollmentApi.update(id, {
      status,
      completionDate: completionDate || null,
      score: score === '' || score === undefined ? null : Number(score),
      certificateUrl,
    });
    return res.data;
  },

  async remove(id) {
    await trainingEnrollmentApi.remove(id);
  },
};