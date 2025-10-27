//src/services/RolService.js
import { get, post, put, del, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const RolService = {
    create: async (rolData) => {
        const response = await post(ENDPOINTS.ROLES.BASE, rolData);
        return response;
    },

    update: async (id, rolData) => {
        const response = await put(ENDPOINTS.ROLES.BY_ID(id), rolData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.ROLES.BY_ID(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.ROLES.BY_ID(id));
        return response;
    },

    getByNombre: async (nombre) => {
        const response = await get(ENDPOINTS.ROLES.BY_NOMBRE(nombre));
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.ROLES.BASE, page, size);
        return response;
    },

    getActive: async () => {
        const response = await get(ENDPOINTS.ROLES.ACTIVOS);
        return response;
    },

    asignarPermisos: async (id, idsPermisos) => {
        const response = await post(ENDPOINTS.ROLES.ASIGNAR_PERMISOS(id), {
            idsPermisos: idsPermisos
        });
        return response;
    },

    removerPermiso: async (id, idPermiso) => {
        await del(ENDPOINTS.ROLES.REMOVER_PERMISO(id, idPermiso));
    },

    obtenerPermisos: async (id) => {
        const response = await get(ENDPOINTS.ROLES.OBTENER_PERMISOS(id));
        return response;
    },

    tienePermiso: async (id, nombrePermiso) => {
        const response = await get(ENDPOINTS.ROLES.TIENE_PERMISO(id, nombrePermiso));
        return response.tienePermiso;
    },

    existeNombre: async (nombre) => {
        try {
            const response = await get(ENDPOINTS.ROLES.EXISTE_NOMBRE, {
                params: { nombre }
            });
            return response.existe;
        } catch (error) {
            console.warn("Error checking role name existence:", error);
            return false;
        }
    },

    getStatistics: async () => {
        const response = await get(ENDPOINTS.ROLES.ESTADISTICAS);
        return response;
    },

    validateNivelAcceso: (nivelAcceso) => {
        return nivelAcceso >= 1 && nivelAcceso <= 10;
    },

    isRolSistema: (nombreRol) => {
        const rolesSistema = ['administrador', 'vendedor', 'empleado'];
        return rolesSistema.includes(nombreRol.toLowerCase());
    }
};

export default RolService;