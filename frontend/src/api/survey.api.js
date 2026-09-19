import axiosClient from './axiosClient';

export const surveyApi = {
  getAll: () => axiosClient.get('/surveys'),
  getPending: (employeeId) => axiosClient.get('/surveys/pending', { params: { employeeId } }),
  getResults: (id) => axiosClient.get(`/surveys/${id}/results`),
  create: (data) => axiosClient.post('/surveys', data),
  activate: (id) => axiosClient.put(`/surveys/${id}/activate`),
  submitResponse: (id, data) => axiosClient.post(`/surveys/${id}/responses`, data),
  getDetail: (id) => axiosClient.get(`/surveys/${id}`),
  update: (id, data) => axiosClient.put(`/surveys/${id}`, data),
  remove: (id) => axiosClient.delete(`/surveys/${id}`),
  exportCsv: (id) => axiosClient.get(`/surveys/${id}/export`, { responseType: 'blob' }),
};