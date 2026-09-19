import axiosClient from './axiosClient';

export const offboardingTemplateApi = {
  getAll: () => axiosClient.get('/offboarding-templates'),
  create: (data) => axiosClient.post('/offboarding-templates', data),
  remove: (id) => axiosClient.delete(`/offboarding-templates/${id}`),
};