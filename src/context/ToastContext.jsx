import { createContext, useContext } from 'react';
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

/**
 * Hook para usar el contexto de Toast
 */
export const useToastContext = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToastContext debe ser usado dentro de ToastProvider');
    }

    return context;
};
