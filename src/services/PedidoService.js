import { get, post, put, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const pedidoService = {
    create: async (pedidoData) => {
        const response = await post(ENDPOINTS.PEDIDOS.BASE, pedidoData);
        return response;
    },

    updateEstado: async (id, estado, observaciones = null) => {
        const body = { estado };
        if (observaciones) body.observaciones = observaciones;
        
        const response = await put(ENDPOINTS.PEDIDOS.ACTUALIZAR_ESTADO(id), body);
        return response;
    },

    cancel: async (id, motivo) => {
        const response = await put(ENDPOINTS.PEDIDOS.CANCELAR(id), { motivo });
        return response;
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.PEDIDOS.BY_ID(id));
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
        const response = await get(ENDPOINTS.PEDIDOS.BUSCAR, { params });
        return response;
    },

    getAtrasados: async () => {
        const response = await get(ENDPOINTS.PEDIDOS.ATRASADOS);
        return response;
    },

    getByCliente: async (idCliente, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PEDIDOS.BY_CLIENTE(idCliente),
            page,
            size
        );
        return response;
    },

    getByUsuario: async (idUsuario, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PEDIDOS.BY_USUARIO(idUsuario),
            page,
            size
        );
        return response;
    },

    getByEstado: async (estado, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PEDIDOS.BY_ESTADO(estado),
            page,
            size
        );
        return response;
    },

    generateCodigo: async () => {
        const response = await get(ENDPOINTS.PEDIDOS.GENERAR_CODIGO);
        return response.codigo;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.PEDIDOS.BASE, page, size);
        return response;
    },

    getEstadoClass: (estado) => {
        const classMap = {
            'PENDIENTE': 'badge-warning',
            'CONFIRMADO': 'badge-info',
            'PREPARANDO': 'badge-primary',
            'ENVIADO': 'badge-secondary',
            'ENTREGADO': 'badge-success',
            'CANCELADO': 'badge-danger'
        };
        return classMap[estado] || 'badge-secondary';
    },

    getEstadoIcon: (estado) => {
        const iconMap = {
            'PENDIENTE': 'clock',
            'CONFIRMADO': 'check-circle',
            'PREPARANDO': 'package',
            'ENVIADO': 'truck',
            'ENTREGADO': 'package-check',
            'CANCELADO': 'x-circle'
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

export default pedidoService;