import { useState, useEffect } from "react";

// Hook para hacer debounce de un valor
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Establecer timeout para actualizar el valor después del delay
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar timeout si el valor cambia antes del delay
        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
};
