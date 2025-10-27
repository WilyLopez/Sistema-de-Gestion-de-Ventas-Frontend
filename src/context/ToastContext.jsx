// src/context/ToastContext.jsx
import { createContext } from 'react';
import { useToast } from '@hooks/useToast';
import { ToastContainer } from '@components/alerts/Toast';

const ToastContext = createContext(null);

/**
 * Provider del contexto de Toast
 * Proporciona funciones para mostrar notificaciones en toda la app
 */
export const ToastProvider = ({ children }) => {
    const toast = useToast();

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
        </ToastContext.Provider>
    );
};

export { ToastContext };