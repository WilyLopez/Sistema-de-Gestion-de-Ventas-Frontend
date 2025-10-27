// src/hooks/useApi.js
import { useState, useCallback } from "react";
import { getErrorMessage } from "@utils/errorHandler";

// Hook genérico para manejar llamadas a la API
export const useApi = (apiFunction) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Ejecutar la función de API
    const execute = useCallback(
        async (...params) => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await apiFunction(...params);
                setData(response);

                return { success: true, data: response };
            } catch (err) {
                const errorMessage = getErrorMessage(err);
                setError(errorMessage);

                return { success: false, error: errorMessage };
            } finally {
                setIsLoading(false);
            }
        },
        [apiFunction]
    );

    // Resetear estado
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        error,
        isLoading,
        execute,
        reset,
    };
};
