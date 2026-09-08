import { performanceApi } from '../api/performance.api';

export const performanceService = {
  async listCycles() {
    const res = await performanceApi.getCycles();
    return res.data || [];
  },
  async createCycle(data) {
    const res = await performanceApi.createCycle(data);
    return res.data;
  },
  async activateCycle(id) {
    const res = await performanceApi.activateCycle(id);
    return res.data;
  },
  async closeCycle(id) {
    const res = await performanceApi.closeCycle(id);
    return res.data;
  },

  async listGoals(employeeId, cycleId) {
    const res = await performanceApi.getEmployeeGoals(employeeId, cycleId);
    return res.data || [];
  },
  async createGoal(employeeId, data) {
    const res = await performanceApi.createGoal(employeeId, data);
    return res.data;
  },
  async updateGoalProgress(goalId, progress) {
    const res = await performanceApi.updateGoalProgress(goalId, progress);
    return res.data;
  },

  async getReview(employeeId, cycleId) {
    try {
      const res = await performanceApi.getReview(employeeId, cycleId);
      return res.data || null;
    } catch {
      return null;
    }
  },
  async submitSelfReview(employeeId, cycleId, data) {
    const res = await performanceApi.selfReview(employeeId, cycleId, data);
    return res.data;
  },
  async submitManagerReview(employeeId, cycleId, data) {
    const res = await performanceApi.managerReview(employeeId, cycleId, data);
    return res.data;
  },
  async completeReview(employeeId, cycleId) {
    const res = await performanceApi.completeReview(employeeId, cycleId);
    return res.data;
  },
  async getHistory(employeeId) {
    const res = await performanceApi.getReviewHistory(employeeId);
    return res.data || [];
  },
};