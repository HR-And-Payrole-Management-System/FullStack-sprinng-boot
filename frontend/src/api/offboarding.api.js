import axiosClient from './axiosClient';

export const offboardingApi = {
  start: (data) => axiosClient.post('/offboarding/start', data),
  getByEmployee: (employeeId) => axiosClient.get(`/offboarding/employee/${employeeId}`),
  getActive: () => axiosClient.get('/offboarding/active'),
  completeTask: (taskId, completedByEmployeeId) =>
    axiosClient.put(`/offboarding/task/${taskId}/complete`, null, { params: { completedByEmployeeId } }),
  skipTask: (taskId) => axiosClient.put(`/offboarding/task/${taskId}/skip`),

  getCompleted: () => axiosClient.get('/offboarding/completed'),
};