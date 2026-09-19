// src/services/auth.service.js
import { authApi } from '../api/auth.api';
import { storageService } from './storage.service';

function normalizeUser(raw, source) {
  if (!raw) return null;

  if (source === 'login') {
    const roles = (raw.roles || []).map((r) => r.name);
    const permissions = (raw.roles || []).flatMap((r) =>
      (r.permissions || []).map((p) => p.name)
    );
    return { ...raw, roles, permissions };
  }

  return raw; // already normalized shape from /auth/me
}

export const authService = {
  // Step 1: credentials → OTP challenge (គ្មាន token ចេញនៅឡើយ)
  async login(email, password) {
    const res = await authApi.login({ email, password });
    return res.data; // { preAuthToken, otpExpiresInSeconds, maskedEmail }
  },

  // Step 3: OTP ត្រឹមត្រូវ → token ពិត
  async verifyOtp(preAuthToken, otpCode) {
    const res = await authApi.verifyOtp({ preAuthToken, otpCode });
    const { accessToken, refreshToken, user } = res.data;

    storageService.setTokens(accessToken, refreshToken);
    return normalizeUser(user, 'login');
  },

  async resendOtp(preAuthToken) {
    await authApi.resendOtp({ preAuthToken });
  },

  async fetchCurrentUser() {
    const res = await authApi.me();
    return normalizeUser(res.data, 'me');
  },

  async logout() {
    const refreshToken = storageService.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      storageService.clearTokens();
    }
  },
  // add this method inside the existing authService object
async register({ firstName, lastName, email, password, phone }) {
  const res = await authApi.register({ firstName, lastName, email, password, phone });
  return res.data; // UserResponse — no tokens issued at this stage
},
  async forgotPassword(email) {
    await authApi.forgotPassword({ email });
  },

  async resetPassword(token, newPassword, confirmPassword) {
    await authApi.resetPassword({ token, newPassword, confirmPassword });
  },
  async changePassword(currentPassword, newPassword, confirmPassword) {
  await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
},
};