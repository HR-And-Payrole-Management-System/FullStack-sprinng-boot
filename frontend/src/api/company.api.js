import axiosClient from './axiosClient';

export const companyApi = {
  list: () => axiosClient.get('/companies'),
  getById: (id) => axiosClient.get(`/companies/${id}`),
  create: (data) => axiosClient.post('/companies', data),
  update: (id, data) => axiosClient.put(`/companies/${id}`, data),
  remove: (id) => axiosClient.delete(`/companies/${id}`),
  uploadLogo: (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post(`/companies/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},
};