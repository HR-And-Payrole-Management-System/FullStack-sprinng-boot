import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';
import { toastBus } from '../services/toastBus';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Let axiosClient (and any non-React code) trigger toasts globally.
  useEffect(() => {
    return toastBus.subscribe(showToast);
  }, [showToast]);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1080 }}>
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.variant} onClose={() => removeToast(t.id)} autohide delay={4000}>
            <Toast.Header closeButton>
              <strong className="me-auto">
                {t.variant === 'danger' ? 'Error' : t.variant === 'success' ? 'Success' : 'Notice'}
              </strong>
            </Toast.Header>
            <Toast.Body className={t.variant === 'danger' || t.variant === 'success' ? 'text-white' : ''}>
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}