import axios from 'axios';
import { storageService } from '../services/storage.service';
import { toastBus } from '../services/toastBus';
import { extractErrorMessage } from '../utils/errorMessage';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = storageService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isOn401 = status === 401;
    const alreadyOnLogin = window.location.pathname === '/login';

    if (isOn401 && !alreadyOnLogin) {
      storageService.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Network error (backend down, CORS, no internet)
    if (!error.response) {
      toastBus.emit('មិនអាចភ្ជាប់ទៅ Server បានទេ — សូមពិនិត្យ Internet', 'danger');
      return Promise.reject(error);
    }

    // 403 — permission denied (silent-ish, page-level UI usually hides the action already)
    if (status === 403) {
      toastBus.emit('អ្នកគ្មានសិទ្ធិធ្វើសកម្មភាពនេះទេ', 'danger');
      return Promise.reject(error);
    }

    // 500 — server error, always surface (component-level catch can still add specifics)
    if (status >= 500) {
      toastBus.emit('Server មានបញ្ហា សូមទាក់ទង Admin', 'danger');
      return Promise.reject(error);
    }

    // 400/404/409 etc — let the calling component decide the message via
    // extractErrorMessage() in its own catch block (keeps context-specific
    // wording like "មិនអាចលុបបានទេ"). We don't double-toast here.
    return Promise.reject(error);
  }
);

export default axiosClient;