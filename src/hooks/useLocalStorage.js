import { useState, useEffect } from "react";

// Hook para persistir estado en localStorage
export const useLocalStorage = (key, initialValue) => {
    // Obtener valor inicial del localStorage o usar el valor por defecto
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error al leer localStorage:", error);
            return initialValue;
        }
    });

    // Actualizar localStorage cuando el estado cambie
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
        }
    }, [key, storedValue]);

    // Función para actualizar el valor
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (error) {
            console.error("Error al actualizar localStorage:", error);
        }
    };

    // Función para eliminar el valor
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error("Error al eliminar de localStorage:", error);
        }
    };

    return [storedValue, setValue, removeValue];
};
