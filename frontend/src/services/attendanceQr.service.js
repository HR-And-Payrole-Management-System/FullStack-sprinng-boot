import { attendanceQrApi } from '../api/attendanceQr.api';

export const attendanceQrService = {
  async getToken(branchId) {
    const res = await attendanceQrApi.getToken(branchId);
    return res.data;
  },
  async scan(token) {
    const res = await attendanceQrApi.scan(token);
    return res.data;
  },
};