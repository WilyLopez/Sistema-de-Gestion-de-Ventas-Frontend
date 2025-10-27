//src/services/CategoriaService.js
import { get, post, put, del, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const categoriaService = {
    create: async (categoriaData) => {
        const response = await post(ENDPOINTS.CATEGORIAS.BASE, categoriaData);
        return response;
    },

    update: async (id, categoriaData) => {
        const response = await put(ENDPOINTS.CATEGORIAS.BY_ID(id), categoriaData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.CATEGORIAS.BY_ID(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.CATEGORIAS.BY_ID(id));
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.CATEGORIAS.BASE, page, size);
        return response;
    },

    getActive: async () => {
        const response = await get(ENDPOINTS.CATEGORIAS.ACTIVAS);
        return response;
    },

    searchByName: async (nombre, page = 0, size = 20) => {
        const response = await get(ENDPOINTS.CATEGORIAS.BUSCAR, {
            params: { nombre, page, size }
        });
        return response;
    },

    hasProducts: async (id) => {
        const response = await get(ENDPOINTS.CATEGORIAS.TIENE_PRODUCTOS(id));
        return response.tieneProductos;
    },

    existsName: async (nombre) => {
        try {
            const response = await get(ENDPOINTS.CATEGORIAS.EXISTE_NOMBRE, {
                params: { nombre }
            });
            return response.existe;
        } catch (error) {
            console.warn('Error al verificar existencia de nombre de categoría:', error);
        }
    },
};

export default categoriaService;