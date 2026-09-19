import axiosClient from './axiosClient';

export const attendanceQrApi = {
  getToken: (branchId) => axiosClient.get(`/attendances/qr/branches/${branchId}/token`),
  scan: (token) => axiosClient.post('/attendances/qr/scan', { token }),
};