import axiosClient from './axiosClient';

export const onboardingApi = {
  start: (data) => axiosClient.post('/onboarding/start', data),
  getByEmployee: (employeeId) => axiosClient.get(`/onboarding/employee/${employeeId}`),
  getActive: () => axiosClient.get('/onboarding/active'),
  completeTask: (taskId, completedByEmployeeId) =>
    axiosClient.put(`/onboarding/task/${taskId}/complete`, null, { params: { completedByEmployeeId } }),
  skipTask: (taskId) => axiosClient.put(`/onboarding/task/${taskId}/skip`),
  getCompleted: () => axiosClient.get('/onboarding/completed'),
};