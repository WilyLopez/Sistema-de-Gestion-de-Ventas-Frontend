import { useState, useCallback } from 'react';

/**
 * Hook para manejar notificaciones toast
 * Proporciona funciones para mostrar diferentes tipos de toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    
    setToasts((prev) => [
      ...prev,
      {
        id,
        duration: 5000,
        ...toast,
      },
    ]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, title = 'Éxito') => {
      return addToast({
        type: 'success',
        title,
        message,
      });
    },
    [addToast]
  );

  const error = useCallback(
    (message, title = 'Error') => {
      return addToast({
        type: 'error',
        title,
        message,
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, title = 'Advertencia') => {
      return addToast({
        type: 'warning',
        title,
        message,
      });
    },
    [addToast]
  );

  const info = useCallback(
    (message, title = 'Información') => {
      return addToast({
        type: 'info',
        title,
        message,
      });
    },
    [addToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };
};