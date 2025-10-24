import { get, post, put, del, paginated, search } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

// Servicio de gestión de usuarios
const userService = {
    /**
     * Crear nuevo usuario (solo Admin)
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.username - Username (4-50 caracteres)
     * @param {string} userData.nombre - Nombre (max 50)
     * @param {string} userData.apellido - Apellido (max 50)
     * @param {string} userData.correo - Email válido (max 100)
     * @param {string} userData.contrasena - Contraseña (min 8 caracteres)
     * @param {string} [userData.telefono] - Teléfono opcional (max 20)
     * @param {string} [userData.direccion] - Dirección opcional (max 150)
     * @param {number} userData.idRol - ID del rol
     * @param {boolean} [userData.estado=true] - Estado del usuario
     * @returns {Promise<Object>} Usuario creado
     */
    create: async (userData) => {
        const response = await post(ENDPOINTS.USERS.BASE, userData);
        return response;
    },

    /**
     * Actualizar usuario existente (solo Admin)
     * Permite actualización parcial de campos
     * @param {number} id - ID del usuario
     * @param {Object} userData - Datos a actualizar
     * @param {string} [userData.nombre] - Nombre
     * @param {string} [userData.apellido] - Apellido
     * @param {string} [userData.correo] - Email
     * @param {string} [userData.telefono] - Teléfono
     * @param {string} [userData.direccion] - Dirección
     * @param {number} [userData.idRol] - ID del rol
     * @param {boolean} [userData.estado] - Estado
     * @returns {Promise<Object>} Usuario actualizado
     */
    update: async (id, userData) => {
        const response = await put(ENDPOINTS.USERS.BY_ID(id), userData);
        return response;
    },

    /**
     * Desactivar usuario (soft delete) (solo Admin)
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await del(ENDPOINTS.USERS.BY_ID(id));
    },

    /**
     * Activar usuario previamente desactivado (solo Admin)
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    activate: async (id) => {
        await put(ENDPOINTS.USERS.ACTIVATE(id));
    },

    /**
     * Desactivar usuario (solo Admin)
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    deactivate: async (id) => {
        await put(ENDPOINTS.USERS.DEACTIVATE(id));
    },

    /**
     * Obtener usuario por ID (solo Admin)
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Usuario encontrado
     */
    getById: async (id) => {
        const response = await get(ENDPOINTS.USERS.BY_ID(id));
        return response;
    },

    /**
     * Listar todos los usuarios con paginación (solo Admin)
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de usuarios
     */
    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.USERS.BASE, page, size);
        return response;
    },

    /**
     * Filtrar usuarios por estado con paginación (solo Admin)
     * @param {boolean} estado - Estado a filtrar (true=Activo, false=Inactivo)
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de usuarios filtrados
     */
    getByEstado: async (estado, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.USERS.BY_ESTADO,
            page,
            size,
            {
                estado,
            }
        );
        return response;
    },

    /**
     * Buscar usuarios por nombre o apellido (solo Admin)
     * @param {string} nombre - Texto a buscar
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de usuarios encontrados
     */
    searchByName: async (nombre, page = 0, size = 20) => {
        const response = await search(
            ENDPOINTS.USERS.SEARCH,
            { nombre },
            {
                params: { page, size },
            }
        );
        return response;
    },

    /**
     * Cambiar contraseña de usuario
     * Usuario normal solo puede cambiar su propia contraseña
     * Admin puede cambiar cualquier contraseña
     * @param {number} id - ID del usuario
     * @param {string} contrasenaActual - Contraseña actual
     * @param {string} contrasenaNueva - Nueva contraseña (min 8 caracteres)
     * @param {string} confirmarContrasena - Confirmación de nueva contraseña
     * @returns {Promise<Object>} Mensaje de confirmación
     */
    changePassword: async (
        id,
        contrasenaActual,
        contrasenaNueva,
        confirmarContrasena
    ) => {
        const response = await put(
            `${ENDPOINTS.USERS.BY_ID(id)}/cambiar-contrasena`,
            {
                contrasenaActual,
                contrasenaNueva,
                confirmarContrasena,
            }
        );
        return response;
    },

    /**
     * Obtener perfil del usuario actual autenticado
     * @returns {Promise<Object>} Datos del usuario actual
     */
    getProfile: async () => {
        const response = await get(`${ENDPOINTS.USERS.BASE}/perfil`);
        return response;
    },

    /**
     * Obtener estadísticas de usuarios (solo Admin)
     * @returns {Promise<Object>} Estadísticas (total, activos, inactivos)
     */
    getStatistics: async () => {
        const response = await get(`${ENDPOINTS.USERS.BASE}/estadisticas`);
        return response;
    },

    /**
     * Verificar si existe un username
     * @param {string} username - Username a verificar
     * @returns {Promise<boolean>} true si existe
     */
    existsUsername: async (username) => {
        try {
            await get(ENDPOINTS.USERS.BY_USERNAME(username));
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    },
};

export default userService;
