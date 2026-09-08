import axiosClient from './axiosClient';

export const branchApi = {
  getAll: () => axiosClient.get('/branches'),
  getById: (id) => axiosClient.get(`/branches/${id}`),
  getByCompanyId: (companyId) => axiosClient.get(`/branches/company/${companyId}`),
  create: (data) => axiosClient.post('/branches', data),
  update: (id, data) => axiosClient.put(`/branches/${id}`, data),
  remove: (id) => axiosClient.delete(`/branches/${id}`),
  uploadLogo: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/branches/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};