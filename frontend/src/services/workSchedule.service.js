import { workScheduleApi } from '../api/workSchedule.api';

export const workScheduleService = {
  async list() {
    const res = await workScheduleApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await workScheduleApi.create(payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await workScheduleApi.update(id, payload);
    return res.data;
  },
  async remove(id) {
    await workScheduleApi.remove(id);
  },
    async assignToEmployee(employeeId, payload) {
    const res = await workScheduleApi.assignToEmployee(employeeId, payload);
    return res.data;
  },
  async getEmployeeAssignments(employeeId) {
    const res = await workScheduleApi.getEmployeeAssignments(employeeId);
    return res.data || [];
  },
  async removeAssignment(id) {
    await workScheduleApi.removeAssignment(id);
  },
};