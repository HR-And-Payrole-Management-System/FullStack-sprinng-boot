import axiosClient from './axiosClient';

export const departmentApi = {
  getAll: () => axiosClient.get('/departments'),
  getById: (id) => axiosClient.get(`/departments/${id}`),
  getByCompanyId: (companyId) => axiosClient.get(`/departments/company/${companyId}`),
  getByBranchId: (branchId) => axiosClient.get(`/departments/branch/${branchId}`),
  create: (data) => axiosClient.post('/departments', data),
  update: (id, data) => axiosClient.put(`/departments/${id}`, data),
  assignOrganization: (id, data) => axiosClient.put(`/departments/${id}/organization`, data),
  remove: (id) => axiosClient.delete(`/departments/${id}`),
  uploadLogo: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/departments/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};