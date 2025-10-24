import { get, post, put, paginated, search } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

// Servicio de gestión de ventas
const saleService = {
    /**
     * Registrar nueva venta con detalles
     * Calcula automáticamente subtotal, IGV y total
     * Actualiza stock de productos automáticamente
     * @param {Object} saleData - Datos de la venta
     * @param {number} saleData.idCliente - ID del cliente
     * @param {number} saleData.idMetodoPago - ID del método de pago
     * @param {string} saleData.tipoComprobante - Tipo de comprobante
     * @param {string} [saleData.observaciones] - Observaciones (max 500)
     * @param {Array<Object>} saleData.detalles - Detalles de la venta
     * @param {number} saleData.detalles[].idProducto - ID del producto
     * @param {number} saleData.detalles[].cantidad - Cantidad (min 1)
     * @param {number} saleData.detalles[].precioUnitario - Precio unitario
     * @param {number} [saleData.detalles[].descuento=0] - Descuento
     * @returns {Promise<Object>} Venta creada con código generado
     */
    create: async (saleData) => {
        const response = await post(ENDPOINTS.SALES.BASE, saleData);
        return response;
    },

    /**
     * Obtener venta por ID con todos sus detalles
     * @param {number} id - ID de la venta
     * @returns {Promise<Object>} Venta encontrada
     */
    getById: async (id) => {
        const response = await get(ENDPOINTS.SALES.BY_ID(id));
        return response;
    },

    /**
     * Obtener venta por código único
     * @param {string} code - Código de la venta (ej: V-20241022-00015)
     * @returns {Promise<Object>} Venta encontrada
     */
    getByCode: async (code) => {
        const response = await get(ENDPOINTS.SALES.BY_CODE(code));
        return response;
    },

    /**
     * Listar todas las ventas con paginación
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @param {string} [sort='fechaCreacion,desc'] - Campo de ordenamiento
     * @returns {Promise<Object>} Página de ventas
     */
    getAll: async (page = 0, size = 20, sort = "fechaCreacion,desc") => {
        const response = await paginated(ENDPOINTS.SALES.BASE, page, size, {
            sort,
        });
        return response;
    },

    /**
     * Buscar ventas con múltiples filtros
     * Todos los parámetros son opcionales
     * @param {Object} filters - Filtros de búsqueda
     * @param {string} [filters.codigoVenta] - Código de venta
     * @param {number} [filters.idCliente] - ID del cliente
     * @param {number} [filters.idUsuario] - ID del usuario/vendedor
     * @param {string} [filters.estado] - Estado: PAGADO, ANULADO, PENDIENTE
     * @param {number} [filters.idMetodoPago] - ID del método de pago
     * @param {string} [filters.fechaInicio] - Fecha inicial (ISO 8601)
     * @param {string} [filters.fechaFin] - Fecha final (ISO 8601)
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de ventas filtradas
     */
    searchWithFilters: async (filters = {}, page = 0, size = 20) => {
        const params = {
            ...filters,
            page,
            size,
        };

        const response = await search(ENDPOINTS.SALES.SEARCH, params);
        return response;
    },

    /**
     * Anular una venta (solo Admin)
     * Solo permite anular ventas con menos de 24 horas y estado PAGADO
     * Restaura automáticamente el stock de productos
     * @param {number} id - ID de la venta
     * @param {string} motivo - Motivo de anulación (10-500 caracteres)
     * @returns {Promise<void>}
     */
    cancel: async (id, motivo) => {
        await put(ENDPOINTS.SALES.CANCEL(id), { motivo });
    },

    /**
     * Verificar si una venta puede ser anulada
     * Útil para habilitar/deshabilitar botón de anular en UI
     * @param {number} id - ID de la venta
     * @returns {Promise<Object>} { puedeAnularse: boolean }
     */
    canCancel: async (id) => {
        const response = await get(ENDPOINTS.SALES.CAN_CANCEL(id));
        return response;
    },

    /**
     * Obtener ventas por período de fechas
     * @param {string} fechaInicio - Fecha inicial (ISO 8601)
     * @param {string} fechaFin - Fecha final (ISO 8601)
     * @returns {Promise<Array>} Lista de ventas en el período
     */
    getByPeriod: async (fechaInicio, fechaFin) => {
        const response = await search(ENDPOINTS.SALES.BY_PERIOD, {
            fechaInicio,
            fechaFin,
        });
        return response;
    },

    /**
     * Obtener estadísticas de ventas por período
     * @param {string} fechaInicio - Fecha inicial (ISO 8601)
     * @param {string} fechaFin - Fecha final (ISO 8601)
     * @returns {Promise<Object>} { totalVendido: number, cantidadVentas: number }
     */
    getStatistics: async (fechaInicio, fechaFin) => {
        const response = await get(`${ENDPOINTS.SALES.BASE}/estadisticas`, {
            params: {
                fechaInicio,
                fechaFin,
            },
        });
        return response;
    },

    /**
     * Obtener total vendido en un período
     * @param {string} fechaInicio - Fecha inicial (ISO 8601)
     * @param {string} fechaFin - Fecha final (ISO 8601)
     * @returns {Promise<number>} Total vendido
     */
    getTotalSales: async (fechaInicio, fechaFin) => {
        const response = await search(ENDPOINTS.SALES.TOTAL, {
            fechaInicio,
            fechaFin,
        });
        return response;
    },

    /**
     * Contar ventas en un período
     * @param {string} fechaInicio - Fecha inicial (ISO 8601)
     * @param {string} fechaFin - Fecha final (ISO 8601)
     * @returns {Promise<number>} Cantidad de ventas
     */
    countSales: async (fechaInicio, fechaFin) => {
        const response = await search(ENDPOINTS.SALES.COUNT, {
            fechaInicio,
            fechaFin,
        });
        return response;
    },
};

export default saleService;
