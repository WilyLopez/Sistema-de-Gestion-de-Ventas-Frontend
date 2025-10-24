import { post, get } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";
import userService from "./userService";

// Servicio de autenticación
const authService = {
    /**
     * Login de usuario
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} Respuesta con token y datos del usuario
     */
    login: async (username, password) => {
        const response = await post(ENDPOINTS.AUTH.LOGIN, {
            username,
            password,
        });
        return response;
    },

    /**
     * Registrar nuevo usuario
     * @param {Object} userData - Datos del usuario a registrar
     * @param {string} userData.username - Nombre de usuario (3-50 caracteres)
     * @param {string} userData.nombre - Nombre (max 50 caracteres)
     * @param {string} userData.apellido - Apellido (max 50 caracteres)
     * @param {string} userData.email - Email válido (max 100 caracteres)
     * @param {string} userData.password - Contraseña (min 6 caracteres)
     * @param {string} [userData.telefono] - Teléfono opcional (max 20 caracteres)
     * @param {string} [userData.direccion] - Dirección opcional (max 150 caracteres)
     * @returns {Promise<Object>} Respuesta con mensaje de confirmación
     */
    register: async (userData) => {
        const response = await post(ENDPOINTS.AUTH.REGISTER, userData);
        return response;
    },

    /**
     * Validar token JWT
     * @param {string} token - Token JWT a validar
     * @returns {Promise<Object>} Respuesta con resultado de validación
     */
    validateToken: async (token) => {
        const response = await get(ENDPOINTS.AUTH.VALIDATE, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    },

    /**
     * Renovar token JWT
     * @param {string} token - Token JWT actual válido
     * @returns {Promise<Object>} Respuesta con nuevo token
     */
    refreshToken: async (token) => {
        const response = await post(
            ENDPOINTS.AUTH.REFRESH,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    },

    /**
     * Cerrar sesión
     * @returns {Promise<Object>} Respuesta con mensaje de confirmación
     */
    logout: async () => {
        const response = await post(ENDPOINTS.AUTH.LOGOUT);
        return response;
    },

    /**
     * Cambiar contraseña del usuario actual
     * Wrapper que utiliza userService.changePassword()
     * @param {number} userId - ID del usuario
     * @param {string} contrasenaActual - Contraseña actual
     * @param {string} contrasenaNueva - Nueva contraseña
     * @param {string} confirmarContrasena - Confirmación de contraseña
     * @returns {Promise<Object>} Mensaje de confirmación
     */
    changePassword: async (
        userId,
        contrasenaActual,
        contrasenaNueva,
        confirmarContrasena
    ) => {
        return await userService.changePassword(
            userId,
            contrasenaActual,
            contrasenaNueva,
            confirmarContrasena
        );
    },
};

export default authService;
