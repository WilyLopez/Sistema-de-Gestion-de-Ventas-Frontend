//src/services/DevolucionService.js
import { get, post, put } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const devolucionService = {
    create: async (devolucionData) => {
        const response = await post(ENDPOINTS.DEVOLUCIONES.BASE, devolucionData);
        return response;
    },

    approve: async (id, userId) => {
        const response = await put(ENDPOINTS.DEVOLUCIONES.APROBAR(id), {
            idUsuario: userId
        });
        return response;
    },

    reject: async (id, userId, motivo) => {
        const response = await put(ENDPOINTS.DEVOLUCIONES.RECHAZAR(id), {
            idUsuario: userId,
            motivo
        });
        return response;
    },

    complete: async (id, userId) => {
        const response = await put(ENDPOINTS.DEVOLUCIONES.COMPLETAR(id), {
            idUsuario: userId
        });
        return response;
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.BY_ID(id));
        return response;
    },

    getByVenta: async (idVenta) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.BY_VENTA(idVenta));
        return response;
    },

    search: async (filters = {}, page = 0, size = 20) => {
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const params = { page, size, ...cleanFilters };
        const response = await get(ENDPOINTS.DEVOLUCIONES.BUSCAR, { params });
        return response;
    },

    verifyPlazo: async (idVenta) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.VERIFICAR_PLAZO(idVenta));
        return response;
    },

    validateQuantity: async (idVenta, idProducto, cantidad) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.VALIDAR_CANTIDAD, {
            params: { idVenta, idProducto, cantidad }
        });
        return response;
    },

    getByPeriodo: async (fechaInicio, fechaFin) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.BY_PERIODO, {
            params: { fechaInicio, fechaFin }
        });
        return response;
    },

    getAnalisisMotivos: async (fechaInicio, fechaFin) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.ANALISIS_MOTIVOS, {
            params: { fechaInicio, fechaFin }
        });
        return response;
    },

    getProductosMasDevueltos: async (fechaInicio, fechaFin, limite = 10) => {
        const response = await get(ENDPOINTS.DEVOLUCIONES.PRODUCTOS_MAS_DEVUELTOS, {
            params: { fechaInicio, fechaFin, limite }
        });
        return response;
    },

    getEstadoClass: (estado) => {
        const classMap = {
            'PENDIENTE': 'badge-warning',
            'APROBADA': 'badge-success',
            'RECHAZADA': 'badge-danger',
            'COMPLETADA': 'badge-info'
        };
        return classMap[estado] || 'badge-secondary';
    },

    getEstadoIcon: (estado) => {
        const iconMap = {
            'PENDIENTE': 'clock',
            'APROBADA': 'check-circle',
            'RECHAZADA': 'x-circle',
            'COMPLETADA': 'package-check'
        };
        return iconMap[estado] || 'file-text';
    },

    formatDate: (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
};

export default devolucionService;