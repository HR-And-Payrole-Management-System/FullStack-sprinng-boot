import axiosClient from './axiosClient';

export const jobPostingApi = {
  getAll: () => axiosClient.get('/recruitment/postings'),
  getById: (id) => axiosClient.get(`/recruitment/postings/${id}`),
  getByDepartmentId: (departmentId) => axiosClient.get(`/recruitment/postings/department/${departmentId}`),
  create: (data) => axiosClient.post('/recruitment/postings', data),
  update: (id, data) => axiosClient.put(`/recruitment/postings/${id}`, data),
  remove: (id) => axiosClient.delete(`/recruitment/postings/${id}`),
};