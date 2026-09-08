import axiosClient from './axiosClient';

export const performanceApi = {
  // Cycles
  createCycle: (data) => axiosClient.post('/performance-cycles', data),
  getCycles: () => axiosClient.get('/performance-cycles'),
  activateCycle: (id) => axiosClient.put(`/performance-cycles/${id}/activate`),
  closeCycle: (id) => axiosClient.put(`/performance-cycles/${id}/close`),

  // Goals
  createGoal: (employeeId, data) => axiosClient.post(`/performance-goals/employees/${employeeId}`, data),
  updateGoalProgress: (goalId, progress) =>
    axiosClient.put(`/performance-goals/${goalId}/progress`, { progress }),
  getEmployeeGoals: (employeeId, cycleId) =>
    axiosClient.get(`/performance-goals/employees/${employeeId}/cycles/${cycleId}`),

  // Reviews
  selfReview: (employeeId, cycleId, data) =>
    axiosClient.put(`/performance-reviews/employees/${employeeId}/cycles/${cycleId}/self-review`, data),
  managerReview: (employeeId, cycleId, data) =>
    axiosClient.put(`/performance-reviews/employees/${employeeId}/cycles/${cycleId}/manager-review`, data),
  completeReview: (employeeId, cycleId) =>
    axiosClient.put(`/performance-reviews/employees/${employeeId}/cycles/${cycleId}/complete`),
  getReview: (employeeId, cycleId) =>
    axiosClient.get(`/performance-reviews/employees/${employeeId}/cycles/${cycleId}`),
  getReviewHistory: (employeeId) =>
    axiosClient.get(`/performance-reviews/employees/${employeeId}/history`),
};