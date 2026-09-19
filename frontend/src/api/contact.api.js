import axiosClient from './axiosClient';

export const contactApi = {
  submit: (data) => axiosClient.post('/contact', data),
};