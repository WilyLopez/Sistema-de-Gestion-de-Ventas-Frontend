import { get, post, put, del, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const UsuarioService = {
    create: async (userData) => {
        try {
            const response = await post(ENDPOINTS.USUARIOS.BASE, userData);
            console.log('Respuesta al crear usuario:', response);
            return response;
        } catch (error) {
            console.error('Error en create:', error.response?.data || error.message);
            throw error;
        }
    },

    update: async (id, userData) => {
        const response = await put(ENDPOINTS.USUARIOS.BY_ID(id), userData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.USUARIOS.BY_ID(id));
    },

    activate: async (id) => {
        await put(ENDPOINTS.USUARIOS.ACTIVAR(id));
    },

    deactivate: async (id) => {
        await put(ENDPOINTS.USUARIOS.DESACTIVAR(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.USUARIOS.BY_ID(id));
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.USUARIOS.BASE, page, size);
        return response;
    },

    getByEstado: async (estado, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.USUARIOS.BY_ESTADO(estado),
            page,
            size
        );
        return response;
    },

    buscar: async (nombre, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.USUARIOS.BUSCAR,
            page,
            size,
            { nombre }
        );
        return response;
    },

    cambiarContrasena: async (id, contrasenaActual, contrasenaNueva, confirmarContrasena) => {
        const response = await put(ENDPOINTS.USUARIOS.CAMBIAR_CONTRASENA(id), {
            contrasenaActual,
            contrasenaNueva,
            confirmarContrasena
        });
        return response;
    },

    getProfile: async () => {
        const response = await get(ENDPOINTS.USUARIOS.PERFIL);
        return response;
    },

    getStatistics: async () => {
        const response = await get(ENDPOINTS.USUARIOS.ESTADISTICAS);
        return response;
    },

    existeUsername: async (username) => {
        try {
            await get(`/api/usuarios/username/${username}`);
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    },

    existeCorreo: async (correo) => {
        try {
            await get(`/api/usuarios/correo/${correo}`);
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    }
};

export default UsuarioService;