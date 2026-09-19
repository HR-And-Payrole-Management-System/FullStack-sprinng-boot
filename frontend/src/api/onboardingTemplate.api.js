import axiosClient from './axiosClient';

export const onboardingTemplateApi = {
  getAll: () => axiosClient.get('/onboarding-templates'),
  getById: (id) => axiosClient.get(`/onboarding-templates/${id}`),
  create: (data) => axiosClient.post('/onboarding-templates', data),
  update: (id, data) => axiosClient.put(`/onboarding-templates/${id}`, data),
  remove: (id) => axiosClient.delete(`/onboarding-templates/${id}`),
};