import axiosClient from './axiosClient';

export const salaryStructureApi = {
  getAll: () => axiosClient.get('/salary-structures'),
  create: (data) => axiosClient.post('/salary-structures', data),
};