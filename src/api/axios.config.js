//src/api/axios.config.js
import axios from "axios";
import { API_BASE_URL, SESSION, MESSAGES } from "@utils/constants";
import { parseError, isAuthError, logError } from "@utils/errorHandler";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const createCancelToken = () => {
    return axios.CancelToken.source();
};

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(SESSION.TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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

apiClient.interceptors.response.use(
    (response) => {
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
        logError(error, "Response Interceptor");
        if (isAuthError(error) && !originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.removeItem(SESSION.TOKEN_KEY);
            localStorage.removeItem(SESSION.USER_KEY);
            console.log("Token no guardado en la local store, redirigendo al /login")
            return Promise.reject(error);
        }
        if (error.response?.status === 403) {
            console.warn("Acceso denegado:", error.config.url);
        }
        if (error.response?.status >= 500) {
            console.error("Error del servidor:", error.response.data);
        }
        const parsedError = parseError(error);
        error.parsedError = parsedError;
        return Promise.reject(error);
    }
);

export const get = async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
};

export const post = async (url, data = {}, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
};

export const put = async (url, data = {}, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
};

export const patch = async (url, data = {}, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
};

export const del = async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
};

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

export const download = async (url, filename, config = {}) => {
    try {
        const response = await apiClient.get(url, {
            ...config,
            responseType: "blob",
        });
        const contentDisposition = response.headers['content-disposition'];
        if (!filename && contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) filename = filenameMatch[1];
        }
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", filename || 'download');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        return true;
    } catch (error) {
        console.error('Download error:', error);
        return false;
    }
};

export const search = async (url, params = {}, config = {}) => {
    const response = await apiClient.get(url, {
        ...config,
        params,
    });
    return response.data;
};

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

export default apiClient;