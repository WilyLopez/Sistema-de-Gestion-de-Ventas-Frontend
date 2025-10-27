// src/hooks/useToastContext.js
import { useContext } from 'react';
import { ToastContext } from '@context/ToastContext';

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