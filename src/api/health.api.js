import axiosClient from './axiosClient';

export const testConnection = () => axiosClient.get('/dashboard/summary');