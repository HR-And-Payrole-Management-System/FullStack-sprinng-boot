import axiosClient from './axiosClient';

export const benefitApi = {
  getRules: () => axiosClient.get('/benefits/rules'),
  createRule: (data) => axiosClient.post('/benefits/rules', data),
  deactivateRule: (id) => axiosClient.delete(`/benefits/rules/${id}`),
  enroll: (data) => axiosClient.post('/benefits/enroll', data),
  waive: (enrollmentId) => axiosClient.put(`/benefits/enrollments/${enrollmentId}/waive`),
  getByEmployee: (employeeId) => axiosClient.get(`/benefits/employee/${employeeId}`),
};