import { createContext, useCallback, useMemo, useState } from 'react';

export const ToastContext = createContext();

let toastSeed = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `${Date.now()}-${toastSeed++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const value = useMemo(() => ({
    toasts,
    showToast,
    removeToast,
  }), [toasts, showToast, removeToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
