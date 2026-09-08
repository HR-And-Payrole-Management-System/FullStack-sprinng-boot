// A tiny pub/sub so non-React code (like the axios interceptor) can
// trigger toasts without needing a React hook. ToastContext subscribes
// to this on mount; axiosClient just calls toastBus.emit(...).
let listeners = [];

export const toastBus = {
  subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  },
  emit(message, variant = 'danger') {
    listeners.forEach((fn) => fn(message, variant));
  },
};