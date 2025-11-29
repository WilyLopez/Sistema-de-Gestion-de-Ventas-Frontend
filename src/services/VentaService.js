// src/services/VentaService.js
import { get, post, put, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const VentaService = {
    create: async (ventaData) => {
        const response = await post(ENDPOINTS.VENTAS.BASE, ventaData);
        return response;
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.VENTAS.BY_ID(id));
        return response;
    },

    getByCodigo: async (codigoVenta) => {
        const response = await get(ENDPOINTS.VENTAS.BY_CODIGO(codigoVenta));
        return response;
    },

    getAll: async (page = 0, size = 20, sort = 'fechaCreacion,desc') => {
        const response = await paginated(ENDPOINTS.VENTAS.BASE, page, size, {
            sort
        });
        return response;
    },

    buscar: async (filtros = {}, page = 0, size = 20) => {
        const params = {
            ...filtros,
            page,
            size
        };

        const response = await get(ENDPOINTS.VENTAS.BUSCAR, { params });
        return response;
    },

    anular: async (id, motivo) => {
        await put(ENDPOINTS.VENTAS.ANULAR(id), { motivo });
    },

    puedeAnularse: async (id) => {
        const response = await get(ENDPOINTS.VENTAS.PUEDE_ANULARSE(id));
        return response.puedeAnularse;
    },

    getByPeriodo: async (fechaInicio, fechaFin) => {
        const response = await get(ENDPOINTS.VENTAS.BY_PERIODO, {
            params: { fechaInicio, fechaFin }
        });
        return response;
    },

    getStatistics: async (fechaInicio, fechaFin) => {
        const response = await get(ENDPOINTS.VENTAS.ESTADISTICAS, {
            params: { fechaInicio, fechaFin }
        });
        return response;
    },

    getSellerStatistics: async (userId, fechaInicio, fechaFin) => {
        const response = await get(ENDPOINTS.VENTAS.VENDEDOR_ESTADISTICAS, {
            params: { 
                idUsuario: userId,
                fechaInicio: fechaInicio ? new Date(fechaInicio).toISOString() : undefined,
                fechaFin: fechaFin ? new Date(fechaFin).toISOString() : undefined,
            }
        });
        return response;
    },

    calcularDetalleVenta: (cantidad, precioUnitario, descuento = 0) => {
        const subtotal = cantidad * precioUnitario;
        const descuentoMonto = subtotal * (descuento / 100);
        const subtotalConDescuento = subtotal - descuentoMonto;
        
        return {
            subtotal,
            descuentoMonto,
            subtotalConDescuento
        };
    },

    validarStock: (productos) => {
        for (const producto of productos) {
            if (producto.cantidad > producto.stock) {
                throw new Error(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`);
            }
        }
        return true;
    },

    formatCodigoVenta: (id) => {
        const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `V-${fecha}-${String(id).padStart(5, '0')}`;
    }
};

export default VentaService;