// Centralizamos todas las rutas del backend

const ENDPOINTS = {
    // AUTENTICACIÓN
    AUTH: {
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        ME: "/auth/me",
        CHANGE_PASSWORD: "/auth/change-password",
    },

    // USUARIOS
    USERS: {
        BASE: "/usuarios",
        BY_ID: (id) => `/usuarios/${id}`,
        ACTIVATE: (id) => `/usuarios/${id}/activar`,
        DEACTIVATE: (id) => `/usuarios/${id}/desactivar`,
        BY_USERNAME: (username) => `/usuarios/username/${username}`,
        BY_ESTADO: "/usuarios/estado",
        SEARCH: "/usuarios/buscar",
    },

    // ROLES
    ROLES: {
        BASE: "/roles",
        BY_ID: (id) => `/roles/${id}`,
        PERMISSIONS: (id) => `/roles/${id}/permisos`,
    },

    // PRODUCTOS
    PRODUCTS: {
        BASE: "/productos",
        BY_ID: (id) => `/productos/${id}`,
        BY_CODE: (code) => `/productos/codigo/${code}`,
        SEARCH: "/productos/buscar",
        BY_CATEGORY: (idCategoria) => `/productos/categoria/${idCategoria}`,
        BY_GENDER: "/productos/genero",
        BY_BRAND: "/productos/marca",
        BY_PRICE_RANGE: "/productos/precio-rango",
        STOCK_LOW: "/productos/stock-bajo",
        STOCK_OUT: "/productos/agotados",
        UPDATE_STOCK: (id) => `/productos/${id}/stock`,
        MARGIN: (id) => `/productos/${id}/margen`,
    },

    // CATEGORÍAS
    CATEGORIES: {
        BASE: "/categorias",
        BY_ID: (id) => `/categorias/${id}`,
        ACTIVE: "/categorias/activas",
    },

    // PROVEEDORES
    SUPPLIERS: {
        BASE: "/proveedores",
        BY_ID: (id) => `/proveedores/${id}`,
        BY_RUC: (ruc) => `/proveedores/ruc/${ruc}`,
        ACTIVE: "/proveedores/activos",
        SEARCH: "/proveedores/buscar",
    },

    // CLIENTES
    CLIENTS: {
        BASE: "/clientes",
        BY_ID: (id) => `/clientes/${id}`,
        BY_DOCUMENT: "/clientes/documento",
        SEARCH: "/clientes/buscar",
        ACTIVE: "/clientes/activos",
        HISTORY: (id) => `/clientes/${id}/historial`,
    },

    // VENTAS
    SALES: {
        BASE: "/ventas",
        BY_ID: (id) => `/ventas/${id}`,
        BY_CODE: (code) => `/ventas/codigo/${code}`,
        SEARCH: "/ventas/buscar",
        CANCEL: (id) => `/ventas/${id}/anular`,
        CAN_CANCEL: (id) => `/ventas/${id}/puede-anular`,
        BY_PERIOD: "/ventas/periodo",
        TOTAL: "/ventas/total",
        COUNT: "/ventas/contar",
    },

    // DEVOLUCIONES
    RETURNS: {
        BASE: "/devoluciones",
        BY_ID: (id) => `/devoluciones/${id}`,
        BY_SALE: (idVenta) => `/devoluciones/venta/${idVenta}`,
        PROCESS: "/devoluciones/procesar",
        SEARCH: "/devoluciones/buscar",
    },

    // INVENTARIO
    INVENTORY: {
        BASE: "/inventario",
        MOVEMENTS: "/inventario/movimientos",
        BY_PRODUCT: (idProducto) => `/inventario/producto/${idProducto}`,
        REGISTER_ENTRY: "/inventario/entrada",
        REGISTER_EXIT: "/inventario/salida",
        REGISTER_ADJUSTMENT: "/inventario/ajuste",
        REGISTER_RETURN: "/inventario/devolucion",
    },

    // ALERTAS (NOTIFICACIONES)
    ALERTS: {
        BASE: "/alertas",
        BY_ID: (id) => `/alertas/${id}`,
        UNREAD: "/alertas/no-leidas",
        MARK_READ: (id) => `/alertas/${id}/marcar-leida`,
        MARK_ALL_READ: "/alertas/marcar-todas-leidas",
        DELETE: (id) => `/alertas/${id}`,
        BY_USER: (idUsuario) => `/alertas/usuario/${idUsuario}`,
        COUNT_UNREAD: "/alertas/contar-no-leidas",
    },

    // PEDIDOS
    ORDERS: {
        BASE: "/pedidos",
        BY_ID: (id) => `/pedidos/${id}`,
        UPDATE_STATUS: (id) => `/pedidos/${id}/estado`,
        CANCEL: (id) => `/pedidos/${id}/cancelar`,
        DELAYED: "/pedidos/atrasados",
        SEARCH: "/pedidos/buscar",
    },

    // REPORTES
    REPORTS: {
        SALES: "/reportes/ventas",
        SALES_BY_PERIOD: "/reportes/ventas-periodo",
        SALES_BY_CATEGORY: "/reportes/ventas-categoria",
        SALES_BY_PRODUCT: "/reportes/ventas-producto",
        SALES_BY_SELLER: "/reportes/ventas-vendedor",
        INVENTORY: "/reportes/inventario",
        STOCK_LOW: "/reportes/stock-bajo",
        MOVEMENTS: "/reportes/movimientos",
        RETURNS: "/reportes/devoluciones",
        DASHBOARD: "/reportes/dashboard",
        EXPORT_EXCEL: "/reportes/exportar/excel",
        EXPORT_PDF: "/reportes/exportar/pdf",
    },

    // AUDITORÍA
    AUDIT: {
        BASE: "/auditoria",
        BY_USER: (idUsuario) => `/auditoria/usuario/${idUsuario}`,
        BY_ACTION: "/auditoria/accion",
        BY_DATE: "/auditoria/fecha",
        EXPORT: "/auditoria/exportar",
    },
};

export default ENDPOINTS;
