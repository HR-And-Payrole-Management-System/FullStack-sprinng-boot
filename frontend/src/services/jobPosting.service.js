import { jobPostingApi } from '../api/jobPosting.api';

export const jobPostingService = {
  async list() {
    const res = await jobPostingApi.getAll();
    return res.data || [];
  },

  async create({ title, departmentId, positionId, employmentType, description, requirements, openings, postedDate, closingDate }) {
    const res = await jobPostingApi.create({
      title,
      departmentId: departmentId ? Number(departmentId) : null,
      positionId: positionId ? Number(positionId) : null,
      employmentType,
      description,
      requirements,
      openings: Number(openings),
      postedDate: postedDate || null,
      closingDate: closingDate || null,
    });
    return res.data;
  },

  async update(id, { title, departmentId, positionId, employmentType, description, requirements, openings, postedDate, closingDate, status }) {
    const res = await jobPostingApi.update(id, {
      title,
      departmentId: departmentId ? Number(departmentId) : null,
      positionId: positionId ? Number(positionId) : null,
      employmentType,
      description,
      requirements,
      openings: Number(openings),
      postedDate: postedDate || null,
      closingDate: closingDate || null,
      status: status || null,
    });
    return res.data;
  },

  async remove(id) {
    await jobPostingApi.remove(id);
  },
};