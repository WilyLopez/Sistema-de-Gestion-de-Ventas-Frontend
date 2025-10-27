// src/services/ProveedorService.js
import { get, post, put, del, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const ProveedorService = {
    create: async (proveedorData) => {
        const response = await post(ENDPOINTS.PROVEEDORES.BASE, proveedorData);
        return response;
    },

    update: async (id, proveedorData) => {
        const response = await put(ENDPOINTS.PROVEEDORES.BY_ID(id), proveedorData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.PROVEEDORES.BY_ID(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.PROVEEDORES.BY_ID(id));
        return response;
    },

    getByRuc: async (ruc) => {
        const response = await get(ENDPOINTS.PROVEEDORES.BY_RUC(ruc));
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.PROVEEDORES.BASE, page, size);
        return response;
    },

    getActive: async () => {
        const response = await get(ENDPOINTS.PROVEEDORES.ACTIVOS);
        return response;
    },

    searchByRazonSocial: async (razonSocial, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PROVEEDORES.BUSCAR,
            page,
            size,
            { razonSocial }
        );
        return response;
    },

    validateRuc: async (ruc) => {
        const response = await get(ENDPOINTS.PROVEEDORES.VALIDAR_RUC(ruc));
        return response;
    },

    existsRuc: async (ruc) => {
        try {
            const response = await get(ENDPOINTS.PROVEEDORES.EXISTE_RUC(ruc));
            return response.existe;
        } catch (error) {
            console.warn('Error checking RUC existence:', error);
            return false;
        }
    },

    getStatistics: async () => {
        const response = await get(ENDPOINTS.PROVEEDORES.ESTADISTICAS);
        return response;
    },

    validateRucFormat: (ruc) => {
        if (!ruc || typeof ruc !== 'string') return false;
        const rucPattern = /^(10|15|17|20)\d{9}$/;
        return rucPattern.test(ruc);
    },
};

export default ProveedorService;