import axiosClient from './axiosClient';

export const positionApi = {
  getAll: () => axiosClient.get('/positions'),
  getById: (id) => axiosClient.get(`/positions/${id}`),
  getByCompanyId: (companyId) => axiosClient.get(`/positions/company/${companyId}`),
  getByBranchId: (branchId) => axiosClient.get(`/positions/branch/${branchId}`),
  getByDepartmentId: (departmentId) => axiosClient.get(`/positions/department/${departmentId}`),
  create: (data) => axiosClient.post('/positions', data),
  update: (id, data) => axiosClient.put(`/positions/${id}`, data),
  assignOrganization: (id, data) => axiosClient.put(`/positions/${id}/organization`, data),
  remove: (id) => axiosClient.delete(`/positions/${id}`),
};