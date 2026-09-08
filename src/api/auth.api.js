import axiosClient from './axiosClient';
import { getDeviceId } from '../utils/device';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  verifyOtp: (data) =>
    axiosClient.post('/auth/verify-otp', data, {
      headers: { 'X-Device-Id': getDeviceId() },
    }),
  resendOtp: (data) => axiosClient.post('/auth/resend-otp', data),
  register: (data) => axiosClient.post('/auth/register', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken) =>
    axiosClient.post('/auth/refresh-token', { refreshToken }),
  me: () => axiosClient.get('/auth/me'),
};