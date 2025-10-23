import { MESSAGES } from "./constants";

// Parsear error de respuesta del backend
export const parseError = (error) => {
    // Error de red
    if (!error.response) {
        return {
            message: MESSAGES.ERROR.NETWORK,
            status: null,
            details: null,
        };
    }

    const { status, data } = error.response;

    // Error 401 - No autenticado
    if (status === 401) {
        return {
            message: MESSAGES.ERROR.SESSION_EXPIRED,
            status: 401,
            details: data?.message || null,
        };
    }

    // Error 403 - No autorizado
    if (status === 403) {
        return {
            message: MESSAGES.ERROR.UNAUTHORIZED,
            status: 403,
            details: data?.message || null,
        };
    }

    // Error 404 - No encontrado
    if (status === 404) {
        return {
            message: MESSAGES.ERROR.NOT_FOUND,
            status: 404,
            details: data?.message || null,
        };
    }

    // Error 400 - Validación
    if (status === 400) {
        return {
            message: data?.message || MESSAGES.ERROR.VALIDATION,
            status: 400,
            details: data?.errors || null,
            fieldErrors: data?.fieldErrors || null,
        };
    }

    // Error 409 - Conflicto (duplicados)
    if (status === 409) {
        return {
            message: data?.message || "Ya existe un registro con esos datos",
            status: 409,
            details: null,
        };
    }

    // Error 500 - Error del servidor
    if (status >= 500) {
        return {
            message: data?.message || MESSAGES.ERROR.GENERIC,
            status: status,
            details: data?.error || null,
        };
    }

    // Otros errores
    return {
        message: data?.message || MESSAGES.ERROR.GENERIC,
        status: status,
        details: data?.error || null,
    };
};

// Obtener mensaje amigable según el error
export const getErrorMessage = (error) => {
    const parsedError = parseError(error);
    return parsedError.message;
};

// Verificar si el error es de autenticación
export const isAuthError = (error) => {
    if (!error.response) return false;
    return error.response.status === 401;
};

// Verificar si el error es de autorización
export const isAuthorizationError = (error) => {
    if (!error.response) return false;
    return error.response.status === 403;
};

// Verificar si el error es de validación
export const isValidationError = (error) => {
    if (!error.response) return false;
    return error.response.status === 400;
};

// Obtener errores de campo de validación
export const getFieldErrors = (error) => {
    const parsedError = parseError(error);
    return parsedError.fieldErrors || {};
};

// Formatear errores de campo para mostrar en formularios
export const formatFieldErrors = (fieldErrors) => {
    if (!fieldErrors || typeof fieldErrors !== "object") return {};

    const formatted = {};

    Object.keys(fieldErrors).forEach((field) => {
        const errors = fieldErrors[field];
        if (Array.isArray(errors)) {
            formatted[field] = errors.join(", ");
        } else {
            formatted[field] = errors;
        }
    });

    return formatted;
};

// Logging de errores en modo debug
export const logError = (error, context = "") => {
    if (import.meta.env.VITE_DEBUG_MODE !== "true") return;

    console.group(`Error: ${context}`);
    console.error("Error completo:", error);
    console.error("Respuesta:", error.response);
    console.error("Datos:", error.response?.data);
    console.groupEnd();
};
