import axiosClient from './axiosClient';

export const trainingEnrollmentApi = {
  getAll: () => axiosClient.get('/training/enrollments'),
  getById: (id) => axiosClient.get(`/training/enrollments/${id}`),
  getByEmployee: (employeeId) => axiosClient.get(`/training/enrollments/employee/${employeeId}`),
  getByProgram: (programId) => axiosClient.get(`/training/enrollments/program/${programId}`),
  create: (data) => axiosClient.post('/training/enrollments', data),
  update: (id, data) => axiosClient.put(`/training/enrollments/${id}`, data),
  remove: (id) => axiosClient.delete(`/training/enrollments/${id}`),
};