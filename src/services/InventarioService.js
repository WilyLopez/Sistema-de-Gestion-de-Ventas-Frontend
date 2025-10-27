// src/services/InventarioService.js
import { get, post, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const inventarioService = {
    registerEntrada: async (entradaData) => {
        const response = await post(ENDPOINTS.INVENTARIO.ENTRADA, entradaData);
        return response;
    },

    registerAjuste: async (ajusteData) => {
        const response = await post(ENDPOINTS.INVENTARIO.AJUSTE, ajusteData);
        return response;
    },

    registerDevolucion: async (devolucionData) => {
        const response = await post(ENDPOINTS.INVENTARIO.DEVOLUCION, devolucionData);
        return response;
    },

    getByProducto: async (idProducto, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.INVENTARIO.BY_PRODUCTO(idProducto),
            page,
            size
        );
        return response;
    },

    getTrazabilidad: async (idProducto) => {
        const response = await get(ENDPOINTS.INVENTARIO.TRAZABILIDAD(idProducto));
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
        const response = await get(ENDPOINTS.INVENTARIO.BUSCAR, { params });
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.INVENTARIO.BASE, page, size);
        return response;
    },

    getResumenProducto: async (idProducto, fechaInicio = null, fechaFin = null) => {
        const params = {};
        if (fechaInicio) params.fechaInicio = fechaInicio;
        if (fechaFin) params.fechaFin = fechaFin;

        const response = await get(
            ENDPOINTS.INVENTARIO.RESUMEN_PRODUCTO(idProducto),
            { params }
        );
        return response;
    },

    formatDate: (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },

    getTipoMovimientoClass: (tipo) => {
        const classMap = {
            'ENTRADA': 'badge-success',
            'SALIDA': 'badge-danger',
            'AJUSTE': 'badge-warning',
            'DEVOLUCION': 'badge-info'
        };
        return classMap[tipo] || 'badge-secondary';
    },

    getTipoMovimientoIcon: (tipo) => {
        const iconMap = {
            'ENTRADA': 'arrow-down-circle',
            'SALIDA': 'arrow-up-circle',
            'AJUSTE': 'edit',
            'DEVOLUCION': 'rotate-ccw'
        };
        return iconMap[tipo] || 'file-text';
    },

    getCurrentMonthRange: () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        return {
            fechaInicio: inventarioService.formatDate(firstDay),
            fechaFin: inventarioService.formatDate(lastDay)
        };
    },

    calculateStockDifference: (stockAnterior, stockNuevo) => {
        const diferencia = Math.abs(stockNuevo - stockAnterior);
        let tipo = 'sin_cambio';
        
        if (stockNuevo > stockAnterior) {
            tipo = 'incremento';
        } else if (stockNuevo < stockAnterior) {
            tipo = 'decremento';
        }
        
        return { diferencia, tipo };
    },

    validateEntrada: (entradaData) => {
        const errores = [];

        if (!entradaData.idProducto) {
            errores.push('Debe seleccionar un producto');
        }

        if (!entradaData.cantidad || entradaData.cantidad < 1) {
            errores.push('La cantidad debe ser mayor a 0');
        }

        if (entradaData.cantidad > 100000) {
            errores.push('La cantidad no puede exceder 100,000 unidades');
        }

        if (!entradaData.idUsuario) {
            errores.push('ID de usuario es requerido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    },

    validateAjuste: (ajusteData) => {
        const errores = [];

        if (!ajusteData.idProducto) {
            errores.push('Debe seleccionar un producto');
        }

        if (ajusteData.nuevoStock === null || ajusteData.nuevoStock === undefined) {
            errores.push('El nuevo stock es obligatorio');
        }

        if (ajusteData.nuevoStock < 0) {
            errores.push('El stock no puede ser negativo');
        }

        if (!ajusteData.observacion || ajusteData.observacion.trim().length < 10) {
            errores.push('La observación debe tener al menos 10 caracteres');
        }

        if (ajusteData.observacion && ajusteData.observacion.length > 500) {
            errores.push('La observación no puede exceder 500 caracteres');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }
};

export default inventarioService;