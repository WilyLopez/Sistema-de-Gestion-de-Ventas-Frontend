import api from "./api";

const authService = {
    // Login
    login: async (username, password) => {
        const response = await api.post("/auth/login", {
            username,
            password,
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    // Validate token
    validateToken: async () => {
        try {
            const response = await api.get("/auth/validate");
            return response.data;
        } catch (error) {
            console.error("Error validando token: ", error)
            return null;
        }
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post("/auth/refresh");
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },
};

export default authService;
