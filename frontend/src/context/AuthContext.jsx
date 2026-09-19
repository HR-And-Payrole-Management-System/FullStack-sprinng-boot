// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storageService.hasToken()) {
      setLoading(false);
      return;
    }

    authService
      .fetchCurrentUser()
      .then(setUser)
      .catch(() => storageService.clearTokens())
      .finally(() => setLoading(false));
  }, []);

  // Step 1: ត្រឡប់ OTP challenge — មិនទាន់ login ពិត
  const login = async (email, password) => {
    return authService.login(email, password);
  };

  // Step 3: ចប់ login ដោយប្រើ OTP
  const verifyOtp = async (preAuthToken, otpCode) => {
    const loggedInUser = await authService.verifyOtp(preAuthToken, otpCode);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const resendOtp = async (preAuthToken) => {
    await authService.resendOtp(preAuthToken);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // ⬅️ ត្រូវបន្ថែម function នេះ មុននឹងដាក់ចូល value
  const refreshUser = async () => {
    const updated = await authService.fetchCurrentUser();
    setUser(updated);
  };

  const hasRole = (roleName) => user?.roles?.includes(roleName) ?? false;
  const hasPermission = (permName) => user?.permissions?.includes(permName) ?? false;

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    verifyOtp,
    resendOtp,
    logout,
    hasRole,
    hasPermission,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}