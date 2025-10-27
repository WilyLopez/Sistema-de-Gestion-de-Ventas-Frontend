import { post, get } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";
import userService from "./UsuarioService";

const authService = {
    login: async (username, password) => {
        const response = await post(ENDPOINTS.AUTH.LOGIN, {
            username,
            password,
        });
        return response;
    },

    register: async (userData) => {
        const response = await post(ENDPOINTS.AUTH.REGISTER, userData);
        return response;
    },

    validateToken: async () => {
        const response = await get(ENDPOINTS.AUTH.VALIDATE);
        return response;
    },

    refreshToken: async () => {
        const response = await post(ENDPOINTS.AUTH.REFRESH);
        return response;
    },

    logout: async () => {
        try {
            await post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.warn('Logout backend falló:', error);
        }
        return { success: true, message: "Sesión cerrada" };
    },

    changePassword: async (userId, contrasenaActual, contrasenaNueva, confirmarContrasena) => {
        return await userService.changePassword(
            userId,
            contrasenaActual,
            contrasenaNueva,
            confirmarContrasena
        );
    },
};

export default authService;