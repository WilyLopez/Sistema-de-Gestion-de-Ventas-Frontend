import axios from "axios";
import { API_BASE_URL, SESSION, MESSAGES } from "@utils/constants";
import { parseError, isAuthError, logError } from "@utils/errorHandler";

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 segundos
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptor de Request: Agregar token JWT a cada petición
apiClient.interceptors.request.use(
    (config) => {
        // Obtener token del localStorage
        const token = localStorage.getItem(SESSION.TOKEN_KEY);

        // Si existe token, agregarlo al header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log en modo debug
        if (import.meta.env.VITE_DEBUG_MODE === "true") {
            console.log("Request:", {
                method: config.method.toUpperCase(),
                url: config.url,
                data: config.data,
                headers: config.headers,
            });
        }

        return config;
    },
    (error) => {
        logError(error, "Request Interceptor");
        return Promise.reject(error);
    }
);

// Interceptor de Response: Manejar respuestas y errores
apiClient.interceptors.response.use(
    (response) => {
        // Log en modo debug
        if (import.meta.env.VITE_DEBUG_MODE === "true") {
            console.log("Response:", {
                status: response.status,
                data: response.data,
                url: response.config.url,
            });
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log del error
        logError(error, "Response Interceptor");

        // Error 401: Token expirado o inválido
        if (isAuthError(error) && !originalRequest._retry) {
            originalRequest._retry = true;

            // Limpiar sesión
            localStorage.removeItem(SESSION.TOKEN_KEY);
            localStorage.removeItem(SESSION.USER_KEY);

            // Redirigir a login
            window.location.href = "/login";

            return Promise.reject(error);
        }

        // Error 403: Sin permisos
        if (error.response?.status === 403) {
            // Opcionalmente redirigir a página de no autorizado
            // window.location.href = '/unauthorized';
        }

        // Error 500+: Error del servidor
        if (error.response?.status >= 500) {
            console.error("Error del servidor:", error.response.data);
        }

        // Parsear error para obtener mensaje amigable
        const parsedError = parseError(error);

        // Adjuntar error parseado al objeto error
        error.parsedError = parsedError;

        return Promise.reject(error);
    }
);

// Funciones helper para peticiones

// GET request
export const get = async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
};

// POST request
export const post = async (url, data = {}, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
};

// PUT request
export const put = async (url, data = {}, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
};

// PATCH request
export const patch = async (url, data = {}, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
};

// DELETE request
export const del = async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
};

// Upload de archivos (multipart/form-data)
export const upload = async (url, formData, config = {}) => {
    const response = await apiClient.post(url, formData, {
        ...config,
        headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Download de archivos (blob)
export const download = async (url, filename, config = {}) => {
    const response = await apiClient.get(url, {
        ...config,
        responseType: "blob",
    });

    // Crear enlace temporal para descargar
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);

    return true;
};

// Request con params de búsqueda
export const search = async (url, params = {}, config = {}) => {
    const response = await apiClient.get(url, {
        ...config,
        params,
    });
    return response.data;
};

// Request con paginación
export const paginated = async (
    url,
    page = 0,
    size = 20,
    params = {},
    config = {}
) => {
    const response = await apiClient.get(url, {
        ...config,
        params: {
            page,
            size,
            ...params,
        },
    });
    return response.data;
};

// Exportar instancia de Axios configurada
export default apiClient;
