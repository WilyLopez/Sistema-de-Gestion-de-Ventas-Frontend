import { get, post, put, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const alertService = {
    getUnread: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.ALERTAS.NO_LEIDAS, page, size);
        return response;
    },

    getCritical: async () => {
        const response = await get(ENDPOINTS.ALERTAS.CRITICAS);
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.ALERTAS.BASE, page, size);
        return response;
    },

    markAsRead: async (alertId, userId) => {
        await put(ENDPOINTS.ALERTAS.MARCAR_LEIDA(alertId), null, {
            params: { idUsuario: userId }
        });
    },

    searchWithFilters: async (filters = {}, page = 0, size = 20) => {
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const params = { page, size, ...cleanFilters };
        const response = await get(ENDPOINTS.ALERTAS.BUSCAR, { params });
        return response;
    },

    countByUrgency: async () => {
        const response = await get(ENDPOINTS.ALERTAS.CONTEO_POR_URGENCIA);
        return response;
    },

    verifyAndGenerate: async () => {
        const response = await post(ENDPOINTS.ALERTAS.VERIFICAR);
        return response;
    },

    getSummary: async () => {
        const response = await get(ENDPOINTS.ALERTAS.RESUMEN);
        return response;
    },

    getById: async (id) => {
        const response = await get(`${ENDPOINTS.ALERTAS.BASE}/${id}`);
        return response;
    },

    markMultipleAsRead: async (alertIds, userId) => {
        const promises = alertIds.map(id => 
            alertService.markAsRead(id, userId).catch(err => ({
                id,
                error: err.message
            }))
        );
        return await Promise.all(promises);
    },

    getByProduct: async (productId, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { idProducto: productId },
            page,
            size
        );
    },

    getByType: async (tipo, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { tipoAlerta: tipo },
            page,
            size
        );
    },

    getByDateRange: async (fechaInicio, fechaFin, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { fechaInicio, fechaFin },
            page,
            size
        );
    },

    hasCriticalAlerts: async () => {
        const criticas = await alertService.getCritical();
        return criticas.length > 0;
    },

    getTotalUnread: async () => {
        const conteo = await alertService.countByUrgency();
        return Object.values(conteo).reduce((sum, val) => sum + val, 0);
    },

    startPolling: (callback, interval = 30000) => {
        const poll = async () => {
            try {
                const resumen = await alertService.getSummary();
                callback(resumen);
            } catch (error) {
                console.error('Error en polling de alertas:', error);
            }
        };

        poll();
        const intervalId = setInterval(poll, interval);
        return () => clearInterval(intervalId);
    },
};

export default alertService;